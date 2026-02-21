import uuid

from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, func, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db, async_session
from app.models import Tenant, LLMConfig, KnowledgeSource, DocumentChunk, Conversation, Message, WidgetConfig, DBConnection, Tool
from app.services.db_connector import DBConnector
from app.services.document_service import DocumentService
from app.services.embedding_service import EmbeddingService
from app.config import settings

router = APIRouter()

# For MVP: use the first tenant
DEFAULT_TENANT_KEY = "test-key-123"


async def get_default_tenant(db: AsyncSession) -> Tenant:
    result = await db.execute(
        select(Tenant).where(Tenant.embed_api_key == DEFAULT_TENANT_KEY)
    )
    tenant = result.scalar_one_or_none()
    if not tenant:
        raise HTTPException(status_code=500, detail="Default tenant not found")
    return tenant


# --- LLM Config ---


class LLMConfigUpdate(BaseModel):
    api_key: str | None = None
    model: str | None = None
    temperature: float | None = None
    max_tokens: int | None = None
    system_prompt: str | None = None


@router.get("/llm/config")
async def get_llm_config(db: AsyncSession = Depends(get_db)):
    tenant = await get_default_tenant(db)
    result = await db.execute(
        select(LLMConfig).where(LLMConfig.tenant_id == tenant.id)
    )
    config = result.scalar_one_or_none()
    if not config:
        return {"configured": False}
    return {
        "configured": True,
        "provider": config.provider,
        "api_key_set": bool(config.api_key),
        "api_key_preview": f"...{config.api_key[-4:]}" if config.api_key else None,
        "model": config.model,
        "temperature": config.temperature,
        "max_tokens": config.max_tokens,
        "system_prompt": config.system_prompt,
    }


@router.put("/llm/config")
async def update_llm_config(
    body: LLMConfigUpdate, db: AsyncSession = Depends(get_db)
):
    tenant = await get_default_tenant(db)
    result = await db.execute(
        select(LLMConfig).where(LLMConfig.tenant_id == tenant.id)
    )
    config = result.scalar_one_or_none()

    if not config:
        config = LLMConfig(tenant_id=tenant.id, api_key="")
        db.add(config)

    if body.api_key is not None:
        config.api_key = body.api_key
    if body.model is not None:
        config.model = body.model
    if body.temperature is not None:
        config.temperature = body.temperature
    if body.max_tokens is not None:
        config.max_tokens = body.max_tokens
    if body.system_prompt is not None:
        config.system_prompt = body.system_prompt

    await db.commit()
    return {"status": "ok"}


# --- Knowledge Base ---


async def process_document(source_id: uuid.UUID, file_bytes: bytes, filename: str):
    """Background task to chunk, embed, and store document."""
    async with async_session() as db:
        try:
            # Get the source and its tenant's LLM config for the API key
            result = await db.execute(
                select(KnowledgeSource).where(KnowledgeSource.id == source_id)
            )
            source = result.scalar_one()

            result = await db.execute(
                select(LLMConfig).where(LLMConfig.tenant_id == source.tenant_id)
            )
            llm_config = result.scalar_one_or_none()
            if not llm_config or not llm_config.api_key:
                source.status = "failed"
                await db.commit()
                return

            # Read and chunk the document
            doc_service = DocumentService(
                chunk_size=settings.chunk_size,
                chunk_overlap=settings.chunk_overlap,
            )
            text = doc_service.read_file(file_bytes, filename)
            chunks = doc_service.chunk_text(text)

            if not chunks:
                source.status = "failed"
                await db.commit()
                return

            # Embed all chunks
            embedding_service = EmbeddingService(
                api_key=llm_config.api_key,
                model=settings.embedding_model,
            )
            embeddings = await embedding_service.embed_texts(chunks)

            # Store chunks
            for content, embedding in zip(chunks, embeddings):
                chunk = DocumentChunk(
                    source_id=source_id,
                    content=content,
                    metadata_json={"filename": filename},
                    embedding=embedding,
                )
                db.add(chunk)

            source.status = "ready"
            source.chunk_count = len(chunks)
            await db.commit()

        except Exception as e:
            async with async_session() as db2:
                result = await db2.execute(
                    select(KnowledgeSource).where(KnowledgeSource.id == source_id)
                )
                source = result.scalar_one_or_none()
                if source:
                    source.status = "failed"
                    await db2.commit()


@router.post("/knowledge/upload")
async def upload_knowledge(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    tenant = await get_default_tenant(db)
    file_bytes = await file.read()
    filename = file.filename or "unknown"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if ext not in ("txt", "pdf", "csv"):
        raise HTTPException(status_code=400, detail=f"Unsupported file type: .{ext}")

    source = KnowledgeSource(
        tenant_id=tenant.id,
        filename=filename,
        source_type=ext,
        status="processing",
    )
    db.add(source)
    await db.commit()
    await db.refresh(source)

    background_tasks.add_task(process_document, source.id, file_bytes, filename)

    return {
        "id": str(source.id),
        "filename": filename,
        "status": "processing",
    }


@router.get("/knowledge")
async def list_knowledge(db: AsyncSession = Depends(get_db)):
    tenant = await get_default_tenant(db)
    result = await db.execute(
        select(KnowledgeSource)
        .where(KnowledgeSource.tenant_id == tenant.id)
        .order_by(KnowledgeSource.created_at.desc())
    )
    sources = result.scalars().all()
    return {
        "sources": [
            {
                "id": str(s.id),
                "filename": s.filename,
                "source_type": s.source_type,
                "status": s.status,
                "chunk_count": s.chunk_count,
                "created_at": s.created_at.isoformat() if s.created_at else None,
            }
            for s in sources
        ]
    }


@router.delete("/knowledge/{source_id}")
async def delete_knowledge(source_id: str, db: AsyncSession = Depends(get_db)):
    sid = uuid.UUID(source_id)

    # Delete chunks first (cascade should handle this, but be explicit)
    await db.execute(
        delete(DocumentChunk).where(DocumentChunk.source_id == sid)
    )
    await db.execute(
        delete(KnowledgeSource).where(KnowledgeSource.id == sid)
    )
    await db.commit()
    return {"status": "deleted"}


# --- Conversations ---


@router.get("/conversations")
async def list_conversations(db: AsyncSession = Depends(get_db)):
    tenant = await get_default_tenant(db)

    # Get conversations with message count
    stmt = (
        select(
            Conversation.id,
            Conversation.session_id,
            Conversation.started_at,
            func.count(Message.id).label("message_count"),
        )
        .outerjoin(Message, Message.conversation_id == Conversation.id)
        .where(Conversation.tenant_id == tenant.id)
        .group_by(Conversation.id)
        .order_by(Conversation.started_at.desc())
    )
    result = await db.execute(stmt)
    rows = result.all()

    return {
        "conversations": [
            {
                "id": str(r.id),
                "session_id": r.session_id,
                "started_at": r.started_at.isoformat() if r.started_at else None,
                "message_count": r.message_count,
            }
            for r in rows
        ]
    }


@router.get("/conversations/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: str, db: AsyncSession = Depends(get_db)
):
    cid = uuid.UUID(conversation_id)
    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == cid)
        .order_by(Message.created_at.asc())
    )
    messages = result.scalars().all()
    return {
        "messages": [
            {
                "id": str(m.id),
                "role": m.role,
                "content": m.content,
                "created_at": m.created_at.isoformat() if m.created_at else None,
            }
            for m in messages
        ]
    }


# --- Widget Settings ---


class WidgetConfigUpdate(BaseModel):
    primary_color: str | None = None
    greeting: str | None = None
    position: str | None = None
    logo_url: str | None = None


@router.get("/widget/config")
async def get_widget_settings(db: AsyncSession = Depends(get_db)):
    tenant = await get_default_tenant(db)
    result = await db.execute(
        select(WidgetConfig).where(WidgetConfig.tenant_id == tenant.id)
    )
    config = result.scalar_one_or_none()
    if not config:
        return {
            "primary_color": "#4F46E5",
            "greeting": "Hi! How can I help you?",
            "position": "bottom-right",
            "logo_url": None,
            "embed_code": f'<script src="http://localhost:8000/widget.js" data-api-key="{tenant.embed_api_key}"></script>',
        }
    return {
        "primary_color": config.primary_color,
        "greeting": config.greeting,
        "position": config.position,
        "logo_url": config.logo_url,
        "embed_code": f'<script src="http://localhost:8000/widget.js" data-api-key="{tenant.embed_api_key}"></script>',
    }


@router.put("/widget/config")
async def update_widget_settings(
    body: WidgetConfigUpdate, db: AsyncSession = Depends(get_db)
):
    tenant = await get_default_tenant(db)
    result = await db.execute(
        select(WidgetConfig).where(WidgetConfig.tenant_id == tenant.id)
    )
    config = result.scalar_one_or_none()

    if not config:
        config = WidgetConfig(tenant_id=tenant.id)
        db.add(config)

    if body.primary_color is not None:
        config.primary_color = body.primary_color
    if body.greeting is not None:
        config.greeting = body.greeting
    if body.position is not None:
        config.position = body.position
    if body.logo_url is not None:
        config.logo_url = body.logo_url

    await db.commit()
    return {"status": "ok"}


# --- Database Connections ---


class DBConnectionCreate(BaseModel):
    name: str
    description: str | None = None
    db_type: str  # postgresql, mysql, mongodb
    # Option 1: Individual connection params
    host: str | None = None
    port: int | None = None
    database: str | None = None
    username: str | None = None
    password: str | None = None
    # Option 2: Full connection string (for replica sets, special auth, etc.)
    connection_string: str | None = None
    schema_info: str | None = None


class DBConnectionUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    db_type: str | None = None
    host: str | None = None
    port: int | None = None
    database: str | None = None
    username: str | None = None
    password: str | None = None
    connection_string: str | None = None
    schema_info: str | None = None
    enabled: bool | None = None


@router.get("/db-connections")
async def list_db_connections(db: AsyncSession = Depends(get_db)):
    """List all database connections."""
    tenant = await get_default_tenant(db)
    result = await db.execute(
        select(DBConnection)
        .where(DBConnection.tenant_id == tenant.id)
        .order_by(DBConnection.created_at.desc())
    )
    connections = result.scalars().all()
    return {
        "connections": [
            {
                "id": str(c.id),
                "name": c.name,
                "description": c.description,
                "db_type": c.db_type,
                "host": c.host,
                "port": c.port,
                "database": c.database,
                "username": c.username,
                "connection_string_set": bool(c.connection_string),
                "schema_info": c.schema_info,
                "enabled": c.enabled,
                "created_at": c.created_at.isoformat() if c.created_at else None,
            }
            for c in connections
        ]
    }


@router.post("/db-connections")
async def create_db_connection(
    body: DBConnectionCreate, db: AsyncSession = Depends(get_db)
):
    """Create a new database connection."""
    tenant = await get_default_tenant(db)
    
    # Validate: need either connection_string OR individual params
    if not body.connection_string and not (body.host and body.port and body.database):
        raise HTTPException(
            status_code=400, 
            detail="Provide either connection_string or host/port/database"
        )
    
    conn = DBConnection(
        tenant_id=tenant.id,
        name=body.name,
        description=body.description,
        db_type=body.db_type,
        host=body.host,
        port=body.port,
        database=body.database,
        username=body.username,
        password=body.password,
        connection_string=body.connection_string,
        schema_info=body.schema_info,
    )
    db.add(conn)
    await db.commit()
    await db.refresh(conn)
    
    return {"id": str(conn.id), "status": "created"}


@router.put("/db-connections/{connection_id}")
async def update_db_connection(
    connection_id: str, body: DBConnectionUpdate, db: AsyncSession = Depends(get_db)
):
    """Update a database connection."""
    cid = uuid.UUID(connection_id)
    result = await db.execute(
        select(DBConnection).where(DBConnection.id == cid)
    )
    conn = result.scalar_one_or_none()
    
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    if body.name is not None:
        conn.name = body.name
    if body.description is not None:
        conn.description = body.description
    if body.db_type is not None:
        conn.db_type = body.db_type
    if body.host is not None:
        conn.host = body.host
    if body.port is not None:
        conn.port = body.port
    if body.database is not None:
        conn.database = body.database
    if body.username is not None:
        conn.username = body.username
    if body.password is not None:
        conn.password = body.password
    if body.connection_string is not None:
        conn.connection_string = body.connection_string
    if body.schema_info is not None:
        conn.schema_info = body.schema_info
    if body.enabled is not None:
        conn.enabled = body.enabled
    
    await db.commit()
    return {"status": "updated"}


@router.delete("/db-connections/{connection_id}")
async def delete_db_connection(connection_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a database connection."""
    cid = uuid.UUID(connection_id)
    await db.execute(delete(DBConnection).where(DBConnection.id == cid))
    await db.commit()
    return {"status": "deleted"}


@router.post("/db-connections/{connection_id}/test")
async def test_db_connection(connection_id: str, db: AsyncSession = Depends(get_db)):
    """Test a database connection."""
    cid = uuid.UUID(connection_id)
    result = await db.execute(
        select(DBConnection).where(DBConnection.id == cid)
    )
    conn = result.scalar_one_or_none()
    
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    connector = DBConnector(
        db_type=conn.db_type,
        host=conn.host,
        port=conn.port,
        database=conn.database,
        username=conn.username,
        password=conn.password,
        connection_string=conn.connection_string,
    )
    
    test_result = await connector.test_connection()
    return test_result


@router.post("/db-connections/{connection_id}/fetch-schema")
async def fetch_db_schema(connection_id: str, db: AsyncSession = Depends(get_db)):
    """Fetch and store the schema for a database connection."""
    cid = uuid.UUID(connection_id)
    result = await db.execute(
        select(DBConnection).where(DBConnection.id == cid)
    )
    conn = result.scalar_one_or_none()
    
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    
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
        result = await connector.get_schema()
        conn.schema_info = result["text"]
        await db.commit()
        return {"status": "ok", "schema": result["text"], "structured": result["structured"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        await connector.close()


# --- Tools ---


class ToolCreate(BaseModel):
    name: str
    description: str
    tool_type: str  # db_query, rest_api
    db_connection_id: str | None = None
    config_json: dict | None = None


class ToolUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    tool_type: str | None = None
    db_connection_id: str | None = None
    config_json: dict | None = None
    enabled: bool | None = None


@router.get("/tools")
async def list_tools(db: AsyncSession = Depends(get_db)):
    """List all custom tools."""
    tenant = await get_default_tenant(db)
    result = await db.execute(
        select(Tool)
        .where(Tool.tenant_id == tenant.id)
        .order_by(Tool.created_at.desc())
    )
    tools = result.scalars().all()
    return {
        "tools": [
            {
                "id": str(t.id),
                "name": t.name,
                "description": t.description,
                "tool_type": t.tool_type,
                "db_connection_id": str(t.db_connection_id) if t.db_connection_id else None,
                "config_json": t.config_json,
                "enabled": t.enabled,
                "created_at": t.created_at.isoformat() if t.created_at else None,
            }
            for t in tools
        ]
    }


@router.post("/tools")
async def create_tool(body: ToolCreate, db: AsyncSession = Depends(get_db)):
    """Create a new tool."""
    tenant = await get_default_tenant(db)
    
    tool = Tool(
        tenant_id=tenant.id,
        name=body.name,
        description=body.description,
        tool_type=body.tool_type,
        db_connection_id=uuid.UUID(body.db_connection_id) if body.db_connection_id else None,
        config_json=body.config_json or {},
    )
    db.add(tool)
    await db.commit()
    await db.refresh(tool)
    
    return {"id": str(tool.id), "status": "created"}


@router.put("/tools/{tool_id}")
async def update_tool(
    tool_id: str, body: ToolUpdate, db: AsyncSession = Depends(get_db)
):
    """Update a tool."""
    tid = uuid.UUID(tool_id)
    result = await db.execute(select(Tool).where(Tool.id == tid))
    tool = result.scalar_one_or_none()
    
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    if body.name is not None:
        tool.name = body.name
    if body.description is not None:
        tool.description = body.description
    if body.tool_type is not None:
        tool.tool_type = body.tool_type
    if body.db_connection_id is not None:
        tool.db_connection_id = uuid.UUID(body.db_connection_id) if body.db_connection_id else None
    if body.config_json is not None:
        tool.config_json = body.config_json
    if body.enabled is not None:
        tool.enabled = body.enabled
    
    await db.commit()
    return {"status": "updated"}


@router.delete("/tools/{tool_id}")
async def delete_tool(tool_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a tool."""
    tid = uuid.UUID(tool_id)
    await db.execute(delete(Tool).where(Tool.id == tid))
    await db.commit()
    return {"status": "deleted"}
