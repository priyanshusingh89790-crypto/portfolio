from __future__ import annotations

import re
from typing import Any

from app.embeddings import embed_query
from app.qdrant_store import DEFAULT_LIMIT, DEFAULT_SCORE_THRESHOLD, MAX_LIMIT, search


STOPWORDS = {
    "a", "an", "and", "are", "at", "did", "do", "does", "for", "from",
    "has", "have", "he", "how", "in", "is", "of", "on", "the", "to",
    "what", "when", "where", "which", "who", "with", "work", "worked",
}


def clean_query(query: str) -> str:
    return " ".join(str(query or "").strip().split())


def _format_result(point: Any) -> dict[str, Any]:
    payload = dict(point.payload or {})
    return {
        "id": str(point.id),
        "score": float(point.score),
        "rank": float(point.score),
        "content": payload.get("content", ""),
        "source_type": "knowledge",
        "source_title": payload.get("section", ""),
        "metadata": {
            "project": payload.get("project"),
            "category": payload.get("category"),
            "subcategory": payload.get("subcategory"),
            "content_type": payload.get("content_type"),
            "technologies": payload.get("technologies", []),
            "section": payload.get("section"),
            "heading_path": payload.get("heading_path", []),
            "chunk_key": payload.get("chunk_key"),
        },
        "source": payload.get("source"),
    }


def _query_terms(query: str) -> list[str]:
    """Extract useful entity/keyword terms for a lexical ranking boost."""
    terms = re.findall(r"[A-Za-z][A-Za-z0-9+#.-]{1,}", query)
    return [
        term
        for term in terms
        if term.lower() not in STOPWORDS and len(term) >= 2
    ]


def _lexical_match_score(result: dict[str, Any], terms: list[str]) -> float:
    """Return a small ranking boost when query terms occur in the evidence."""
    if not terms:
        return 0.0

    metadata = result.get("metadata") or {}
    searchable = " ".join(
        [
            str(result.get("content") or ""),
            str(result.get("source_title") or ""),
            str(metadata.get("project") or ""),
            str(metadata.get("section") or ""),
            " ".join(
                str(item) for item in metadata.get("technologies", []) or []
            ),
        ]
    ).lower()

    matches = sum(1 for term in terms if term.lower() in searchable)
    return min(0.20, matches * 0.08)


def _hybrid_search(
    query: str,
    *,
    limit: int,
    score_threshold: float,
    category: str | None,
    project: str | None,
) -> list[dict[str, Any]]:
    """One semantic query against Qdrant plus a lightweight lexical boost."""
    vector = embed_query(query)

    points = search(
        vector,
        limit=limit,
        score_threshold=float(score_threshold),
        category=category,
        project=project,
    )

    terms = _query_terms(query)

    ranked: list[dict[str, Any]] = []

    for point in points:
        result = _format_result(point)
        lexical_boost = _lexical_match_score(result, terms)
        semantic_score = float(result["score"])

        result["rank"] = semantic_score + lexical_boost
        result["lexical_boost"] = lexical_boost
        ranked.append(result)

    ranked.sort(key=lambda item: item["rank"], reverse=True)
    return ranked[:limit]


def search_knowledge(
    query: str,
    limit: int = DEFAULT_LIMIT,
    score_threshold: float = DEFAULT_SCORE_THRESHOLD,
    category: str | None = None,
    project: str | None = None,
) -> list[dict[str, Any]]:
    query = clean_query(query)
    if not query:
        return []

    limit = max(1, min(int(limit), MAX_LIMIT))

    return _hybrid_search(
        query,
        limit=limit,
        score_threshold=score_threshold,
        category=category,
        project=project,
    )


def search_many(
    queries: list[str],
    limit_per_query: int = DEFAULT_LIMIT,
    total_limit: int = DEFAULT_LIMIT,
    score_threshold: float = DEFAULT_SCORE_THRESHOLD,
) -> list[dict[str, Any]]:
    merged: dict[str, dict[str, Any]] = {}

    for query in queries or []:
        for result in search_knowledge(
            query,
            limit=limit_per_query,
            score_threshold=score_threshold,
        ):
            key = result["id"]
            current = merged.get(key)
            if current is None or result["rank"] > current["rank"]:
                merged[key] = result

    results = list(merged.values())
    results.sort(key=lambda item: item["rank"], reverse=True)

    return results[:max(1, min(int(total_limit), MAX_LIMIT))]
