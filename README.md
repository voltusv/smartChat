# SmartChat - Self-Hosted AI Chat Widget

A self-hosted, embeddable AI chat widget with RAG (Retrieval Augmented Generation) capabilities. Think tawk.to but with AI + your own knowledge base.

## 🚀 Features

- **Embeddable Chat Widget**: Drop-in `<script>` tag for any website
- **Real-time Streaming**: WebSocket-based streaming responses
- **RAG Pipeline**: Upload PDFs, TXT, CSV to build your knowledge base
- **Database Connections**: Connect to PostgreSQL, MySQL, MongoDB and query with natural language
- **AI Function Calling**: Automatic SQL/query generation and execution
- **Admin Panel**: Configure LLM, manage knowledge base, DB connections, view conversations
- **Customizable**: Colors, greeting message, position
- **Multi-tenant Ready**: Architecture supports multiple organizations

## 📋 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+ with pgvector extension

### 1. Setup Database

```bash
# Create the database
psql -h localhost -c "CREATE DATABASE smartchat;"
psql -h localhost -d smartchat -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings:
# - DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/smartchat
# - OPENAI_API_KEY=sk-your-key-here
```

### 3. Install & Run Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Install & Run Admin Panel

```bash
cd admin
npm install
npm run dev
```

### 5. Build Widget (for production)

```bash
cd widget
npm install
npm run build
```

## 🔗 Access Points

| Service | URL |
|---------|-----|
| Admin Panel | http://localhost:5173 |
| API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Widget Test Page | http://localhost:8080/test.html |

## 🎯 Usage

### Embed the Widget

Add this to any webpage:

```html
<script src="http://localhost:8000/widget.js" 
        data-api-key="test-key-123"></script>
```

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
2. Add your PostgreSQL/MySQL/MongoDB connection
3. Click "Test" to verify connectivity
4. Click "Schema" to auto-discover tables
5. Now the AI can answer questions about your data!

Example questions the AI can now answer:
- "How many orders did we have last week?"
- "What's our top-selling product?"
- "Show me customers who signed up this month"

See [docs/DATABASE-CONNECTIONS.md](docs/DATABASE-CONNECTIONS.md) for full documentation.

### Customize Widget

1. Go to Admin Panel → Widget Settings
2. Change colors, greeting, position
3. Copy embed code

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         Customer's Website          │
│  ┌───────────────────────────────┐  │
│  │   Chat Widget (Shadow DOM)    │  │
│  └──────────────┬────────────────┘  │
└─────────────────┼───────────────────┘
                  │ WebSocket
                  ▼
┌─────────────────────────────────────┐
│        FastAPI Backend              │
│  - WebSocket real-time chat         │
│  - RAG pipeline (embed → retrieve)  │
│  - LLM proxy (OpenAI)               │
│  ┌───────────┐  ┌────────────────┐  │
│  │ pgvector  │  │   PostgreSQL   │  │
│  │(embeddings)│  │ (conversations)│  │
│  └───────────┘  └────────────────┘  │
└─────────────────────────────────────┘
```

## 📁 Project Structure

```
smartChat/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin.py      # Admin endpoints
│   │   │   ├── chat.py       # Chat WebSocket
│   │   │   └── widget.py     # Widget config
│   │   ├── services/
│   │   │   ├── llm_service.py
│   │   │   ├── rag_service.py
│   │   │   ├── embedding_service.py
│   │   │   └── document_service.py
│   │   ├── models/
│   │   │   └── models.py     # SQLAlchemy models
│   │   ├── main.py
│   │   └── config.py
│   ├── static/widget/
│   │   └── widget.js         # Built widget
│   └── requirements.txt
├── admin/
│   ├── src/
│   │   └── App.jsx           # React admin panel
│   └── package.json
├── widget/
│   ├── src/
│   │   ├── widget.js
│   │   ├── chat-ui.js
│   │   ├── websocket-client.js
│   │   └── styles.css
│   └── package.json
├── docker-compose.yml
├── .env
└── test.html
```

## 🔌 API Endpoints

### Chat
- `WS /api/chat/ws/chat/{session_id}` - Real-time chat
- `GET /api/chat/history/{session_id}` - Chat history

### Admin
- `GET/PUT /api/admin/llm/config` - LLM configuration
- `GET/POST/DELETE /api/admin/knowledge/*` - Knowledge base
- `GET /api/admin/conversations` - List conversations
- `GET/PUT /api/admin/widget/config` - Widget settings

### Widget
- `GET /widget.js` - Widget bundle
- `GET /api/widget/config/{api_key}` - Widget config

## 🐳 Docker Deployment

```bash
docker compose up -d
```

Services:
- `db`: PostgreSQL with pgvector
- `api`: FastAPI backend (port 8000)
- `admin`: React admin panel (port 3000)

## 🛣️ Roadmap

- [ ] Multi-tenant authentication
- [ ] Ollama/local LLM support
- [ ] Human handoff to live agents
- [ ] Webhooks for external integrations
- [ ] Analytics dashboard
- [ ] Fine-tuning pipeline

## 📝 License

MIT

---

Built with ❤️ using FastAPI, React, and OpenAI
