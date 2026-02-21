import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Text, Float, Integer, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector

from app.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    embed_api_key = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class LLMConfig(Base):
    __tablename__ = "llm_configs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    provider = Column(String(50), default="openai")
    api_key = Column(Text, nullable=False)
    model = Column(String(100), default="gpt-4o-mini")
    temperature = Column(Float, default=0.7)
    max_tokens = Column(Integer, default=1024)
    system_prompt = Column(Text, default="You are a helpful assistant.")


class KnowledgeSource(Base):
    __tablename__ = "knowledge_sources"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    filename = Column(String(500), nullable=False)
    source_type = Column(String(50))
    status = Column(String(50), default="processing")
    chunk_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_id = Column(
        UUID(as_uuid=True),
        ForeignKey("knowledge_sources.id", ondelete="CASCADE"),
        nullable=False,
    )
    content = Column(Text, nullable=False)
    metadata_json = Column(JSON, default=dict)
    embedding = Column(Vector(1536))


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    session_id = Column(String(255), unique=True, nullable=False)
    started_at = Column(DateTime(timezone=True), default=utcnow)
    metadata_json = Column(JSON, default=dict)


class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(
        UUID(as_uuid=True),
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
    )
    role = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    tool_calls_json = Column(JSON, nullable=True)
    tokens_used = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class WidgetConfig(Base):
    __tablename__ = "widget_configs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    primary_color = Column(String(7), default="#4F46E5")
    greeting = Column(Text, default="Hi! How can I help you?")
    position = Column(String(20), default="bottom-right")
    logo_url = Column(String(500), nullable=True)
    allowed_domains = Column(JSON, default=list)


# --- Database Connections ---

class DBConnection(Base):
    """External database connections that the AI can query."""
    __tablename__ = "db_connections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    name = Column(String(255), nullable=False)  # Human-readable name
    description = Column(Text, nullable=True)   # What data is in this DB
    db_type = Column(String(50), nullable=False)  # postgresql, mysql, mongodb
    # Option 1: Individual connection params
    host = Column(String(255), nullable=True)
    port = Column(Integer, nullable=True)
    database = Column(String(255), nullable=True)
    username = Column(String(255), nullable=True)
    password = Column(Text, nullable=True)  # Should be encrypted in production
    # Option 2: Full connection string (for replica sets, special auth, etc.)
    connection_string = Column(Text, nullable=True)
    schema_info = Column(Text, nullable=True)  # Description of tables/collections
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class Tool(Base):
    """Custom tools/functions the AI can call."""
    __tablename__ = "tools"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    name = Column(String(255), nullable=False)  # Function name
    description = Column(Text, nullable=False)  # What this tool does
    tool_type = Column(String(50), nullable=False)  # db_query, rest_api, custom
    db_connection_id = Column(UUID(as_uuid=True), ForeignKey("db_connections.id"), nullable=True)
    config_json = Column(JSON, default=dict)  # Query template, parameters, etc.
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
