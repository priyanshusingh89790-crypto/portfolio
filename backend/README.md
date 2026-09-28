# Priyanshu Portfolio AI Backend

## Current RAG architecture

```
portfolio_knowledge.md
        ↓
recursive chunking + overlap
        ↓
metadata / categories
        ↓
Sentence Transformers embeddings
        ↓
Qdrant
        ↓
query embedding
        ↓
semantic similarity search
        ↓
top-K evidence chunks
```

The RAG foundation is intentionally separate from Groq. First prove that chunking,
embeddings, Qdrant upsert, and semantic retrieval return the right evidence. The
chat orchestration can consume this retrieval layer after retrieval quality is verified.

## Setup

Create a Python environment and install dependencies:

```bash
python3 -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
```

Set Qdrant connection variables in `.env`:

```env
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
QDRANT_COLLECTION=portfolio_knowledge
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

For Qdrant Cloud, use the cluster URL and API key instead. Qdrant's Python client
supports point upsert and vector search against a Qdrant endpoint. citeturn0search0turn0search4

## Ingest the knowledge base

From `backend/`:

```bash
python -m app.ingest
```

This will:

1. Read `data/portfolio_knowledge.md`.
2. Split it recursively with overlap while preserving heading context.
3. Attach category, subcategory, project, content type, and source metadata.
4. Generate document embeddings with `all-MiniLM-L6-v2`.
5. Create the Qdrant collection if needed.
6. Upsert the points using stable IDs.

Qdrant upsert inserts a point when the ID is new and updates/replaces the point when
the same ID already exists. citeturn0search0

## Test retrieval

```bash
python test_rag.py
```

The test embeds each question and prints the top semantic matches, their scores,
metadata, and content. No Groq answer generation is involved yet.

## Environment

Do not commit `.env` or Qdrant credentials. The repository's `.gitignore` already
ignores the backend environment file.

## Next stage

Once retrieval is consistently returning the correct evidence:

```
Qdrant retrieval
      ↓
Groq grounded answer generation
      ↓
validated project/source metadata
      ↓
portfolio AI UI
```

Qdrant supports cosine similarity collections and payload metadata, so metadata
filtering can be added later without introducing PostgreSQL/Supabase into the RAG layer.
citeturn0search4
