# Authentication (Widget Users)

SmartChat supports **optional user authentication** for the chat widget.

This is separate from:
- SmartChat's internal Postgres (tenants, conversations, messages)
- External business DB connections (Mongo/Postgres/MySQL)

Authentication allows you to:
- Identify the end-user in a chat session
- Scope database queries so users can only see their own data (e.g., transactions)

---

## Modes

### 1) None (anonymous)
- Widget opens and chats immediately
- No user identity is attached

### 2) Embedded Only (recommended)
- Your website already knows who the user is (logged-in session)
- You pass user identity to the widget via data attributes

Example:
```html
<script
  src="http://localhost:8000/widget.js"
  data-api-key="YOUR_TENANT_API_KEY"
  data-user-id="12345"
  data-user-name="John Doe"
  data-user-email="john@example.com">
</script>
```

Notes:
- This does **not** require any login UI in the widget
- The widget will include user context in requests

### 3) External API (Widget Login)
- Widget shows an email/password login form
- SmartChat proxies credentials to your existing login API
- SmartChat receives the response, extracts user ID/token, and returns a SmartChat JWT

Flow:
1. Widget loads auth config:
   - `GET /api/auth/config/{api_key}`
2. If `requires_login=true`, widget displays login form
3. Widget submits credentials:
   - `POST /api/auth/login/{api_key}`
4. SmartChat calls your configured `login_url`
5. SmartChat returns `{ success, token, user_id, ... }`
6. Widget stores `token` in localStorage and sends it via WebSocket as `user_token`

---

## Admin Configuration

In Admin Panel → **Authentication**:
- `auth_mode`: `none | embedded_only | external_api`

For `external_api`:
- `login_url`: Your login endpoint
- `login_method`: POST/GET
- Request mapping:
  - `email_field`
  - `password_field`
- Response mapping (JSON paths, dot-notation):
  - `response_user_id_path` (required)
  - `response_token_path`
  - `response_name_path`
  - `response_email_path`

Also:
- Generate a per-tenant JWT secret (recommended)
  - `POST /api/admin/auth/generate-secret`

---

## Public Auth Endpoints

- `GET  /api/auth/config/{api_key}`
- `POST /api/auth/login/{api_key}`
- `POST /api/auth/verify/{api_key}`

Optional helper (for embedded backends):
- `POST /api/auth/create-embedded-token/{api_key}`

---

## Security Notes (Important)

- If using `external_api`, SmartChat will temporarily handle plaintext credentials in transit.
  - Use HTTPS in production.
  - Consider rate limiting and lockouts on the upstream auth API.

- SmartChat issues its own JWT for the widget session.
  - Set a strong per-tenant secret.
  - Keep token TTL reasonable (default is 24h).

- SmartChat does not (yet) enforce strict DB row-level security automatically.
  - The LLM is instructed to filter by user_id.
  - For real security, add DB-level views/RLS or hard query templates.
