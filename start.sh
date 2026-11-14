#!/bin/bash
export PATH="$HOME/.local/bin:$HOME/.local/node/bin:$PATH"
cd "$(dirname "$0")"
./frontend/node_modules/.bin/concurrently -n "backend,frontend" -c "blue,green" "node backend/server.cjs" "cd frontend && npm run dev"
