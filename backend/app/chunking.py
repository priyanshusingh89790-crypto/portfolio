from __future__ import annotations

import re
from dataclasses import dataclass


DEFAULT_CHUNK_SIZE = 2800
DEFAULT_CHUNK_OVERLAP = 350

SEPARATORS = ["\n\n", "\n", ". ", " ", ""]


@dataclass
class KnowledgeChunk:
    chunk_key: str
    content: str
    section: str
    heading_path: list[str]
    chunk_index: int
    category: str
    subcategory: str
    content_type: str


def _clean(text: str) -> str:
    return re.sub(r"\n{3,}", "\n\n", text.strip())


def _category_for_heading(heading_path: list[str]) -> tuple[str, str]:
    value = " ".join(heading_path).lower()

    if any(word in value for word in ("skill", "technology", "engineering profile")):
        if "frontend" in value:
            return "skill", "frontend"
        if any(word in value for word in ("backend", "node", "express", "api")):
            return "skill", "backend"
        if any(word in value for word in ("ai", "genai", "rag", "llm", "machine learning")):
            return "ai", "genai"
        if any(word in value for word in ("data", "database", "mongodb", "postgres", "sql")):
            return "skill", "data"
        return "skill", "general"

    if "project" in value:
        if any(word in value for word in ("rag", "ai workspace", "trading", "gemini", "ai ")):
            return "project", "ai"
        if any(word in value for word in ("crm", "inventory", "social", "mail", "pagination")):
            return "project", "application"
        return "project", "general"

    if any(word in value for word in ("experience", "internship", "work")):
        return "experience", "professional"

    if "education" in value:
        return "education", "academic"

    if any(word in value for word in ("profile", "about", "primary direction")):
        return "profile", "general"

    if any(word in value for word in ("assistant", "operating rules", "grounding")):
        return "ai", "grounding"

    return "general", "general"


def _content_type(text: str, heading_path: list[str]) -> str:
    value = (" ".join(heading_path) + " " + text[:500]).lower()

    if any(word in value for word in ("implementation", "implemented", "architecture", "source code")):
        return "implementation"
    if any(word in value for word in ("technology", "stack", "skills", "verified")):
        return "technology"
    if any(word in value for word in ("feature", "functionality", "behavior")):
        return "feature"
    if any(word in value for word in ("experience", "role", "responsibil")):
        return "experience"
    if any(word in value for word in ("overview", "profile", "direction")):
        return "overview"
    return "general"


def _recursive_split(
    text: str,
    chunk_size: int,
    overlap: int,
    separators: list[str] | None = None,
) -> list[str]:
    text = _clean(text)
    if not text:
        return []

    if chunk_size <= overlap:
        raise ValueError("chunk_size must be greater than chunk_overlap")

    separators = separators or SEPARATORS
    if len(text) <= chunk_size:
        return [text]

    separator = next((item for item in separators if item and item in text), "")

    if separator:
        pieces = [piece.strip() for piece in text.split(separator) if piece.strip()]
    else:
        pieces = [text[i : i + chunk_size] for i in range(0, len(text), chunk_size)]

    if len(pieces) <= 1:
        return [
            text[i : i + chunk_size]
            for i in range(0, len(text), chunk_size - overlap)
        ]

    chunks: list[str] = []
    current = ""

    for piece in pieces:
        candidate = piece if not current else f"{current}{separator}{piece}"

        if len(candidate) <= chunk_size:
            current = candidate
            continue

        if current:
            chunks.append(_clean(current))

        overlap_text = current[-overlap:] if current else ""
        current = f"{overlap_text}{separator}{piece}".strip()

        if len(current) > chunk_size:
            nested = _recursive_split(
                current,
                chunk_size=chunk_size,
                overlap=overlap,
                separators=separators[1:] if len(separators) > 1 else [""],
            )
            if nested:
                chunks.extend(nested[:-1])
                current = nested[-1]

    if current:
        chunks.append(_clean(current))

    result: list[str] = []
    for chunk in chunks:
        if chunk and (not result or chunk != result[-1]):
            result.append(chunk)

    return result


def _parse_markdown_sections(markdown: str) -> list[tuple[list[str], str]]:
    lines = markdown.splitlines()
    sections: list[tuple[list[str], str]] = []
    headings: list[str] = []
    body: list[str] = []

    def flush() -> None:
        if body:
            content = "\n".join(body).strip()
            if content:
                sections.append((headings.copy(), content))

    for line in lines:
        match = re.match(r"^(#{1,6})\s+(.+?)\s*$", line)
        if match:
            flush()
            body.clear()

            level = len(match.group(1))
            title = match.group(2).strip()

            headings[:] = headings[: level - 1]
            headings.append(title)
            body.append(f"{match.group(1)} {title}")
        else:
            body.append(line)

    flush()
    return sections


def chunk_markdown(
    markdown: str,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> list[KnowledgeChunk]:
    sections = _parse_markdown_sections(markdown)
    chunks: list[KnowledgeChunk] = []

    for section_index, (heading_path, section_content) in enumerate(sections):
        section_content = _clean(section_content)

        if len(section_content) < 80:
            continue

        section_title = heading_path[-1] if heading_path else "Document"
        category, subcategory = _category_for_heading(heading_path)
        content_type = _content_type(section_content, heading_path)

        parts = _recursive_split(
            section_content,
            chunk_size=chunk_size,
            overlap=overlap,
        )

        for local_index, content in enumerate(parts):
            chunk_key = (
                f"portfolio_knowledge:{section_index}:"
                f"{local_index}:{section_title.lower().replace(' ', '-')}"
            )

            chunks.append(
                KnowledgeChunk(
                    chunk_key=chunk_key,
                    content=content,
                    section=section_title,
                    heading_path=heading_path,
                    chunk_index=local_index,
                    category=category,
                    subcategory=subcategory,
                    content_type=content_type,
                )
            )

    return chunks
