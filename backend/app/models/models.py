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
    api_key = Column(Text, nullable=True)
    model = Column(String(100), default="gpt-4o-mini")
    temperature = Column(Float, default=0.7)
    max_tokens = Column(Integer, default=1024)
    system_prompt = Column(Text, default="You are a helpful assistant.")
    base_url = Column(String(500), nullable=True)


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
    # User identification (from embedded context or widget login)
    user_id = Column(String(255), nullable=True)  # External user ID
    user_email = Column(String(255), nullable=True)
    user_name = Column(String(255), nullable=True)
    user_context = Column(JSON, default=dict)  # Any extra user data
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


class AuthConfig(Base):
    """Authentication configuration for widget users."""
    __tablename__ = "auth_configs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, unique=True)
    
    # Auth mode: "none", "embedded_only", "external_api"
    auth_mode = Column(String(50), default="none")
    
    # External API configuration
    login_url = Column(String(500), nullable=True)  # e.g., https://ducapp.com/api/login
    login_method = Column(String(10), default="POST")  # POST, GET
    
    # Request field mapping (what to send)
    email_field = Column(String(100), default="email")  # Field name for email in request
    password_field = Column(String(100), default="password")  # Field name for password
    
    # Response field mapping (what to extract from response)
    response_user_id_path = Column(String(255), default="user._id")  # JSON path to user ID
    response_token_path = Column(String(255), default="token")  # JSON path to token
    response_name_path = Column(String(255), nullable=True)  # JSON path to user name (optional)
    response_email_path = Column(String(255), nullable=True)  # JSON path to email (optional)
    
    # Extra headers for the API call (e.g., API keys)
    extra_headers = Column(JSON, default=dict)
    
    # JWT secret for signing widget tokens (if needed)
    jwt_secret = Column(String(255), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=utcnow)
