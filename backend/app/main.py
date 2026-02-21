import secrets
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, select, func

from app.database import engine, async_session, Base
from app.models import Tenant, LLMConfig, WidgetConfig, AuthConfig
from app.config import settings
from app.api import chat, admin, widget, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed data
    async with engine.begin() as conn:
        # Extensions
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS pgcrypto"))

        # Create tables (does not alter existing ones)
        await conn.run_sync(Base.metadata.create_all)

        # --- Lightweight migrations (safe/idempotent) ---

        # LLM config additions
        await conn.execute(text(
            "ALTER TABLE llm_configs ADD COLUMN IF NOT EXISTS base_url VARCHAR(500)"
        ))
        await conn.execute(text(
            "ALTER TABLE llm_configs ALTER COLUMN api_key DROP NOT NULL"
        ))

        # Conversation user-scoping columns
        await conn.execute(text(
            "ALTER TABLE conversations ADD COLUMN IF NOT EXISTS user_id VARCHAR(255)"
        ))
        await conn.execute(text(
            "ALTER TABLE conversations ADD COLUMN IF NOT EXISTS user_email VARCHAR(255)"
        ))
        await conn.execute(text(
            "ALTER TABLE conversations ADD COLUMN IF NOT EXISTS user_name VARCHAR(255)"
        ))
        await conn.execute(text(
            "ALTER TABLE conversations ADD COLUMN IF NOT EXISTS user_context JSONB DEFAULT '{}'::jsonb"
        ))

        # Auth config table (for widget login)
        await conn.execute(text(
            """
            CREATE TABLE IF NOT EXISTS auth_configs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id),
                auth_mode VARCHAR(50) DEFAULT 'none',
                login_url VARCHAR(500),
                login_method VARCHAR(10) DEFAULT 'POST',
                email_field VARCHAR(100) DEFAULT 'email',
                password_field VARCHAR(100) DEFAULT 'password',
                response_user_id_path VARCHAR(255) DEFAULT 'user._id',
                response_token_path VARCHAR(255) DEFAULT 'token',
                response_name_path VARCHAR(255),
                response_email_path VARCHAR(255),
                extra_headers JSONB DEFAULT '{}'::jsonb,
                jwt_secret VARCHAR(255),
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
            """
        ))

    # Seed default tenant if no tenants exist
    async with async_session() as db:
        count_result = await db.execute(select(func.count(Tenant.id)))
        tenant_count = count_result.scalar()

        if tenant_count == 0:
            # Use DEFAULT_API_KEY from env if set (dev), otherwise generate secure key (prod)
            api_key = settings.default_api_key or ("sc_live_" + secrets.token_urlsafe(32))
            tenant = Tenant(name="Default", embed_api_key=api_key)
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

            print(f"\n{'='*60}")
            print(f"  SmartChat - Default tenant created")
            print(f"  API Key: {api_key}")
            print(f"  Save this key! It will not be shown again.")
            print(f"{'='*60}\n")

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
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(widget.router, tags=["widget"])


@app.get("/health")
async def health():
    return {"status": "ok"}
