from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from pypdf import PdfReader

from app.chunking import chunk_markdown
from app.embeddings import embed_documents
from app.qdrant_store import ensure_collection, upsert_chunks

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
KNOWLEDGE_FILE = DATA_DIR / "portfolio_knowledge.md"
RESUME_FILE = DATA_DIR / "Priyanshu_Singh_Resume.pdf"

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

def detect_project(text: str) -> str | None:
    normalized = " ".join(text.lower().split())
    for project, keywords in PROJECT_KEYWORDS.items():
        if any(keyword in normalized for keyword in keywords): return project
    return None

def clean_heading(value: str) -> str:
    return re.sub(r"^\d+(?:\.\d+)*[.)]?\s*", "", value).strip()

def load_portfolio_markdown() -> str:
    if not KNOWLEDGE_FILE.exists(): raise FileNotFoundError(f"Knowledge file not found: {KNOWLEDGE_FILE}")
    return KNOWLEDGE_FILE.read_text(encoding="utf-8")

def load_resume_as_markdown() -> str:
    if not RESUME_FILE.exists(): raise FileNotFoundError(f"Resume file not found: {RESUME_FILE}")
    reader = PdfReader(str(RESUME_FILE))
    pages = []
    for page_number, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").strip()
        if text: pages.append(f"## Resume Page {page_number}\n\n{text}")
    if not pages: raise RuntimeError("No text could be extracted from the resume PDF.")
    return "# Priyanshu Singh — Resume\n\n" + "\n\n".join(pages)

def prepare_chunks(markdown: str, source_name: str, source_id: str) -> list[dict[str, Any]]:
    raw_chunks = chunk_markdown(markdown)
    prepared = []
    for chunk in raw_chunks:
        project = detect_project(" ".join(chunk.heading_path) + " " + chunk.content)
        prepared.append({
            "chunk_key": f"{source_id}:{chunk.chunk_key.split(':', 1)[1]}" if ":" in chunk.chunk_key else f"{source_id}:{chunk.chunk_key}",
            "content": chunk.content,
            "section": clean_heading(chunk.section),
            "heading_path": [clean_heading(x) for x in chunk.heading_path],
            "chunk_index": chunk.chunk_index,
            "category": chunk.category,
            "subcategory": chunk.subcategory,
            "content_type": chunk.content_type,
            "project": project,
            "technologies": [],
            "source": source_name,
        })
    return prepared

def main() -> None:
    print("\n🚀 Starting Qdrant portfolio ingestion...\n")
    portfolio_markdown = load_portfolio_markdown()
    resume_markdown = load_resume_as_markdown()
    portfolio_chunks = prepare_chunks(portfolio_markdown, KNOWLEDGE_FILE.name, "portfolio_knowledge")
    resume_chunks = prepare_chunks(resume_markdown, RESUME_FILE.name, "resume_knowledge")
    chunks = portfolio_chunks + resume_chunks
    if not chunks: raise RuntimeError("No knowledge chunks were created.")
    print(f"📄 Portfolio characters: {len(portfolio_markdown):,}")
    print(f"📄 Resume characters:    {len(resume_markdown):,}")
    print(f"🧩 Portfolio chunks:     {len(portfolio_chunks)}")
    print(f"🧩 Resume chunks:        {len(resume_chunks)}")
    print("   Chunk size: 2800 characters")
    print("   Overlap: 350 characters")
    print("\n🧠 Generating embeddings...")
    vectors = embed_documents([chunk["content"] for chunk in chunks])
    if not vectors: raise RuntimeError("No embeddings were generated.")
    print(f"   Embeddings: {len(vectors)}")
    print(f"   Vector dimension: {len(vectors[0])}")
    ensure_collection(len(vectors[0]))
    print("\n📌 Upserting into Qdrant...")
    count = upsert_chunks(chunks, vectors)
    print(f"   Points upserted: {count}")
    print("\n✅ Ingestion completed.")
    print("   Sources: portfolio_knowledge.md + Priyanshu_Singh_Resume.pdf")
    print("   Run: python test_rag.py\n")

if __name__ == "__main__":
    main()
