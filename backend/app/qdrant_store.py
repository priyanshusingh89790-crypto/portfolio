from __future__ import annotations

import os
import uuid
from typing import Any

from dotenv import load_dotenv
from qdrant_client import QdrantClient, models

load_dotenv()

QDRANT_URL = os.getenv("QDRANT_URL", "").strip()
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "").strip() or None
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "portfolio_knowledge")
DEFAULT_SCORE_THRESHOLD = 0.2
DEFAULT_LIMIT = 5
MAX_LIMIT = 5

if not QDRANT_URL:
    raise ValueError("QDRANT_URL is missing from .env. Use http://localhost:6333 for local Qdrant or your Qdrant Cloud URL.")

client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY, timeout=60)

def point_id_for(chunk_key: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_URL, chunk_key))

def ensure_collection(vector_size: int) -> None:
    if client.collection_exists(QDRANT_COLLECTION): return
    client.create_collection(
        collection_name=QDRANT_COLLECTION,
        vectors_config=models.VectorParams(size=vector_size, distance=models.Distance.COSINE),
    )

def upsert_chunks(chunks: list[dict[str, Any]], vectors: list[list[float]]) -> int:
    if len(chunks) != len(vectors): raise ValueError("chunks and vectors must have the same length")
    if not chunks: return 0
    ensure_collection(len(vectors[0]))
    points = []
    for chunk, vector in zip(chunks, vectors):
        payload = {
            "chunk_key": chunk["chunk_key"],
            "content": chunk["content"],
            "category": chunk["category"],
            "subcategory": chunk["subcategory"],
            "project": chunk.get("project"),
            "technologies": chunk.get("technologies", []),
            "content_type": chunk["content_type"],
            "source": chunk.get("source", "portfolio_knowledge.md"),
            "section": chunk["section"],
            "heading_path": chunk["heading_path"],
            "chunk_index": chunk["chunk_index"],
        }
        points.append(models.PointStruct(id=point_id_for(chunk["chunk_key"]), vector=vector, payload=payload))
    client.upsert(collection_name=QDRANT_COLLECTION, points=points, wait=True)
    return len(points)

def search(query_vector: list[float], limit: int = DEFAULT_LIMIT, score_threshold: float = DEFAULT_SCORE_THRESHOLD, category: str | None = None, project: str | None = None):
    limit = max(1, min(int(limit), MAX_LIMIT))
    must = []
    if category:
        must.append(models.FieldCondition(key="category", match=models.MatchValue(value=category)))
    if project:
        must.append(models.FieldCondition(key="project", match=models.MatchValue(value=project)))
    query_filter = models.Filter(must=must) if must else None
    response = client.query_points(
        collection_name=QDRANT_COLLECTION,
        query=query_vector,
        query_filter=query_filter,
        limit=limit,
        score_threshold=score_threshold,
        with_payload=True,
    )
    return response.points

def collection_info() -> dict[str, Any]:
    info = client.get_collection(QDRANT_COLLECTION)
    return {
        "collection": QDRANT_COLLECTION,
        "points_count": getattr(info, "points_count", None),
        "vectors_count": getattr(info, "vectors_count", None),
        "status": str(getattr(info, "status", "")),
    }
