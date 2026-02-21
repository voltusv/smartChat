"""
Chat API

WebSocket endpoint for real-time chat with streaming and tool support.
"""

import json
import uuid

import jwt
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db, async_session
from app.models import Tenant, LLMConfig, Conversation, Message, AuthConfig
from app.services.embedding_service import EmbeddingService
from app.services.rag_service import RAGService
from app.services.llm_service import LLMService
from app.services.tool_executor import ToolExecutor
from app.utils.prompts import build_rag_messages
from app.config import settings

DEFAULT_JWT_SECRET = "smartchat-default-secret-change-me"

router = APIRouter()


async def get_tenant_by_key(db: AsyncSession, api_key: str) -> Tenant | None:
    result = await db.execute(
        select(Tenant).where(Tenant.embed_api_key == api_key)
    )
    return result.scalar_one_or_none()


async def get_llm_config(db: AsyncSession, tenant_id) -> LLMConfig | None:
    result = await db.execute(
        select(LLMConfig).where(LLMConfig.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()


async def get_or_create_conversation(
    db: AsyncSession, session_id: str, tenant_id,
    user_id: str = None, user_email: str = None, user_name: str = None, user_context: dict = None
) -> Conversation:
    result = await db.execute(
        select(Conversation).where(Conversation.session_id == session_id)
    )
    conv = result.scalar_one_or_none()
    if not conv:
        conv = Conversation(
            tenant_id=tenant_id,
            session_id=session_id,
            user_id=user_id,
            user_email=user_email,
            user_name=user_name,
            user_context=user_context or {},
        )
        db.add(conv)
        await db.commit()
        await db.refresh(conv)
    elif user_id and not conv.user_id:
        # Update existing conversation with user info if not set
        conv.user_id = user_id
        conv.user_email = user_email
        conv.user_name = user_name
        conv.user_context = user_context or {}
        await db.commit()
    return conv


async def get_auth_config(db: AsyncSession, tenant_id) -> AuthConfig | None:
    result = await db.execute(
        select(AuthConfig).where(AuthConfig.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()


def verify_user_token(token: str, jwt_secret: str, tenant_id: str) -> dict | None:
    """Verify user token and return user info or None."""
    if not token:
        return None
    try:
        payload = jwt.decode(token, jwt_secret, algorithms=["HS256"])
        if payload.get("tenant_id") != tenant_id:
            return None
        return {
            "user_id": payload.get("user_id"),
            "user_email": payload.get("user_email"),
            "user_name": payload.get("user_name"),
        }
    except jwt.InvalidTokenError:
        return None


async def get_conversation_history(
    db: AsyncSession, conversation_id, limit: int = 10
) -> list[dict]:
    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc())
        .limit(limit)
    )
    messages = list(reversed(result.scalars().all()))
    return [{"role": m.role, "content": m.content} for m in messages]


@router.websocket("/ws/chat/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    await websocket.accept()

    # Track user info across messages in this session
    session_user_info = None

    async with async_session() as db:
        try:
            while True:
                raw = await websocket.receive_text()
                data = json.loads(raw)
                user_message = data.get("message", "")
                api_key = data.get("api_key", "")
                user_token = data.get("user_token", "")  # JWT from login or embedded context

                if not user_message:
                    await websocket.send_json({"type": "error", "message": "Empty message"})
                    continue

                # Validate tenant
                tenant = await get_tenant_by_key(db, api_key)
                if not tenant:
                    await websocket.send_json({"type": "error", "message": "Invalid API key"})
                    continue

                # Verify user token if provided
                if user_token and not session_user_info:
                    auth_config = await get_auth_config(db, tenant.id)
                    jwt_secret = (auth_config.jwt_secret if auth_config else None) or DEFAULT_JWT_SECRET
                    session_user_info = verify_user_token(user_token, jwt_secret, str(tenant.id))

                # Get LLM config
                llm_config = await get_llm_config(db, tenant.id)
                if not llm_config:
                    await websocket.send_json(
                        {"type": "error", "message": "LLM not configured. Please configure it in the admin panel."}
                    )
                    continue

                # OpenAI requires an API key; Ollama does not
                if (llm_config.provider or "openai") == "openai" and not llm_config.api_key:
                    await websocket.send_json(
                        {"type": "error", "message": "LLM not configured. Please set an API key in the admin panel."}
                    )
                    continue

                # Get or create conversation with user info
                conv = await get_or_create_conversation(
                    db, session_id, tenant.id,
                    user_id=session_user_info.get("user_id") if session_user_info else None,
                    user_email=session_user_info.get("user_email") if session_user_info else None,
                    user_name=session_user_info.get("user_name") if session_user_info else None,
                )

                # Save user message
                user_msg = Message(
                    conversation_id=conv.id,
                    role="user",
                    content=user_message,
                )
                db.add(user_msg)
                await db.commit()

                # Load conversation history
                history = await get_conversation_history(db, conv.id)
                history = history[:-1]  # Remove current message

                # RAG retrieval (requires OpenAI API key for embeddings)
                chunks = []
                if llm_config.api_key:
                    try:
                        embedding_service = EmbeddingService(
                            api_key=llm_config.api_key,
                            model=settings.embedding_model,
                        )
                        rag_service = RAGService(
                            db=db,
                            embedding_service=embedding_service,
                            top_k=settings.top_k_results,
                        )
                        chunks = await rag_service.retrieve(user_message, tenant.id)
                    except Exception:
                        chunks = []

                # Get available tools (pass user context for query scoping)
                tool_executor = ToolExecutor(
                    db=db, 
                    tenant_id=tenant.id,
                    user_id=conv.user_id,
                    user_context=conv.user_context,
                )
                tools = await tool_executor.get_available_tools()

                # Build prompt with tool info and user context
                base_system_prompt = llm_config.system_prompt or settings.default_system_prompt
                tools_prompt = tool_executor.get_tools_system_prompt(tools) if tools else ""
                
                # Add user context to system prompt if user is identified
                user_context_prompt = ""
                if conv.user_id:
                    user_context_prompt = f"\n\nCurrent user: {conv.user_name or 'User'} (ID: {conv.user_id})"
                    if conv.user_email:
                        user_context_prompt += f", Email: {conv.user_email}"
                    user_context_prompt += "\nOnly show data that belongs to this user. Filter all database queries by the user's ID."
                
                messages = build_rag_messages(
                    system_prompt=base_system_prompt + user_context_prompt + tools_prompt,
                    retrieved_chunks=chunks,
                    conversation_history=history,
                    user_message=user_message,
                )

                # Create LLM service
                llm_service = LLMService(
                    api_key=llm_config.api_key or "",
                    model=llm_config.model or settings.default_model,
                    temperature=llm_config.temperature or settings.default_temperature,
                    max_tokens=llm_config.max_tokens or settings.default_max_tokens,
                    provider=llm_config.provider or "openai",
                    base_url=llm_config.base_url,
                )

                # Stream response with tool support
                full_response = ""
                try:
                    if tools:
                        # Use tool-aware streaming
                        async for chunk_text in llm_service.chat_with_tools(
                            messages=messages,
                            tools=tools,
                            execute_tool_fn=tool_executor.execute_tool,
                        ):
                            full_response += chunk_text
                            await websocket.send_json({"type": "chunk", "content": chunk_text})
                    else:
                        # Simple streaming without tools
                        async for chunk in llm_service.chat_stream(messages):
                            if chunk["type"] == "content":
                                full_response += chunk["content"]
                                await websocket.send_json({"type": "chunk", "content": chunk["content"]})
                    
                    await websocket.send_json({"type": "done"})
                except Exception as e:
                    await websocket.send_json({"type": "error", "message": str(e)})
                    continue

                # Save assistant message
                assistant_msg = Message(
                    conversation_id=conv.id,
                    role="assistant",
                    content=full_response,
                )
                db.add(assistant_msg)
                await db.commit()

        except WebSocketDisconnect:
            pass
        except Exception as e:
            try:
                await websocket.send_json({"type": "error", "message": str(e)})
            except Exception:
                pass


@router.get("/history/{session_id}")
async def get_chat_history(session_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Conversation).where(Conversation.session_id == session_id)
    )
    conv = result.scalar_one_or_none()
    if not conv:
        return {"messages": []}

    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conv.id)
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
