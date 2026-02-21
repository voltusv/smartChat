"""
Widget Authentication API

Handles user authentication for the chat widget:
- Embedded mode: validates tokens passed from host website
- External API mode: proxies login to customer's auth API
"""

import secrets
import httpx
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Tenant, AuthConfig

router = APIRouter()

# Default JWT secret (should be overridden per-tenant)
DEFAULT_JWT_SECRET = "smartchat-default-secret-change-me"


def get_nested_value(obj: dict, path: str) -> Any:
    """
    Extract a value from a nested dict using dot notation.
    e.g., get_nested_value({"user": {"_id": "123"}}, "user._id") -> "123"
    """
    keys = path.split(".")
    value = obj
    for key in keys:
        if isinstance(value, dict):
            value = value.get(key)
        else:
            return None
    return value


class WidgetLoginRequest(BaseModel):
    email: str
    password: str


class WidgetLoginResponse(BaseModel):
    success: bool
    token: str | None = None
    user_id: str | None = None
    user_name: str | None = None
    user_email: str | None = None
    error: str | None = None


class TokenVerifyRequest(BaseModel):
    token: str


class AuthConfigResponse(BaseModel):
    auth_mode: str
    requires_login: bool


async def get_tenant_by_api_key(api_key: str, db: AsyncSession) -> Tenant:
    """Get tenant by embed API key."""
    result = await db.execute(
        select(Tenant).where(Tenant.embed_api_key == api_key)
    )
    tenant = result.scalar_one_or_none()
    if not tenant:
        raise HTTPException(status_code=404, detail="Invalid API key")
    return tenant


async def get_auth_config(tenant_id, db: AsyncSession) -> AuthConfig | None:
    """Get auth config for a tenant."""
    result = await db.execute(
        select(AuthConfig).where(AuthConfig.tenant_id == tenant_id)
    )
    return result.scalar_one_or_none()


@router.get("/auth/config/{api_key}")
async def get_widget_auth_config(
    api_key: str, 
    db: AsyncSession = Depends(get_db)
) -> AuthConfigResponse:
    """
    Get auth configuration for a widget.
    Widget uses this to know if it should show login form.
    """
    tenant = await get_tenant_by_api_key(api_key, db)
    auth_config = await get_auth_config(tenant.id, db)
    
    if not auth_config or auth_config.auth_mode == "none":
        return AuthConfigResponse(auth_mode="none", requires_login=False)
    
    if auth_config.auth_mode == "embedded_only":
        # Only works when embedded with user context
        return AuthConfigResponse(auth_mode="embedded_only", requires_login=False)
    
    if auth_config.auth_mode == "external_api":
        return AuthConfigResponse(auth_mode="external_api", requires_login=True)
    
    return AuthConfigResponse(auth_mode="none", requires_login=False)


@router.post("/auth/login/{api_key}")
async def widget_login(
    api_key: str,
    body: WidgetLoginRequest,
    db: AsyncSession = Depends(get_db)
) -> WidgetLoginResponse:
    """
    Handle widget login by proxying to customer's auth API.
    """
    tenant = await get_tenant_by_api_key(api_key, db)
    auth_config = await get_auth_config(tenant.id, db)
    
    if not auth_config or auth_config.auth_mode != "external_api":
        raise HTTPException(
            status_code=400, 
            detail="Login not configured for this widget"
        )
    
    if not auth_config.login_url:
        raise HTTPException(
            status_code=500, 
            detail="Login URL not configured"
        )
    
    # Build request to external API
    login_data = {
        auth_config.email_field: body.email,
        auth_config.password_field: body.password,
    }
    
    headers = {"Content-Type": "application/json"}
    if auth_config.extra_headers:
        headers.update(auth_config.extra_headers)
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            if auth_config.login_method.upper() == "POST":
                response = await client.post(
                    auth_config.login_url,
                    json=login_data,
                    headers=headers
                )
            else:
                response = await client.get(
                    auth_config.login_url,
                    params=login_data,
                    headers=headers
                )
            
            if response.status_code >= 400:
                # Try to extract error message
                try:
                    error_data = response.json()
                    error_msg = error_data.get("message") or error_data.get("error") or "Login failed"
                except:
                    error_msg = "Login failed"
                return WidgetLoginResponse(success=False, error=error_msg)
            
            # Parse successful response
            data = response.json()
            
            # Extract user info using configured paths
            user_id = get_nested_value(data, auth_config.response_user_id_path)
            external_token = get_nested_value(data, auth_config.response_token_path)
            user_name = get_nested_value(data, auth_config.response_name_path) if auth_config.response_name_path else None
            user_email = get_nested_value(data, auth_config.response_email_path) if auth_config.response_email_path else body.email
            
            if not user_id:
                return WidgetLoginResponse(
                    success=False, 
                    error="Could not extract user ID from response"
                )
            
            # Create our own JWT for the widget session
            jwt_secret = auth_config.jwt_secret or DEFAULT_JWT_SECRET
            widget_token = jwt.encode(
                {
                    "user_id": str(user_id),
                    "user_email": user_email,
                    "user_name": user_name,
                    "tenant_id": str(tenant.id),
                    "external_token": external_token,  # Keep the original token
                    "exp": datetime.now(timezone.utc) + timedelta(hours=24),
                },
                jwt_secret,
                algorithm="HS256"
            )
            
            return WidgetLoginResponse(
                success=True,
                token=widget_token,
                user_id=str(user_id),
                user_name=user_name,
                user_email=user_email
            )
            
    except httpx.TimeoutException:
        return WidgetLoginResponse(success=False, error="Login request timed out")
    except httpx.RequestError as e:
        return WidgetLoginResponse(success=False, error=f"Could not reach login server")
    except Exception as e:
        return WidgetLoginResponse(success=False, error=str(e))


@router.post("/auth/verify/{api_key}")
async def verify_widget_token(
    api_key: str,
    body: TokenVerifyRequest,
    db: AsyncSession = Depends(get_db)
) -> WidgetLoginResponse:
    """
    Verify a widget token (from embedded context or previous login).
    """
    tenant = await get_tenant_by_api_key(api_key, db)
    auth_config = await get_auth_config(tenant.id, db)
    
    jwt_secret = (auth_config.jwt_secret if auth_config else None) or DEFAULT_JWT_SECRET
    
    try:
        payload = jwt.decode(body.token, jwt_secret, algorithms=["HS256"])
        
        # Check tenant matches
        if payload.get("tenant_id") != str(tenant.id):
            return WidgetLoginResponse(success=False, error="Invalid token")
        
        return WidgetLoginResponse(
            success=True,
            token=body.token,
            user_id=payload.get("user_id"),
            user_name=payload.get("user_name"),
            user_email=payload.get("user_email")
        )
    except jwt.ExpiredSignatureError:
        return WidgetLoginResponse(success=False, error="Token expired")
    except jwt.InvalidTokenError:
        return WidgetLoginResponse(success=False, error="Invalid token")


@router.post("/auth/create-embedded-token/{api_key}")
async def create_embedded_token(
    api_key: str,
    user_id: str,
    user_email: str | None = None,
    user_name: str | None = None,
    db: AsyncSession = Depends(get_db)
) -> dict:
    """
    Create a signed token for embedded mode.
    Called by the host website's backend to generate a secure token.
    """
    tenant = await get_tenant_by_api_key(api_key, db)
    auth_config = await get_auth_config(tenant.id, db)
    
    jwt_secret = (auth_config.jwt_secret if auth_config else None) or DEFAULT_JWT_SECRET
    
    token = jwt.encode(
        {
            "user_id": user_id,
            "user_email": user_email,
            "user_name": user_name,
            "tenant_id": str(tenant.id),
            "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        },
        jwt_secret,
        algorithm="HS256"
    )
    
    return {"token": token}
