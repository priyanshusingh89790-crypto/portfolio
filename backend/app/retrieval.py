from __future__ import annotations

from typing import Any

from app.embeddings import embed_query
from app.qdrant_store import search


def clean_query(query: str) -> str:
    return " ".join(str(query or "").strip().split())


def _format_result(point: Any) -> dict[str, Any]:
    payload = dict(point.payload or {})

    return {
        "id": str(point.id),
        "score": float(point.score),
        "rank": float(point.score),
        "content": payload.get("content", ""),
        "source_type": "portfolio_knowledge",
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


def search_knowledge(
    query: str,
    limit: int = 5,
    category: str | None = None,
    project: str | None = None,
) -> list[dict[str, Any]]:
    query = clean_query(query)
    if not query:
        return []

    vector = embed_query(query)
    points = search(
        vector,
        limit=limit,
        category=category,
        project=project,
    )
    return [_format_result(point) for point in points]


def search_many(
    queries: list[str],
    limit_per_query: int = 5,
    total_limit: int = 12,
) -> list[dict[str, Any]]:
    merged: dict[str, dict[str, Any]] = {}

    for query in queries or []:
        for result in search_knowledge(query, limit=limit_per_query):
            key = result["id"]
            current = merged.get(key)
            if current is None or result["score"] > current["score"]:
                merged[key] = result

    results = list(merged.values())
    results.sort(key=lambda item: item["score"], reverse=True)
    return results[:total_limit]
