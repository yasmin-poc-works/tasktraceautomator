# TaskTraceAutomator

AI-assisted, traceable, and governed workflow from meeting decisions to GitHub backlog issues (GitHub Issues and Projects via the GitHub MCP server) and reviewable code changes.

---

## Repository Structure

```text
tasktraceautomator/
├── docker-compose.yml          # Local multi-service stack (Django, Postgres, Redis, Celery, App)
├── .env.example                # Root environment template
├── api/                        # All Backend Code
│   ├── Dockerfile              # Web & worker container image (Python 3.12)
│   ├── manage.py               # Django management CLI
│   ├── pyproject.toml          # Ruff, Mypy, and Pytest configuration
│   ├── requirements.txt        # Backend dependencies
│   ├── requirements-dev.txt    # Testing & development dependencies
│   ├── config/                 # Django settings, URLs, WSGI, ASGI, Celery app
│   ├── apps/                   # Domain bounded contexts
│   │   ├── accounts/           # Auth, JWT, roles & project memberships
│   │   ├── projects/           # Project configuration & settings
│   │   ├── meetings/           # Transcript ingestion & redaction
│   │   ├── requirements/       # Requirement package & review gates
│   │   ├── work_items/         # Work items, plan versions, plan changes
│   │   ├── runs/               # Coding run orchestration
│   │   ├── verification/       # Automated test, scan, and traceability verification
│   │   ├── integrations/       # GitHub MCP tracker adapter & optional webhooks
│   │   └── audit/              # Append-only audit events
│   ├── agents/                 # Analyst, Planner, Context Builder, Coding Agent
│   ├── providers/              # LLM, Transcription, SCM, Tracker adapters
│   ├── schemas/                # Pydantic & JSON artifact contracts
│   ├── prompts/                # Versioned LLM prompts
│   ├── runner/                 # Hardened execution sandbox container & entrypoint
│   └── tests/                  # Unit, integration, workflow, and evaluation tests
├── app/                        # All Frontend Code
│   ├── Dockerfile              # Multi-stage production container (Node build -> Nginx)
│   ├── nginx.conf              # Serves React build & reverse-proxies /api to web
│   ├── package.json            # React 18, TypeScript, Vite, Tailwind CSS, TanStack Query
│   ├── vite.config.ts          # Vite configuration with /api dev proxy
│   └── src/                    # Components, routes, board UI, API client
├── docs/                       # Project Documentation
│   ├── README.md               # Documentation guide & index
│   ├── architecture/           # Architecture, HLD, and product plan
│   ├── implementation_plan/    # Implementation plan and task tracker
│   └── ui/                     # UI/UX design specifications & wireframes
```

---

## Quickstart

### Running with Docker Compose (Recommended)

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Start all services:
   ```bash
   docker compose up --build
   ```

3. Access the application:
   - **Frontend App**: `http://localhost` (or `http://localhost:5173`)
   - **Backend API**: `http://localhost:8000/api/`
   - **OpenAPI Swagger Docs**: `http://localhost:8000/api/docs/`
   - **Django Admin**: `http://localhost:8000/admin/`

---

### Running Natively Without Docker

#### Backend (`api/`)
```bash
cd api
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
python manage.py migrate
python manage.py runserver 8000
```

In separate terminals:
```bash
celery -A config worker -l info
celery -A config beat -l info
```

#### Frontend (`app/`)
```bash
cd app
npm install
npm run dev
```
Vite automatically proxies `/api` calls to `http://localhost:8000`.
