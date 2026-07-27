# CodeMorph AI — Production FastAPI Backend with PostgreSQL

Production-ready **FastAPI** backend for **CodeMorph AI**, configured exclusively with **PostgreSQL** and **Alembic** schema migrations.

---

## 🚀 Tech Stack

- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL (SQLAlchemy 2.0 ORM + `psycopg2-binary` driver)
- **Migrations**: Alembic
- **Authentication**: JWT Access Token (Bearer header security)
- **AI Engine**: Modular AI Provider Factory (OpenAI GPT-4.1, Claude 3.5, Gemini 2.0 Pro, DeepSeek R1)

---

## 🗄️ Database Architecture & Schemas

### PostgreSQL Tables:
1. `users`: Stores user credentials (`username` unique, `email` unique, `hashed_password`, `role` enum, `free_credits_used`).
2. `subscriptions`: Manages user subscription tiers (`FREE`, `PRO_MONTHLY`, `PRO_YEARLY`, `ENTERPRISE`) and status.
3. `conversion_history`: Stores all source & target code translations, AST execution time, code size, and model used.
4. `api_usage`: Logs telemetry data for every API call, token counts, and USD cost estimation.

Indexes are configured on `username`, `email`, `role`, `created_at`, `source_language`, `target_language`, `model_used`, and foreign keys (`user_id` with `ON DELETE CASCADE`).

---

## 🛠️ Local Environment Setup & Migration Guide

### 1. Install PostgreSQL & Create Database
Ensure PostgreSQL is running locally or via Docker:
```sql
CREATE DATABASE codemorph;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE codemorph TO postgres;
```

### 2. Configure Environment (`.env`)
Copy `.env.example` to `.env` and set your PostgreSQL connection string:
```env
ENVIRONMENT=development
SECRET_KEY=codemorph-ai-super-secret-jwt-key-2026-production-ready

# PostgreSQL Connection String
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/codemorph

# AI Provider API Keys (Optional)
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
DEEPSEEK_API_KEY=
```

### 3. Install Python Dependencies
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Run Alembic Database Migrations
Run Alembic to create all PostgreSQL tables and indexes:
```bash
alembic upgrade head
```

To create new migration revisions automatically after modifying SQLAlchemy models:
```bash
alembic revision --autogenerate -m "Add new column or table"
alembic upgrade head
```

### 5. Start FastAPI Backend
```bash
uvicorn app.main:app --reload --port 8000
```

- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc API Spec**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🐳 Docker Deployment (FastAPI + PostgreSQL)

To launch the complete application stack with Docker Compose:
```bash
docker-compose up --build
```
This starts:
- `db`: PostgreSQL 15 Alpine container on port `5432` with automatic health checks.
- `backend`: FastAPI backend on port `8000` waiting for PostgreSQL readiness.

---

## 🧪 Verification & API Usage

1. **User Signup**:
   `POST /api/v1/auth/signup`
   Provide `full_name`, `username`, `email`, `password`.

2. **User Login**:
   `POST /api/v1/auth/login`
   Provide `identifier` (either username or email) and `password`. Returns JWT `access_token`.

3. **Swagger Authentication**:
   Open [http://localhost:8000/docs](http://localhost:8000/docs), click **Authorize**, enter your `access_token` in the Bearer field, and click **Authorize**.

4. **Convert Code**:
   `POST /api/v1/conversions/convert`
