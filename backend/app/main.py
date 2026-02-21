from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, select

from app.database import engine, async_session, Base
from app.models import Tenant, LLMConfig, WidgetConfig
from app.config import settings
from app.api import chat, admin, widget


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed data
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(Base.metadata.create_all)

    # Seed default tenant if not exists
    async with async_session() as db:
        result = await db.execute(
            select(Tenant).where(Tenant.embed_api_key == "test-key-123")
        )
        tenant = result.scalar_one_or_none()

        if not tenant:
            tenant = Tenant(name="Default", embed_api_key="test-key-123")
            db.add(tenant)
            await db.commit()
            await db.refresh(tenant)

            # Seed LLM config
            llm_config = LLMConfig(
                tenant_id=tenant.id,
                provider="openai",
                api_key=settings.openai_api_key,
                model=settings.default_model,
                temperature=settings.default_temperature,
                max_tokens=settings.default_max_tokens,
                system_prompt=settings.default_system_prompt,
            )
            db.add(llm_config)

            # Seed widget config
            widget_config = WidgetConfig(
                tenant_id=tenant.id,
                primary_color="#4F46E5",
                greeting="Hi! How can I help you?",
                position="bottom-right",
            )
            db.add(widget_config)
            await db.commit()

    yield

    # Shutdown
    await engine.dispose()


app = FastAPI(title="SmartChat API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(widget.router, tags=["widget"])


@app.get("/health")
async def health():
    return {"status": "ok"}
