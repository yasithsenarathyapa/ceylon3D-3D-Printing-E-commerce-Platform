#!/usr/bin/env bash
# Simple scaffold helper for the Vite React frontend
# Run: ./scripts/init-frontend.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

create_if_missing() {
  local path="$1"
  local content="$2"
  if [ -e "$path" ]; then
    echo "[skip] $path already exists"
  else
    mkdir -p "$(dirname "$path")"
    printf "%s" "$content" > "$path"
    echo "[create] $path"
  fi
}

# index.html
create_if_missing "index.html" "<!doctype html>\n<html>\n  <head>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Vite + React App</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n"

# src/main.tsx
create_if_missing "src/main.tsx" "import React from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App'\nimport './styles/globals.css'\n\nconst root = createRoot(document.getElementById('root')!)\nroot.render(<App />)\n"

# src/App.tsx
create_if_missing "src/App.tsx" "import React from 'react'\n\nexport default function App() {\n  return (\n    <main style={{padding: '2rem', fontFamily: 'Inter, ui-sans-serif, system-ui'}} >\n      <h1>Hello — Vite + React</h1>\n      <p>This is a minimal starter App.</p>\n    </main>\n  )\n}\n"

# src/styles/globals.css
create_if_missing "src/styles/globals.css" "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');\n\n:root {\n  --bg: #fff;\n  --fg: #0f172a;\n}\nhtml, body, #root {\n  height: 100%;\n  margin: 0;\n  background: var(--bg);\n  color: var(--fg);\n}\n"

# dev script note
if ! grep -q '"dev":' package.json 2>/dev/null; then
  echo "\nNote: package.json doesn't have a 'dev' script. You can add: \n  \"scripts\": { \"dev\": \"vite\" }\n"
fi

echo "Done. Run 'npm install' (once) and 'npm run dev' to start the dev server."