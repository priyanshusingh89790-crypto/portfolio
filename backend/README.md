# Priyanshu Portfolio AI Backend

## Architecture

User question -> Groq understands question against resume/profile ->
if resume is sufficient, Groq answers directly -> otherwise Groq produces
semantic retrieval queries -> FastAPI retrieves evidence from Supabase ->
Groq reads resume + evidence and generates the final grounded answer.

FastAPI is a data/evidence layer. It does not hard-code portfolio answers.

## Setup

```bash
python3 -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Set `GROQ_API_KEY`, `SUPABASE_URL`, and `SUPABASE_KEY` in `.env`.

Run `sql/001_portfolio_search.sql` in Supabase before ingestion.
Then run:

```bash
python -m app.ingest
```

## Endpoints

- `GET /api/health`
- `POST /api/chat` — structured JSON response
- `POST /api/chat/stream` — SSE token stream
- `POST /api/analyze-jd` — JD analysis workflow

## Chat behavior

Normal questions are answered from the resume/profile without a database search.
Deep implementation questions trigger semantic evidence retrieval. Project source
URLs are resolved and validated server-side; the model cannot invent GitHub URLs.
