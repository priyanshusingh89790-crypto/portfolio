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
KNOWLEDGE_FILE = DATA_DIR / "portfolio_knowledge.txt"
RESUME_FILE = DATA_DIR / "Priyanshu_Singh_Resume.pdf"


# Resolve projects from explicit Markdown headings first. Avoid generic terms
# such as "AI", "portfolio", "CRM", and "inventory" because they occur across
# many unrelated sections and cause incorrect project metadata.
PROJECT_ALIASES = {
    "Netflix GPT": ["netflix gpt", "netflix-ai", "netflix ai"],
    "Inventory Management System": ["inventory management system"],
    "Sales CRM": ["sales crm"],
    "SocialPost": ["socialpost", "social post", "3w social post app"],
    "AI Safety SOS": ["ai safety sos", "ai-safety-sos"],
    "Mail Inbox": ["mail inbox", "mail-inbox-task"],
    "Brand Project": ["brand project", "brand-project"],
    "PrimeReactPagination": ["primereactpagination"],
    "AI Trading Research": ["ai trading research", "ai-trading-research"],
    "Dev Meetup": ["dev meetup", "devmeetup"],
    "Personal Portfolio": ["personal portfolio"],
    "AI Workspace": ["ai workspace", "ai-workspace"],
    "AI Integration": ["ai integration", "ai-integration"],
    "AI Recruiter": ["ai recruiter", "ai-recruiter"],
    "ArchScale Voice Assistant": [
        "archscale voice assistant",
        "archscale-voice_assistant",
    ],
    "CineGraph": ["cinegraph", "cinegrapgh"],
}

NON_PROJECT_SECTION_MARKERS = (
    "ai assistant operating rules",
    "how to answer common questions",
    "important limitations",
    "source evidence map",
    "final ai instruction",
    "github repository links",
)


def _normalize(value: str) -> str:
    return " ".join(value.lower().replace("_", " ").replace("-", " ").split())


def _heading_project(heading_path: list[str]) -> str | None:
    normalized_headings = [_normalize(value) for value in heading_path]

    # Longest aliases first so specific names win over shorter aliases.
    aliases = [
        (len(_normalize(alias)), project, _normalize(alias))
        for project, values in PROJECT_ALIASES.items()
        for alias in values
    ]

    for _, project, alias in sorted(aliases, reverse=True):
        if any(alias == heading or alias in heading for heading in normalized_headings):
            return project

    return None


def _content_project(heading_path: list[str], content: str) -> str | None:
    # Policy/instruction sections are not project evidence. Do not assign a
    # project merely because the policy text mentions project names.
    normalized_headings = [_normalize(value) for value in heading_path]
    heading_text = " ".join(normalized_headings)
    if any(marker in heading_text for marker in NON_PROJECT_SECTION_MARKERS):
        return None

    normalized_content = _normalize(content)
    matches: list[tuple[int, str]] = []

    for project, aliases in PROJECT_ALIASES.items():
        for alias in aliases:
            normalized_alias = _normalize(alias)
            if normalized_alias in normalized_content:
                matches.append((len(normalized_alias), project))
                break

    # A chunk mentioning several projects is intentionally left unassigned.
    # This is safer than assigning it to whichever project appears first.
    projects = {project for _, project in matches}
    if len(projects) != 1:
        return None

    return max(matches)[1]


def detect_project(heading_path: list[str], content: str) -> str | None:
    return _heading_project(heading_path) or _content_project(heading_path, content)


def clean_heading(value: str) -> str:
    return re.sub(r"^\d+(?:\.\d+)*[.)]?\s*", "", value).strip()


EVIDENCE_SECTION_START = 2
EVIDENCE_SECTION_END = 15
EXCLUDED_EVIDENCE_SECTIONS = {14}


def _structured_text_to_markdown(text: str) -> str:
    """Convert the structured TXT source into a retrieval-oriented Markdown view.

    Only numbered evidence sections 2-15 are embedded. Assistant instructions,
    common-answer guidance, limitations, source maps and repository-link lists
    are intentionally excluded because they are retrieval policy/meta-data, not
    portfolio evidence.
    """
    lines = text.splitlines()
    output: list[str] = []
    current_section: int | None = None
    include = False

    section_pattern = re.compile(r"^(\d+)\.\s+(.+?)\s*$")

    for line in lines:
        match = section_pattern.match(line.strip())
        if match:
            current_section = int(match.group(1))
            include = (
                EVIDENCE_SECTION_START <= current_section <= EVIDENCE_SECTION_END
                and current_section not in EXCLUDED_EVIDENCE_SECTIONS
            )
            if include:
                output.append(f"# {match.group(1)}. {match.group(2).strip()}")
            continue

        if include:
            output.append(line)

    if not output:
        raise RuntimeError(
            "No evidence sections were found in the structured portfolio knowledge source."
        )

    return "\n".join(output).strip() + "\n"


def load_portfolio_markdown() -> str:
    if not KNOWLEDGE_FILE.exists():
        raise FileNotFoundError(f"Knowledge file not found: {KNOWLEDGE_FILE}")

    structured_text = KNOWLEDGE_FILE.read_text(encoding="utf-8")
    return _structured_text_to_markdown(structured_text)


def load_resume_as_markdown() -> str | None:
    """Load resume evidence when the PDF is valid; otherwise skip it safely."""
    if not RESUME_FILE.exists():
        print(f"⚠️ Resume file not found; continuing without resume: {RESUME_FILE}")
        return None
    try:
        reader = PdfReader(str(RESUME_FILE))
        pages = []
        for page_number, page in enumerate(reader.pages, start=1):
            text = (page.extract_text() or "").strip()
            if text:
                pages.append(f"## Resume Page {page_number}\n\n{text}")
        if not pages:
            print("⚠️ Resume PDF contains no extractable text; continuing without resume.")
            return None
        return "# Priyanshu Singh — Resume\n\n" + "\n\n".join(pages)
    except Exception as exc:
        print(f"⚠️ Resume could not be parsed ({exc}); continuing with portfolio knowledge only.")
        return None


def prepare_chunks(markdown: str, source_name: str, source_id: str) -> list[dict[str, Any]]:
    raw_chunks = chunk_markdown(markdown)
    prepared = []

    for chunk in raw_chunks:
        heading_path = [clean_heading(value) for value in chunk.heading_path]
        section = clean_heading(chunk.section)
        project = detect_project(heading_path, chunk.content)

        prepared.append(
            {
                "chunk_key": (
                    f"{source_id}:{chunk.chunk_key.split(':', 1)[1]}"
                    if ":" in chunk.chunk_key
                    else f"{source_id}:{chunk.chunk_key}"
                ),
                "content": chunk.content,
                "section": section,
                "heading_path": heading_path,
                "chunk_index": chunk.chunk_index,
                "category": chunk.category,
                "subcategory": chunk.subcategory,
                "content_type": chunk.content_type,
                "project": project,
                "technologies": [],
                "source": source_name,
            }
        )

    return prepared


def main() -> None:
    print("\n🚀 Starting Qdrant portfolio ingestion...\n")

    portfolio_markdown = load_portfolio_markdown()
    resume_markdown = load_resume_as_markdown()

    portfolio_chunks = prepare_chunks(
        portfolio_markdown, KNOWLEDGE_FILE.name, "portfolio_knowledge"
    )
    resume_chunks = prepare_chunks(
        resume_markdown, RESUME_FILE.name, "resume_knowledge"
    )

    chunks = portfolio_chunks + resume_chunks
    if not chunks:
        raise RuntimeError("No knowledge chunks were created.")

    print(f"📄 Portfolio characters: {len(portfolio_markdown):,}")
    print(f"📄 Resume characters:    {len(resume_markdown):,}")
    print(f"🧩 Portfolio chunks:     {len(portfolio_chunks)}")
    print(f"🧩 Resume chunks:        {len(resume_chunks)}")
    print("   Chunk size: 800 characters")
    print("   Overlap: 150 characters")

    project_counts: dict[str, int] = {}
    for chunk in chunks:
        project = chunk["project"] or "Unassigned"
        project_counts[project] = project_counts.get(project, 0) + 1

    print("\n🏷️ Project metadata:")
    for project, count in sorted(project_counts.items()):
        print(f"   {project}: {count} chunks")

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
    print("   Sources: portfolio_knowledge.txt (evidence sections 2-15) + optional Priyanshu_Singh_Resume.pdf")
    print("   Run: python test_rag.py\n")


if __name__ == "__main__":
    main()
