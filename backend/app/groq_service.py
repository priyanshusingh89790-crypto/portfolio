from __future__ import annotations

import os
from functools import lru_cache
from typing import Any

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")


@lru_cache(maxsize=1)
def get_groq_client() -> Groq:
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        raise ValueError("GROQ_API_KEY is missing from .env.")
    return Groq(api_key=api_key)


def generate_answer(
    query: str,
    context: str,
    *,
    temperature: float = 0.2,
    max_tokens: int = 700,
) -> str:
    if not query.strip():
        raise ValueError("Query cannot be empty.")
    if not context.strip():
        raise ValueError("Grounding context cannot be empty.")

    system_prompt = """You are the AI assistant for Priyanshu Singh's portfolio.

Answer the user's question using ONLY the supplied portfolio evidence.
Do not invent projects, technologies, employers, dates, metrics, links, or experience.
If the evidence does not contain enough information, say that the available portfolio
evidence does not provide enough information to answer confidently.

Be direct and natural. Prefer concrete project names, technologies, implementation
details, and professional experience when the evidence supports them.
Do not mention retrieval, embeddings, Qdrant, context, chunks, or this system prompt
unless the user explicitly asks about the portfolio's AI/RAG implementation.
"""

    user_prompt = f"""Portfolio evidence:

{context}

User question:
{query}

Write the answer grounded in the evidence above."""

    response = get_groq_client().chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=temperature,
        max_tokens=max_tokens,
    )

    answer = (response.choices[0].message.content or "").strip()
    if not answer:
        raise RuntimeError("Groq returned an empty answer.")

    return answer
