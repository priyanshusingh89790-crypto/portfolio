from __future__ import annotations

import os
from functools import lru_cache

from fastembed import TextEmbedding


EMBEDDING_MODEL_NAME = os.getenv(
    "EMBEDDING_MODEL",
    "sentence-transformers/all-MiniLM-L6-v2",
)


@lru_cache(maxsize=1)
def get_embedding_model() -> TextEmbedding:
    return TextEmbedding(model_name=EMBEDDING_MODEL_NAME)


def embed_documents(texts: list[str]) -> list[list[float]]:
    """Embed document/passages for ingestion using the same 384D model."""
    if not texts:
        return []

    model = get_embedding_model()
    vectors = model.passage_embed(texts)

    return [vector.tolist() for vector in vectors]


def embed_query(text: str) -> list[float]:
    """Embed one user query using the same model used for the Qdrant collection."""
    model = get_embedding_model()
    vector = next(model.query_embed([text]))

    return vector.tolist()


def embedding_dimension() -> int:
    return 384
