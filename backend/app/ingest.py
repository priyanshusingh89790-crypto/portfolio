from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

from app.chunking import chunk_markdown
from app.embeddings import embed_documents
from app.qdrant_store import ensure_collection, upsert_chunks


load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
KNOWLEDGE_FILE = DATA_DIR / "portfolio_knowledge.md"

PROJECT_KEYWORDS = {
    "Netflix GPT": ["netflix gpt", "netflix-ai", "netflix ai"],
    "Inventory Management System": ["inventory management system", "inventory"],
    "Sales CRM": ["sales crm", "crm"],
    "SocialPost": ["socialpost", "social post"],
    "AI Safety SOS": ["ai safety sos", "ai safety"],
    "Mail Inbox": ["mail inbox"],
    "Brand Project": ["brand project"],
    "PrimeReactPagination": ["primereactpagination"],
    "AI Trading Research": ["ai trading research"],
    "Dev Meetup": ["dev meetup", "devmeetup"],
    "Personal Portfolio": ["personal portfolio", "portfolio"],
    "AI Workspace": ["ai workspace"],
    "AI Integration": ["ai integration"],
    "AI Recruiter": ["ai recruiter"],
}


def load_markdown() -> str:
    if not KNOWLEDGE_FILE.exists():
        raise FileNotFoundError(f"Knowledge file not found: {KNOWLEDGE_FILE}")
    return KNOWLEDGE_FILE.read_text(encoding="utf-8")


def detect_project(text: str) -> str | None:
    normalized = " ".join(text.lower().split())
    for project, keywords in PROJECT_KEYWORDS.items():
        if any(keyword in normalized for keyword in keywords):
            return project
    return None


def clean_heading(value: str) -> str:
    return re.sub(r"^\d+(?:\.\d+)*[.)]?\s*", "", value).strip()


def prepare_chunks(markdown: str) -> list[dict[str, Any]]:
    raw_chunks = chunk_markdown(markdown)
    prepared = []

    for chunk in raw_chunks:
        project = detect_project(
            " ".join(chunk.heading_path) + " " + chunk.content
        )

        prepared.append(
            {
                "chunk_key": chunk.chunk_key,
                "content": chunk.content,
                "section": clean_heading(chunk.section),
                "heading_path": [clean_heading(x) for x in chunk.heading_path],
                "chunk_index": chunk.chunk_index,
                "category": chunk.category,
                "subcategory": chunk.subcategory,
                "content_type": chunk.content_type,
                "project": project,
                "technologies": [],
                "source": KNOWLEDGE_FILE.name,
            }
        )

    return prepared


def main() -> None:
    print("\n🚀 Starting Qdrant portfolio ingestion...\n")

    markdown = load_markdown()
    chunks = prepare_chunks(markdown)

    if not chunks:
        raise RuntimeError("No knowledge chunks were created.")

    print(f"📄 Characters: {len(markdown):,}")
    print(f"🧩 Recursive chunks: {len(chunks)}")
    print("   Chunk size: 2800 characters")
    print("   Overlap: 350 characters")

    print("\n🧠 Generating embeddings...")
    vectors = embed_documents([chunk["content"] for chunk in chunks])

    if not vectors:
        raise RuntimeError("No embeddings were generated.")

    print(f"   Embeddings: {len(vectors)}")
    print(f"   Vector dimension: {len(vectors[0])}")

    ensure_collection(len(vectors[0]))

    print("\n📌 Upserting into Qdrant...")
    count = upsert_chunks(chunks, vectors)
    print(f"   Points upserted: {count}")

    print("\n✅ Ingestion completed.")
    print("   Run: python test_rag.py\n")


if __name__ == "__main__":
    main()
