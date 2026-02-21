#!/bin/bash
# Start SmartChat locally (no Docker)

# Start backend
echo "Starting backend on :8000..."
cd "$(dirname "$0")/backend"
source venv/bin/activate
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

# Start admin frontend
echo "Starting admin frontend on :5173..."
cd "$(dirname "$0")/admin"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "SmartChat running:"
echo "  Backend:  http://localhost:8000"
echo "  Admin:    http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait and cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
