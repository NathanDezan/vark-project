# Vite + FastAPI Boilerplate

Minimal monorepo deployed on Vercel via **Services**: a Vite + React frontend
and a public FastAPI backend mounted at `/svc/api/*`.

## Project structure

```
vark-project/
├── vercel.json
├── backend/
│   ├── main.py
│   └── pyproject.toml
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── index.css
```

## Endpoints

- `GET /` — React app
- `GET /svc/api/status` — FastAPI health/info JSON

## Run locally

Requires **Vercel CLI** (`npm i -g vercel`), **Node 18+**, and **Python 3.12+**.

```bash
cd frontend && npm install
cd ../backend && pip install -e .
cd .. && vercel dev
```

Open <http://localhost:3000> and click **Call /svc/api/status**.

### Run services individually

Frontend only (Vite proxies `/svc/api/*` to `http://localhost:8000`,
matching the production rewrite):

```bash
cd frontend && npm install && npm run dev
```

Backend only (start this in a second terminal before clicking the button):

```bash
cd backend && pip install .
python -m uvicorn main:app --reload --port 8000
```

Curl the backend directly:

```bash
curl http://localhost:8000/svc/api/status
```

## Deploy

```bash
vercel --prod
```

On first deploy, set the project framework to **Services** if Vercel prompts
for it.

## Configuration

- `VITE_BACKEND_URL` — frontend env var pointing to the backend. Defaults to
  `/svc/api`, which works under the Vercel rewrite. Override it to hit a
  different FastAPI host during local dev.
