"""
Database Connector Service

Connects to external databases (PostgreSQL, MySQL, MongoDB) and executes queries.
Used by the AI to retrieve business data.
"""

import json
from typing import Any
from datetime import datetime, date
from decimal import Decimal
from uuid import UUID


class DBConnector:
    """Connects to external databases and runs queries."""
    
    def __init__(self, db_type: str, host: str = None, port: int = None, 
                 database: str = None, username: str = None, password: str = None,
                 connection_string: str = None):
        self.db_type = db_type.lower()
        self.host = host
        self.port = port
        self.database = database
        self.username = username
        self.password = password
        self.connection_string = connection_string
        self._connection = None
    
    async def connect(self):
        """Establish connection to the database."""
        if self.db_type == "postgresql":
            await self._connect_postgresql()
        elif self.db_type == "mysql":
            await self._connect_mysql()
        elif self.db_type == "mongodb":
            await self._connect_mongodb()
        else:
            raise ValueError(f"Unsupported database type: {self.db_type}")
    
    async def _connect_postgresql(self):
        import asyncpg
        self._connection = await asyncpg.connect(
            host=self.host,
            port=self.port,
            database=self.database,
            user=self.username,
            password=self.password or None,
        )
    
    async def _connect_mysql(self):
        import aiomysql
        self._connection = await aiomysql.connect(
            host=self.host,
            port=self.port,
            db=self.database,
            user=self.username,
            password=self.password,
        )
    
    async def _connect_mongodb(self):
        from motor.motor_asyncio import AsyncIOMotorClient
        from urllib.parse import urlparse, urlencode, parse_qs, urlunparse

        if self.connection_string:
            # Use full connection string (supports replica sets, special auth, etc.)
            uri = self.connection_string
            # Extract database name from connection string
            parsed = urlparse(uri)
            db_name = parsed.path.lstrip('/').split('?')[0] if parsed.path else self.database
            # Add directConnection=true if not already set to avoid
            # unreachable internal replica set hostnames
            query_params = parse_qs(parsed.query)
            if 'directConnection' not in query_params and 'directconnection' not in query_params:
                separator = '&' if parsed.query else ''
                new_query = parsed.query + separator + 'directConnection=true'
                uri = urlunparse(parsed._replace(query=new_query))
            self._client = AsyncIOMotorClient(uri)
            self._connection = self._client[db_name]
        else:
            # Build URI from individual params
            uri = f"mongodb://{self.username}:{self.password}@{self.host}:{self.port}/?directConnection=true"
            self._client = AsyncIOMotorClient(uri)
            self._connection = self._client[self.database]
    
    async def close(self):
        """Close the database connection."""
        if self._connection is not None:
            if self.db_type == "mongodb":
                self._client.close()
            else:
                await self._connection.close()
            self._connection = None
    
    async def execute_query(self, query: str, params: dict = None) -> list[dict]:
        """
        Execute a query and return results as list of dicts.
        
        For SQL databases: executes the SQL query
        For MongoDB: expects a JSON query specification
        """
        if self._connection is None:
            await self.connect()
        
        try:
            if self.db_type == "postgresql":
                return await self._execute_postgresql(query, params)
            elif self.db_type == "mysql":
                return await self._execute_mysql(query, params)
            elif self.db_type == "mongodb":
                return await self._execute_mongodb(query, params)
        except Exception as e:
            return [{"error": str(e)}]
    
    async def _execute_postgresql(self, query: str, params: dict = None) -> list[dict]:
        # Convert params dict to positional args if needed
        if params:
            # Replace named params with positional
            args = []
            for i, (key, value) in enumerate(params.items(), 1):
                query = query.replace(f":{key}", f"${i}")
                args.append(value)
            rows = await self._connection.fetch(query, *args)
        else:
            rows = await self._connection.fetch(query)
        
        return [self._serialize_row(dict(row)) for row in rows]
    
    async def _execute_mysql(self, query: str, params: dict = None) -> list[dict]:
        async with self._connection.cursor() as cursor:
            if params:
                # MySQL uses %s for params
                args = []
                for key, value in params.items():
                    query = query.replace(f":{key}", "%s")
                    args.append(value)
                await cursor.execute(query, args)
            else:
                await cursor.execute(query)
            
            columns = [col[0] for col in cursor.description] if cursor.description else []
            rows = await cursor.fetchall()
            return [self._serialize_row(dict(zip(columns, row))) for row in rows]
    
    async def _execute_mongodb(self, query: str, params: dict = None) -> list[dict]:
        """
        MongoDB query format:
        {
            "collection": "users",
            "operation": "find",  # find, aggregate, count
            "filter": {"status": "active"},
            "projection": {"name": 1, "email": 1},
            "limit": 10
        }
        """
        try:
            spec = json.loads(query)
        except json.JSONDecodeError:
            return [{"error": "Invalid MongoDB query format. Expected JSON."}]
        
        collection_name = spec.get("collection")
        if not collection_name:
            return [{"error": "Missing 'collection' in query"}]
        
        collection = self._connection[collection_name]
        operation = spec.get("operation", "find")
        filter_query = spec.get("filter", {})
        projection = spec.get("projection")
        limit = spec.get("limit", 100)
        
        if operation == "find":
            cursor = collection.find(filter_query, projection).limit(limit)
            docs = await cursor.to_list(length=limit)
            return [self._serialize_row(doc) for doc in docs]
        
        elif operation == "aggregate":
            pipeline = spec.get("pipeline", [])
            cursor = collection.aggregate(pipeline)
            docs = await cursor.to_list(length=limit)
            return [self._serialize_row(doc) for doc in docs]
        
        elif operation == "count":
            count = await collection.count_documents(filter_query)
            return [{"count": count}]
        
        else:
            return [{"error": f"Unknown operation: {operation}"}]
    
    def _serialize_row(self, row: dict) -> dict:
        """Convert non-JSON-serializable types to strings."""
        result = {}
        for key, value in row.items():
            if isinstance(value, (datetime, date)):
                result[key] = value.isoformat()
            elif isinstance(value, Decimal):
                result[key] = float(value)
            elif isinstance(value, UUID):
                result[key] = str(value)
            elif isinstance(value, bytes):
                result[key] = value.decode("utf-8", errors="replace")
            elif hasattr(value, "__str__") and not isinstance(value, (str, int, float, bool, list, dict, type(None))):
                result[key] = str(value)
            else:
                result[key] = value
        return result
    
    async def get_schema(self) -> dict:
        """Get database schema as both structured data and text.

        Returns: {"text": str, "structured": [{"name": str, "fields": [{"name": str, "type": str, ...}]}]}
        """
        if self._connection is None:
            await self.connect()

        if self.db_type == "postgresql":
            return await self._get_postgresql_schema()
        elif self.db_type == "mysql":
            return await self._get_mysql_schema()
        elif self.db_type == "mongodb":
            return await self._get_mongodb_schema()
        return {"text": "", "structured": []}

    async def _get_postgresql_schema(self) -> dict:
        query = """
        SELECT
            table_name,
            column_name,
            data_type,
            is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position
        """
        rows = await self._connection.fetch(query)

        tables = {}
        for row in rows:
            table = row["table_name"]
            if table not in tables:
                tables[table] = []
            tables[table].append({
                "name": row["column_name"],
                "type": row["data_type"],
                "nullable": row["is_nullable"] == "YES"
            })

        structured = [{"name": t, "fields": cols} for t, cols in tables.items()]

        schema_text = "Database Schema:\n"
        for item in structured:
            schema_text += f"\nTable: {item['name']}\n"
            for col in item["fields"]:
                nullable = "NULL" if col["nullable"] else "NOT NULL"
                schema_text += f"  - {col['name']} ({col['type']}) {nullable}\n"

        return {"text": schema_text, "structured": structured}

    async def _get_mysql_schema(self) -> dict:
        query = f"""
        SELECT
            TABLE_NAME as table_name,
            COLUMN_NAME as column_name,
            DATA_TYPE as data_type,
            IS_NULLABLE as is_nullable
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = '{self.database}'
        ORDER BY TABLE_NAME, ORDINAL_POSITION
        """
        async with self._connection.cursor() as cursor:
            await cursor.execute(query)
            rows = await cursor.fetchall()

        tables = {}
        for row in rows:
            table = row[0]
            if table not in tables:
                tables[table] = []
            tables[table].append({
                "name": row[1],
                "type": row[2],
                "nullable": row[3] == "YES"
            })

        structured = [{"name": t, "fields": cols} for t, cols in tables.items()]

        schema_text = "Database Schema:\n"
        for item in structured:
            schema_text += f"\nTable: {item['name']}\n"
            for col in item["fields"]:
                nullable = "NULL" if col["nullable"] else "NOT NULL"
                schema_text += f"  - {col['name']} ({col['type']}) {nullable}\n"

        return {"text": schema_text, "structured": structured}

    async def _get_mongodb_schema(self) -> dict:
        # Use filter={} to include all collections (not just default-filtered ones)
        collections = await self._connection.list_collection_names(filter={})
        structured = []

        for coll_name in sorted(collections):
            collection = self._connection[coll_name]
            # Sample multiple documents to discover all fields
            field_types = {}
            try:
                cursor = collection.find().limit(20)
                docs = await cursor.to_list(length=20)
                for doc in docs:
                    for key, value in doc.items():
                        if key not in field_types:
                            field_types[key] = type(value).__name__
            except Exception:
                pass  # Skip collections we can't read (permissions)

            fields = [{"name": k, "type": v} for k, v in field_types.items()]
            structured.append({"name": coll_name, "fields": fields})

        schema_text = "MongoDB Collections:\n"
        for item in structured:
            schema_text += f"\nCollection: {item['name']}\n"
            for field in item["fields"]:
                schema_text += f"  - {field['name']} ({field['type']})\n"

        return {"text": schema_text, "structured": structured}
    
    async def test_connection(self) -> dict:
        """Test if the connection works."""
        try:
            await self.connect()
            if self.db_type == "mongodb":
                # Try to list collections
                await self._connection.list_collection_names()
            else:
                # Try a simple query
                if self.db_type == "postgresql":
                    await self._connection.fetch("SELECT 1")
                elif self.db_type == "mysql":
                    async with self._connection.cursor() as cursor:
                        await cursor.execute("SELECT 1")
            await self.close()
            return {"success": True, "message": "Connection successful"}
        except Exception as e:
            return {"success": False, "message": str(e)}
