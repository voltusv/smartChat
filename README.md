# SmartChat - Self-Hosted AI Chat Widget

A self-hosted, embeddable AI chat widget with RAG (Retrieval Augmented Generation) and optional **business database querying**.

Think **tawk.to**, but with:
- AI (OpenAI or Ollama)
- Your own knowledge base (PDF/TXT/CSV)
- Optional data access (Postgres/MySQL/MongoDB)
- Optional user authentication (embedded SSO-style or widget login)

---

## Features

### Widget
- **Embeddable Chat Widget**: Drop-in `<script>` tag for any website (Shadow DOM isolation)
- **Rich Text Editor**: Toolbar with formatting (bold, italic, underline, lists, code, headings, links)
- **Markdown Rendering**: AI responses rendered as HTML (code blocks, tables, lists, headings)
- **Real-time Streaming**: WebSocket streaming with live incremental rendering

### AI / RAG
- **LLM Providers**:
  - **OpenAI** (API key required)
  - **Ollama / Local OpenAI-compatible** (API key not required; `base_url` supported)
- **RAG Pipeline**: Upload PDF/TXT/CSV, chunk + embed + retrieve (pgvector)

### External Data (Optional)
- **Database Connections**: Query business DBs (PostgreSQL, MySQL, MongoDB)
- **MongoDB connection string support**: Use full URIs for replica sets / auth options
- **Schema Explorer**: Fetch schema + browse tables/collections
- **AI Function Calling**: Model can call query tools (SQL/Mongo JSON spec) to retrieve real data

### Authentication (Optional)
Supports both modes:
- **Embedded user context** (recommended): host website passes user identity/token to the widget
- **Widget login** (External API): widget shows email/password form and SmartChat proxies to your existing login API

### Admin Panel
- Tenants + API keys
- LLM config (provider/model/base_url)
- Knowledge base management
- DB connections + schema fetching
- Authentication config
- Conversation history

---

## Quick Start

### Docker (Recommended)

```bash
cp .env.example .env
# Edit .env with your settings (OpenAI key optional if using Ollama)

docker-compose up --build
```

Access:

- **Admin Panel:** http://localhost:3001
- **API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Widget Test Page:** http://localhost:8000/test.html

> Note: SmartChat runs lightweight, idempotent startup migrations (adds new columns/tables) so older Docker volumes don’t break when you pull new code.

---

## Local Development (No Docker)

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+ with extensions:
  - `vector` (pgvector)
  - `pgcrypto` (UUID helpers)

### 1) Setup Database

```bash
psql -h localhost -c "CREATE DATABASE smartchat;"
psql -h localhost -d smartchat -c "CREATE EXTENSION IF NOT EXISTS vector;"
psql -h localhost -d smartchat -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
```

### 2) Configure Environment

```bash
cp .env.example .env
# Edit .env:
# - DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/smartchat
# - OPENAI_API_KEY=... (optional if using Ollama)
# - DEFAULT_API_KEY=... (optional)
```

### 3) Run Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4) Run Admin Panel

```bash
cd admin
npm install
npm run dev
```

### 5) Build Widget Bundle

```bash
cd widget
npm install
npm run build
```

Or:

```bash
./start-local.sh
```

Local URLs:
- Admin: http://localhost:5173
- API: http://localhost:8000
- Test page: http://localhost:8000/test.html

---

## Usage

### 1) Get an API Key

- Docker Admin: http://localhost:3001
- Local Admin: http://localhost:5173

Go to **API Keys** and create a tenant. You only see the full key once (on creation).

Also, you can set a dev default key in `.env`:

```env
DEFAULT_API_KEY=test-key-123
```

### 2) Embed the Widget

```html
<script
  src="http://localhost:8000/widget.js"
  data-api-key="YOUR_TENANT_API_KEY">
</script>
```

### 3) (Optional) Embedded User Context

If the user is already logged into your site, pass identity to the widget:

```html
<script
  src="http://localhost:8000/widget.js"
  data-api-key="YOUR_TENANT_API_KEY"
  data-user-id="12345"
  data-user-name="John Doe"
  data-user-email="john@example.com">
</script>
```

This makes it possible to scope data access (e.g., "only show this user's transactions").

### 4) (Optional) Widget Login (External API)

If you want the widget to ask for credentials when the user is *not* logged in:

1. Go to **Admin → Authentication**
2. Set mode to **External API**
3. Configure:
   - Login URL
   - Request field names (email/password)
   - Response JSON paths (user id, token, optional name/email)

Widget flow:
- Widget loads → `/api/auth/config/{api_key}`
- If login required → shows login form
- Submits to → `/api/auth/login/{api_key}`
- Backend proxies to your login URL and returns a SmartChat JWT
- Widget sends `user_token` over WebSocket for identification

### 5) Configure LLM Provider

Admin → **LLM Config**

- **OpenAI**: set API key
- **Ollama**: set provider to `ollama` and optional base URL

### 6) Knowledge Base (RAG)

Admin → **Knowledge Base**

- Upload PDFs/TXT/CSV
- Wait until status is `ready`

### 7) External DB Connections (Optional)

Admin → **DB Connections**

Add a DB connection to let the AI run real queries.

- SQL databases: only `SELECT` is allowed (safety)
- MongoDB: JSON query spec
- MongoDB supports either:
  - host/port/user/pass
  - OR a full **connection string** (recommended for replica sets)

---

## API Endpoints (High Level)

### Chat
- `WS /api/chat/ws/chat/{session_id}`
  - payload supports `{ message, api_key, user_token? }`
- `GET /api/chat/history/{session_id}`

### Admin
- Tenants / API Keys:
  - `GET /api/admin/tenants`
  - `POST /api/admin/tenants`
- LLM:
  - `GET/PUT /api/admin/llm/config`
- Auth:
  - `GET/PUT /api/admin/auth/config`
  - `POST /api/admin/auth/generate-secret`
- Knowledge:
  - `GET /api/admin/knowledge`
  - `POST /api/admin/knowledge/upload`
- DB Connections:
  - `GET/POST/PUT/DELETE /api/admin/db-connections`
  - `POST /api/admin/db-connections/{id}/test`
  - `POST /api/admin/db-connections/{id}/fetch-schema`
- Widget:
  - `GET/PUT /api/admin/widget/config`

### Widget/Auth (public)
- `GET /widget.js`
- `GET /api/widget/config/{api_key}`
- `GET /api/auth/config/{api_key}`
- `POST /api/auth/login/{api_key}`
- `POST /api/auth/verify/{api_key}`
- `GET /test.html`

---

## Project Structure

```
smartChat/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin.py
│   │   │   ├── auth.py
│   │   │   ├── chat.py
│   │   │   └── widget.py
│   │   ├── services/
│   │   │   ├── llm_service.py
│   │   │   ├── rag_service.py
│   │   │   ├── embedding_service.py
│   │   │   ├── document_service.py
│   │   │   ├── db_connector.py
│   │   │   └── tool_executor.py
│   │   ├── models/
│   │   │   ├── models.py
│   │   │   └── __init__.py
│   │   ├── main.py
│   │   └── config.py
│   ├── static/
│   │   └── widget/widget.js
│   └── requirements.txt
├── admin/
├── widget/
├── docker-compose.yml
├── start-local.sh
├── .env.example
└── test.html
```

---

## Notes / Gotchas

- **`create_all()` doesn’t alter existing tables.** SmartChat includes lightweight startup migrations to add new columns/tables safely.
- The chat can still “answer” without external DB connections (pure LLM). If you need hard guarantees (no guessing), add guardrails.

---

## License

MIT
