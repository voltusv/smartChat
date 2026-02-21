# On-Prem AI Chat System — Project Plan

## Overview

A self-hosted, embeddable AI chat widget (like tawk.to but with AI + internal data access). Two main components:

1. **Backoffice (Admin Panel)** — configure LLM keys, manage knowledge bases, connect to internal DBs, monitor conversations
2. **Embeddable Chat Widget** — a JS snippet users drop into their apps, connects to the backend over the local network

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                 Customer's App                   │
│  ┌───────────────────────────────────────────┐  │
│  │  Embedded Chat Widget (JS/iframe)         │  │
│  │  - Loaded via <script> tag                │  │
│  │  - Communicates via WebSocket + REST      │  │
│  └──────────────┬────────────────────────────┘  │
└─────────────────┼───────────────────────────────┘
                  │ WebSocket / HTTPS
                  ▼
┌─────────────────────────────────────────────────┐
│              Chat Backend (API Server)            │
│  - Node.js / Python (FastAPI)                    │
│  - WebSocket server for real-time chat           │
│  - REST API for widget config, auth, history     │
│  - RAG pipeline (embed + retrieve + prompt)      │
│  - LLM proxy (OpenAI, Anthropic, Ollama, etc.)   │
│  - Conversation memory & session management      │
│  ┌─────────────┐  ┌──────────────┐              │
│  │ Vector DB   │  │ App Database │              │
│  │ (Chroma/    │  │ (Postgres/   │              │
│  │  Pgvector)  │  │  MongoDB)    │              │
│  └─────────────┘  └──────────────┘              │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│           Backoffice (Admin Panel)                │
│  - React SPA                                     │
│  - API key management (OpenAI, Anthropic, etc.)  │
│  - Knowledge base upload (PDF, CSV, docs, URLs)  │
│  - DB connection config (internal DBs)           │
│  - Widget customization (colors, greeting, etc.) │
│  - Conversation logs & analytics                 │
│  - User/tenant management                        │
│  - Tool/function definitions for the LLM         │
└─────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Backoffice Admin Panel (React + REST API)

**Pages / Features:**

| Page | Purpose |
|---|---|
| **Dashboard** | Active conversations, usage stats, token consumption |
| **LLM Configuration** | Add/edit API keys for OpenAI, Anthropic, Ollama (local). Select default model, set temperature, max tokens |
| **Knowledge Base** | Upload documents (PDF, DOCX, CSV, TXT). Chunk → embed → store in vector DB. Manage/delete sources |
| **DB Connections** | Configure connections to internal Postgres/MySQL/MongoDB. Define allowed queries or schemas the LLM can access. SQL tool definitions |
| **Widget Settings** | Customize appearance (colors, logo, greeting message, position). Generate embed `<script>` snippet. Set allowed domains |
| **Tools / Functions** | Define custom tools the LLM can call (REST endpoints, DB queries, internal APIs) |
| **Conversations** | Browse/search conversation history. Flag, export, delete |
| **Tenants / API Keys** | Multi-tenant support. Each tenant gets an embed key. Rate limiting config |

### 2. Chat Backend (API Server)

**Tech: Python (FastAPI) or Node.js — I recommend FastAPI for the RAG ecosystem**

**Core Services:**

- **Auth middleware** — validate embed API key per request, rate limiting
- **WebSocket handler** — real-time bidirectional chat
- **RAG pipeline:**
  - Query embedding → vector search → context retrieval
  - Prompt assembly (system prompt + retrieved context + conversation history + user message)
  - LLM call (supports multiple providers via unified interface)
  - Streaming response back to widget
- **Tool execution engine:**
  - LLM returns tool calls → backend executes against internal DB/APIs → feeds results back to LLM
  - Sandboxed: only pre-configured queries/endpoints allowed
- **Conversation store** — persist chat history (Postgres)
- **Document ingestion worker** — async chunking + embedding on upload

**Key API Endpoints:**

```
POST   /api/chat/message          # Send message (REST fallback)
WS     /ws/chat/{session_id}      # WebSocket real-time chat
GET    /api/chat/history/{session} # Get conversation history
POST   /api/admin/knowledge/upload # Upload documents
PUT    /api/admin/llm/config       # Update LLM settings
POST   /api/admin/db/test          # Test DB connection
GET    /api/widget/config/{key}    # Widget fetches its config
```

### 3. Embeddable Chat Widget

**Tech: Vanilla JS + Shadow DOM (framework-agnostic, no conflicts with host app)**

**What the user gets:**
```html
<script src="https://your-server:8080/widget.js" 
        data-api-key="tenant_abc123"></script>
```

**Widget responsibilities:**
- Renders chat bubble + chat window (inside Shadow DOM or iframe)
- Opens WebSocket to backend
- Sends/receives messages with streaming display
- Stores session ID in localStorage for continuity
- Fully customizable via config fetched from backend
- Mobile responsive
- Offline/reconnection handling

---

## Tech Stack Recommendation

| Component | Technology | Why |
|---|---|---|
| Backend API | **FastAPI (Python)** | Best RAG/LLM ecosystem (LangChain, LlamaIndex), async, fast |
| WebSocket | **FastAPI WebSockets** or **Socket.IO** | Built-in with FastAPI |
| Admin Panel | **React + Tailwind + shadcn/ui** | Fast to build, good component library |
| Database | **PostgreSQL** | Conversations, config, tenants |
| Vector Store | **pgvector** (Postgres extension) | One less service to run, good enough for most cases |
| Embeddings | **OpenAI text-embedding-3-small** or **local sentence-transformers** | Configurable per deployment |
| LLM Proxy | **LiteLLM** or custom | Unified interface to OpenAI/Anthropic/Ollama/local |
| Document Processing | **Unstructured** or **LangChain loaders** | PDF, DOCX, CSV parsing |
| Chat Widget | **Vanilla JS + Shadow DOM** | Zero dependencies, no conflicts |
| Containerization | **Docker Compose** | Single `docker-compose up` deployment |

---

## Data Model (Simplified)

```sql
-- Tenants / orgs
tenants: id, name, embed_api_key, created_at

-- LLM config per tenant
llm_configs: id, tenant_id, provider, api_key_encrypted, model, temperature, max_tokens, system_prompt

-- Knowledge sources
knowledge_sources: id, tenant_id, filename, source_type, status, chunk_count, created_at

-- Document chunks + embeddings (pgvector)
document_chunks: id, source_id, content, metadata_json, embedding vector(1536)

-- DB connections
db_connections: id, tenant_id, db_type, host, port, database, username, password_encrypted, allowed_schemas

-- Tool definitions
tools: id, tenant_id, name, description, type (db_query|rest_api), config_json

-- Conversations
conversations: id, tenant_id, session_id, started_at, metadata_json

-- Messages
messages: id, conversation_id, role (user|assistant|system|tool), content, tool_calls_json, tokens_used, created_at

-- Widget config
widget_configs: id, tenant_id, primary_color, greeting, position, logo_url, allowed_domains
```

---

## Implementation Phases

### Phase 1 — MVP Core (Week 1-2)
- FastAPI backend with WebSocket chat
- Single-tenant, hardcoded LLM config
- Basic RAG: upload docs → chunk → embed → retrieve → prompt
- Minimal chat widget (vanilla JS, floating bubble)
- Simple admin page (upload docs, set API key, see conversations)
- Docker Compose (Postgres + pgvector + API)

### Phase 2 — Full Backoffice (Week 3-4)
- React admin panel with all pages
- Multi-tenant with embed API keys
- Widget customization (colors, greeting, logo)
- DB connection management + SQL tool execution
- Custom tool/function definitions
- Encrypted credential storage

### Phase 3 — Production Hardening (Week 5-6)
- Streaming responses in widget
- Conversation history + search
- Rate limiting + usage tracking
- Auth for admin panel (JWT)
- File upload in chat
- Widget iframe mode (for extra isolation)
- Health checks, logging, error handling

### Phase 4 — Advanced (Future)
- Ollama/local LLM support for fully air-gapped deployments
- Human handoff (escalate to live agent)
- Webhooks (notify external systems on events)
- Analytics dashboard (popular questions, resolution rate)
- Multi-language support
- Fine-tuning pipeline

---

## Directory Structure

```
ai-chat-system/
├── docker-compose.yml
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app
│   │   ├── config.py               # Settings
│   │   ├── models/                 # SQLAlchemy models
│   │   ├── api/
│   │   │   ├── chat.py             # Chat endpoints + WebSocket
│   │   │   ├── admin.py            # Admin CRUD endpoints
│   │   │   ├── widget.py           # Widget config endpoint
│   │   │   └── auth.py             # Auth middleware
│   │   ├── services/
│   │   │   ├── llm_service.py      # LLM provider abstraction
│   │   │   ├── rag_service.py      # RAG pipeline
│   │   │   ├── embedding_service.py
│   │   │   ├── document_service.py # Chunking + ingestion
│   │   │   ├── tool_executor.py    # Execute tools/DB queries
│   │   │   └── db_connector.py     # Connect to tenant DBs
│   │   └── utils/
│   │       ├── encryption.py
│   │       └── prompts.py          # System prompt templates
│   ├── requirements.txt
│   └── Dockerfile
├── admin/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LLMConfig.jsx
│   │   │   ├── KnowledgeBase.jsx
│   │   │   ├── DBConnections.jsx
│   │   │   ├── WidgetSettings.jsx
│   │   │   ├── Tools.jsx
│   │   │   ├── Conversations.jsx
│   │   │   └── Tenants.jsx
│   │   └── ...
│   ├── package.json
│   └── Dockerfile
├── widget/
│   ├── src/
│   │   ├── widget.js               # Entry point, loaded via <script>
│   │   ├── chat-ui.js              # Shadow DOM chat interface
│   │   ├── websocket-client.js     # WS connection handler
│   │   └── styles.css              # Injected into shadow DOM
│   ├── build/                      # Bundled widget.js served by backend
│   └── package.json
└── docs/
    ├── deployment.md
    └── api-reference.md
```

---

## Prompt Template Strategy

The system prompt sent to the LLM should be assembled dynamically:

```
[SYSTEM PROMPT FROM ADMIN CONFIG]
You are a helpful assistant for {company_name}...

[RETRIEVED CONTEXT FROM RAG]
Based on the following information from our knowledge base:
---
{retrieved_chunks}
---

[TOOL DEFINITIONS]
You have access to these tools:
- query_inventory(product_name) - Check stock levels
- get_order_status(order_id) - Look up order status
...

[CONVERSATION HISTORY]
{last_N_messages}

[USER MESSAGE]
{current_message}
```

---

## Key Design Decisions to Make Before Coding

1. **FastAPI vs Node.js** — I recommend FastAPI given the Python ML/RAG ecosystem, but Node.js works too if you prefer
2. **pgvector vs Chroma** — pgvector = fewer services; Chroma = more features out of the box
3. **Widget: Shadow DOM vs iframe** — Shadow DOM is lighter; iframe is more isolated
4. **Auth for admin panel** — simple JWT, or integrate with existing SSO?
5. **Encryption** — Fernet (Python) for API keys at rest, or vault integration?

---

This plan is ready to feed to Claude for implementation. I'd suggest starting with Phase 1 — 