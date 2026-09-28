# Portfolio RAG Backend

This backend is currently focused **only on the RAG foundation**.

## Architecture

```
portfolio_knowledge.md
        ↓
recursive chunking + overlap
        ↓
chunk metadata
        ↓
Sentence Transformers embeddings
        ↓
Qdrant vector database
        ↓
query embedding
        ↓
cosine similarity search
        ↓
top-K evidence chunks
```

There is intentionally no chat orchestration, LLM answer generation, PostgreSQL,
Supabase, or application-specific API layer in the current RAG foundation.

## Knowledge source

The primary knowledge source is:

```
data/portfolio_knowledge.md
```

It is converted into meaningful overlapping chunks while preserving heading context
and category metadata.

## Embeddings

Default model:

```
sentence-transformers/all-MiniLM-L6-v2
```

The current embedding size is 384 dimensions.

Document chunks use `encode_document()` and user queries use `encode_query()`,
with normalized embeddings for cosine similarity.

## Vector database

Qdrant stores:

- vector embeddings
- chunk content
- category
- subcategory
- project
- technologies
- content type
- source
- section
- heading path
- stable chunk key

The point ID is deterministic, so re-running ingestion upserts the same knowledge
chunks instead of creating duplicates.

## Environment

Create `backend/.env` locally:

```env
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
QDRANT_COLLECTION=portfolio_knowledge
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

For Qdrant Cloud, replace `QDRANT_URL` with the cluster endpoint and provide
`QDRANT_API_KEY`.

Never commit `.env` or Qdrant credentials.

## Install

```bash
python3 -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
```

## Ingest

From `backend/`:

```bash
python -m app.ingest
```

The ingestion process:

1. Reads the knowledge markdown.
2. Recursively chunks it with overlap.
3. Extracts metadata.
4. Generates embeddings.
5. Creates the Qdrant collection when needed.
6. Upserts the vectors and payloads.

## Test retrieval

After ingestion:

```bash
python test_rag.py
```

The retrieval test runs semantic queries and prints the matched chunks, scores,
projects, categories, and content.

## Current goal

Do not add Groq, reranking, agents, streaming, or UI actions yet.

First verify that semantic retrieval consistently returns the correct evidence for
different kinds of questions. Once retrieval quality is proven, the next layer can
be added on top of this stable foundation.
