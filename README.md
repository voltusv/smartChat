# SmartChat - Self-Hosted AI Chat Widget

A self-hosted, embeddable AI chat widget with RAG (Retrieval Augmented Generation) capabilities. Think tawk.to but with AI + your own knowledge base.

## Features

- **Embeddable Chat Widget**: Drop-in `<script>` tag for any website with Shadow DOM isolation
- **Rich Text Editor**: Toolbar with bold, italic, underline, lists, code, headings, and links
- **Markdown Rendering**: AI responses rendered as formatted HTML (code blocks, tables, lists, headings)
- **Real-time Streaming**: WebSocket-based streaming responses with live markdown rendering
- **RAG Pipeline**: Upload PDFs, TXT, CSV to build your knowledge base
- **Database Connections**: Connect to PostgreSQL, MySQL, MongoDB and query with natural language
- **Schema Explorer**: Interactive tree view with search to browse your database tables/collections
- **AI Function Calling**: Automatic SQL/query generation and execution
- **Admin Panel**: Configure LLM, manage knowledge base, DB connections, view conversations
- **Customizable**: Colors, greeting message, position
- **Multi-tenant Ready**: Architecture supports multiple organizations

## Quick Start

### Docker (Recommended)

```bash
cp .env.example .env
# Edit .env with your OPENAI_API_KEY

docker-compose up -d
```

That's it. Access:

| Service | URL |
|---------|-----|
| Admin Panel | http://localhost:3001 |
| API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Widget Test Page | http://localhost:8000/test.html |

### Local Development (No Docker)

#### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+ with pgvector extension

#### 1. Setup Database

```bash
psql -h localhost -c "CREATE DATABASE smartchat;"
psql -h localhost -d smartchat -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

#### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings:
# - DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/smartchat
# - OPENAI_API_KEY=sk-your-key-here
```

#### 3. Install & Run Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 4. Install & Run Admin Panel

```bash
cd admin
npm install
npm run dev
```

#### 5. Build Widget

```bash
cd widget
npm install
npm run build
```

#### Or use the helper script:

```bash
./start-local.sh
```

| Service | URL |
|---------|-----|
| Admin Panel | http://localhost:5173 |
| API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Widget Test Page | http://localhost:8000/test.html |

## Usage

### Embed the Widget

Add this to any webpage:

```html
<script src="http://localhost:8000/widget.js"
        data-api-key="test-key-123"></script>
```

The widget features:
- Rich text input with formatting toolbar
- AI responses with full markdown rendering (code blocks, tables, lists)
- Real-time streaming via WebSocket
- Shadow DOM isolation (no style conflicts with your site)

### Upload Knowledge Base

1. Go to Admin Panel → Knowledge Base
2. Upload PDF, TXT, or CSV files
3. Wait for processing (status: "ready")
4. The AI will now use this knowledge to answer questions

### Configure LLM

1. Go to Admin Panel → LLM Config
2. Enter your OpenAI API key
3. Choose model, temperature, max tokens
4. Customize the system prompt

### Connect Your Database

1. Go to Admin Panel → DB Connections
2. Add your PostgreSQL/MySQL/MongoDB connection (individual params or connection string)
3. Click **Test** to verify connectivity
4. Click **Schema** to auto-discover tables/collections
5. Browse the interactive schema tree view with search
6. The AI can now answer questions about your data!

Example questions the AI can now answer:
- "How many orders did we have last week?"
- "What's our top-selling product?"
- "Show me customers who signed up this month"

See [docs/DATABASE-CONNECTIONS.md](docs/DATABASE-CONNECTIONS.md) for full documentation.

### Customize Widget

1. Go to Admin Panel → Widget Settings
2. Change colors, greeting, position
3. Copy embed code

## Architecture

```
┌─────────────────────────────────────┐
│         Customer's Website          │
│  ┌───────────────────────────────┐  │
│  │   Chat Widget (Shadow DOM)    │  │
│  │  - Rich text editor           │  │
│  │  - Markdown rendering         │  │
│  │  - DOMPurify sanitization     │  │
│  └──────────────┬────────────────┘  │
└─────────────────┼───────────────────┘
                  │ WebSocket
                  ▼
┌─────────────────────────────────────┐
│        FastAPI Backend              │
│  - WebSocket real-time chat         │
│  - RAG pipeline (embed → retrieve)  │
│  - LLM proxy (OpenAI)               │
│  - DB connector (PG/MySQL/MongoDB)  │
│  ┌───────────┐  ┌────────────────┐  │
│  │ pgvector  │  │   PostgreSQL   │  │
│  │(embeddings)│  │ (conversations)│  │
│  └───────────┘  └────────────────┘  │
└─────────────────────────────────────┘
```

## Project Structure

```
smartChat/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin.py          # Admin endpoints
│   │   │   ├── chat.py           # Chat WebSocket
│   │   │   └── widget.py         # Widget config & test page
│   │   ├── services/
│   │   │   ├── llm_service.py    # OpenAI integration
│   │   │   ├── rag_service.py    # RAG pipeline
│   │   │   ├── embedding_service.py
│   │   │   ├── document_service.py
│   │   │   ├── db_connector.py   # External DB connections
│   │   │   └── tool_executor.py  # AI function calling
│   │   ├── models/
│   │   │   └── models.py         # SQLAlchemy models
│   │   ├── main.py
│   │   └── config.py
│   ├── static/
│   │   ├── widget/widget.js      # Built widget bundle
│   │   └── test.html             # Widget test page
│   └── requirements.txt
├── admin/
│   ├── src/
│   │   └── App.jsx               # React admin panel
│   └── package.json
├── widget/
│   ├── src/
│   │   ├── widget.js             # Entry point
│   │   ├── chat-ui.js            # Chat UI & message rendering
│   │   ├── rich-editor.js        # Rich text editor with toolbar
│   │   ├── markdown-renderer.js  # Markdown → sanitized HTML
│   │   ├── html-to-markdown.js   # Editor HTML → markdown
│   │   ├── websocket-client.js   # WebSocket client
│   │   └── styles.css            # Widget styles
│   └── package.json
├── docker-compose.yml
├── start-local.sh
├── .env.example
└── test.html
```

## API Endpoints

### Chat
- `WS /api/chat/ws/chat/{session_id}` - Real-time chat
- `GET /api/chat/history/{session_id}` - Chat history

### Admin
- `GET/PUT /api/admin/llm/config` - LLM configuration
- `GET/POST/DELETE /api/admin/knowledge/*` - Knowledge base
- `GET/POST/PUT/DELETE /api/admin/db-connections/*` - Database connections
- `POST /api/admin/db-connections/{id}/test` - Test connection
- `POST /api/admin/db-connections/{id}/fetch-schema` - Fetch schema
- `GET /api/admin/conversations` - List conversations
- `GET/PUT /api/admin/widget/config` - Widget settings

### Widget
- `GET /widget.js` - Widget bundle
- `GET /api/widget/config/{api_key}` - Widget config
- `GET /test.html` - Widget test page

## Docker Deployment

```bash
docker-compose up -d
```

Services:
- `db`: PostgreSQL with pgvector (port 5432)
- `api`: FastAPI backend (port 8000)
- `admin`: React admin panel (port 3001)

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, pgvector, OpenAI
- **Admin Panel**: React, Vite
- **Widget**: Vanilla JS, Shadow DOM, esbuild, marked, DOMPurify
- **Database**: PostgreSQL with pgvector extension
- **External DBs**: PostgreSQL, MySQL (aiomysql), MongoDB (motor)

## Roadmap

- [ ] Multi-tenant authentication
- [ ] Ollama/local LLM support
- [ ] Human handoff to live agents
- [ ] Webhooks for external integrations
- [ ] Analytics dashboard
- [ ] Fine-tuning pipeline

## License

MIT
