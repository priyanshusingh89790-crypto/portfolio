from __future__ import annotations

import os
from functools import lru_cache

from sentence_transformers import SentenceTransformer


EMBEDDING_MODEL_NAME = os.getenv(
    "EMBEDDING_MODEL",
    "sentence-transformers/all-MiniLM-L6-v2",
)


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    return SentenceTransformer(EMBEDDING_MODEL_NAME)


def embed_documents(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []

    model = get_embedding_model()
    vectors = model.encode_document(
        texts,
        normalize_embeddings=True,
        show_progress_bar=False,
    )
    return [vector.tolist() for vector in vectors]


def embed_query(text: str) -> list[float]:
    model = get_embedding_model()
    vector = model.encode_query(
        text,
        normalize_embeddings=True,
        show_progress_bar=False,
    )
    return vector.tolist()


def embedding_dimension() -> int:
    return int(get_embedding_model().get_sentence_embedding_dimension())
