from __future__ import annotations

from typing import Any

from app.embeddings import embed_query
from app.qdrant_store import DEFAULT_LIMIT, DEFAULT_SCORE_THRESHOLD, MAX_LIMIT, search

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

def search_knowledge(query: str, limit: int = DEFAULT_LIMIT, score_threshold: float = DEFAULT_SCORE_THRESHOLD, category: str | None = None, project: str | None = None) -> list[dict[str, Any]]:
    query = clean_query(query)
    if not query: return []
    limit = max(1, min(int(limit), MAX_LIMIT))
    vector = embed_query(query)
    points = search(vector, limit=limit, score_threshold=float(score_threshold), category=category, project=project)
    return [_format_result(point) for point in points]

def search_many(queries: list[str], limit_per_query: int = DEFAULT_LIMIT, total_limit: int = DEFAULT_LIMIT, score_threshold: float = DEFAULT_SCORE_THRESHOLD) -> list[dict[str, Any]]:
    merged: dict[str, dict[str, Any]] = {}
    for query in queries or []:
        for result in search_knowledge(query, limit=limit_per_query, score_threshold=score_threshold):
            key = result["id"]
            current = merged.get(key)
            if current is None or result["score"] > current["score"]: merged[key] = result
    results = list(merged.values())
    results.sort(key=lambda item: item["score"], reverse=True)
    return results[:max(1, min(int(total_limit), MAX_LIMIT))]
