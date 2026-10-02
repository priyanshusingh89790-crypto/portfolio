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
    if not texts:
        return []

    model = get_embedding_model()
    return [vector.tolist() for vector in model.embed(texts)]


def embed_query(text: str) -> list[float]:
    model = get_embedding_model()
    vector = next(model.query_embed(text))
    return vector.tolist()


def embedding_dimension() -> int:
    model = get_embedding_model()
    vector = next(model.query_embed("dimension check"))
    return len(vector)
