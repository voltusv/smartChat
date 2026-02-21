"""
Tool Executor Service

Executes tools called by the LLM. Handles database queries, REST API calls, etc.
"""

import json
import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import DBConnection, Tool
from app.services.db_connector import DBConnector


class ToolExecutor:
    """Executes tools requested by the LLM."""
    
    def __init__(self, db: AsyncSession, tenant_id: uuid.UUID):
        self.db = db
        self.tenant_id = tenant_id
        self._connectors: dict[str, DBConnector] = {}
    
    async def get_available_tools(self) -> list[dict]:
        """
        Get all tools available for the tenant.
        Returns OpenAI function calling format.
        """
        # Get all enabled tools
        result = await self.db.execute(
            select(Tool)
            .where(Tool.tenant_id == self.tenant_id)
            .where(Tool.enabled == True)
        )
        tools = result.scalars().all()
        
        # Get all enabled DB connections for general querying
        result = await self.db.execute(
            select(DBConnection)
            .where(DBConnection.tenant_id == self.tenant_id)
            .where(DBConnection.enabled == True)
        )
        db_connections = result.scalars().all()
        
        openai_tools = []
        
        # Add custom tools
        for tool in tools:
            openai_tools.append(self._tool_to_openai_format(tool))
        
        # Add a general database query tool for each connection
        for conn in db_connections:
            openai_tools.append({
                "type": "function",
                "function": {
                    "name": f"query_{self._sanitize_name(conn.name)}",
                    "description": f"Query the '{conn.name}' database. {conn.description or ''}\n\nSchema:\n{conn.schema_info or 'No schema info available.'}",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": self._get_query_description(conn.db_type),
                            },
                        },
                        "required": ["query"],
                    },
                },
            })
        
        return openai_tools
    
    def _get_query_description(self, db_type: str) -> str:
        if db_type == "mongodb":
            return 'MongoDB query in JSON format: {"collection": "users", "operation": "find", "filter": {"status": "active"}, "limit": 10}'
        else:
            return "SQL query to execute. Use SELECT only for safety."
    
    def _sanitize_name(self, name: str) -> str:
        """Convert name to valid function name."""
        return "".join(c if c.isalnum() else "_" for c in name.lower())
    
    def _tool_to_openai_format(self, tool: Tool) -> dict:
        """Convert a Tool model to OpenAI function format."""
        config = tool.config_json or {}
        
        return {
            "type": "function",
            "function": {
                "name": tool.name,
                "description": tool.description,
                "parameters": config.get("parameters", {
                    "type": "object",
                    "properties": {},
                    "required": [],
                }),
            },
        }
    
    async def execute_tool(self, tool_name: str, arguments: dict) -> str:
        """
        Execute a tool and return the result as a string.
        
        Args:
            tool_name: Name of the tool to execute
            arguments: Arguments passed by the LLM
            
        Returns:
            String result to send back to the LLM
        """
        # Check if it's a database query tool (query_<connection_name>)
        if tool_name.startswith("query_"):
            conn_name = tool_name[6:]  # Remove "query_" prefix
            return await self._execute_db_query(conn_name, arguments)
        
        # Look for a custom tool
        result = await self.db.execute(
            select(Tool)
            .where(Tool.tenant_id == self.tenant_id)
            .where(Tool.name == tool_name)
            .where(Tool.enabled == True)
        )
        tool = result.scalar_one_or_none()
        
        if not tool:
            return json.dumps({"error": f"Tool '{tool_name}' not found"})
        
        if tool.tool_type == "db_query":
            return await self._execute_custom_db_query(tool, arguments)
        elif tool.tool_type == "rest_api":
            return await self._execute_rest_api(tool, arguments)
        else:
            return json.dumps({"error": f"Unknown tool type: {tool.tool_type}"})
    
    async def _execute_db_query(self, conn_name_sanitized: str, arguments: dict) -> str:
        """Execute a query against a database connection."""
        # Find the connection by sanitized name
        result = await self.db.execute(
            select(DBConnection)
            .where(DBConnection.tenant_id == self.tenant_id)
            .where(DBConnection.enabled == True)
        )
        connections = result.scalars().all()
        
        conn = None
        for c in connections:
            if self._sanitize_name(c.name) == conn_name_sanitized:
                conn = c
                break
        
        if not conn:
            return json.dumps({"error": f"Database connection not found"})
        
        query = arguments.get("query", "")
        if not query:
            return json.dumps({"error": "No query provided"})
        
        # Safety check: only allow SELECT for SQL databases
        if conn.db_type in ("postgresql", "mysql"):
            query_upper = query.strip().upper()
            if not query_upper.startswith("SELECT"):
                return json.dumps({"error": "Only SELECT queries are allowed for safety"})
        
        # Execute the query
        connector = DBConnector(
            db_type=conn.db_type,
            host=conn.host,
            port=conn.port,
            database=conn.database,
            username=conn.username,
            password=conn.password,
            connection_string=conn.connection_string,
        )
        
        try:
            results = await connector.execute_query(query)
            # Limit results to prevent token overflow
            if len(results) > 50:
                results = results[:50]
                results.append({"_note": "Results truncated to 50 rows"})
            return json.dumps(results, default=str, indent=2)
        except Exception as e:
            return json.dumps({"error": str(e)})
        finally:
            await connector.close()
    
    async def _execute_custom_db_query(self, tool: Tool, arguments: dict) -> str:
        """Execute a custom predefined database query."""
        config = tool.config_json or {}
        query_template = config.get("query_template", "")
        
        if not query_template:
            return json.dumps({"error": "No query template defined"})
        
        # Get the connection
        if not tool.db_connection_id:
            return json.dumps({"error": "No database connection linked to this tool"})
        
        result = await self.db.execute(
            select(DBConnection).where(DBConnection.id == tool.db_connection_id)
        )
        conn = result.scalar_one_or_none()
        
        if not conn:
            return json.dumps({"error": "Database connection not found"})
        
        # Substitute parameters in the query template
        query = query_template
        for key, value in arguments.items():
            query = query.replace(f"{{{key}}}", str(value))
        
        connector = DBConnector(
            db_type=conn.db_type,
            host=conn.host,
            port=conn.port,
            database=conn.database,
            username=conn.username,
            password=conn.password,
            connection_string=conn.connection_string,
        )
        
        try:
            results = await connector.execute_query(query)
            if len(results) > 50:
                results = results[:50]
            return json.dumps(results, default=str, indent=2)
        except Exception as e:
            return json.dumps({"error": str(e)})
        finally:
            await connector.close()
    
    async def _execute_rest_api(self, tool: Tool, arguments: dict) -> str:
        """Execute a REST API call."""
        import httpx
        
        config = tool.config_json or {}
        url_template = config.get("url", "")
        method = config.get("method", "GET").upper()
        headers = config.get("headers", {})
        
        if not url_template:
            return json.dumps({"error": "No URL defined"})
        
        # Substitute parameters in URL
        url = url_template
        for key, value in arguments.items():
            url = url.replace(f"{{{key}}}", str(value))
        
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                if method == "GET":
                    response = await client.get(url, headers=headers)
                elif method == "POST":
                    body = config.get("body_template", {})
                    for key, value in arguments.items():
                        body = json.loads(
                            json.dumps(body).replace(f"{{{key}}}", str(value))
                        )
                    response = await client.post(url, headers=headers, json=body)
                else:
                    return json.dumps({"error": f"Unsupported method: {method}"})
                
                return response.text[:5000]  # Limit response size
        except Exception as e:
            return json.dumps({"error": str(e)})
    
    def get_tools_system_prompt(self, tools: list[dict]) -> str:
        """Generate a system prompt snippet describing available tools."""
        if not tools:
            return ""
        
        prompt = "\n\nYou have access to the following tools to query business data:\n"
        for tool in tools:
            func = tool.get("function", {})
            prompt += f"\n- {func.get('name')}: {func.get('description', '')[:200]}"
        
        prompt += "\n\nUse these tools when the user asks questions about business data. Always try to answer using the available data."
        return prompt
