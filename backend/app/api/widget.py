import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

from app.database import get_db
from app.models import Tenant, WidgetConfig

router = APIRouter()


@router.get("/api/widget/config/{api_key}")
async def get_widget_config(api_key: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Tenant).where(Tenant.embed_api_key == api_key)
    )
    tenant = result.scalar_one_or_none()
    if not tenant:
        raise HTTPException(status_code=404, detail="Invalid API key")

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
        }

    return {
        "primary_color": config.primary_color,
        "greeting": config.greeting,
        "position": config.position,
        "logo_url": config.logo_url,
    }


@router.get("/widget.js")
async def serve_widget():
    widget_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "static",
        "widget",
        "widget.js",
    )
    if not os.path.exists(widget_path):
        raise HTTPException(status_code=404, detail="Widget not built yet")
    return FileResponse(widget_path, media_type="application/javascript")


@router.get("/test.html")
async def serve_test_page():
    """Serve the widget test page."""
    test_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "static",
        "test.html",
    )
    if not os.path.exists(test_path):
        raise HTTPException(status_code=404, detail="Test page not found")
    return FileResponse(test_path, media_type="text/html")
