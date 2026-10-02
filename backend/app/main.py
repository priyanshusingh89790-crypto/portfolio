from __future__ import annotations

from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.context_builder import build_context
from app.groq_service import generate_answer
from app.retrieval import search_knowledge


app = FastAPI(
    title="Priyanshu Portfolio AI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://portfolio-89def.web.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)


class Source(BaseModel):
    section: str | None = None
    project: str | None = None
    category: str | None = None
    score: float


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/ai/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    message = request.message.strip()

    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        results = search_knowledge(message)

        if not results:
            return ChatResponse(
                answer=(
                    "The available portfolio evidence does not provide enough "
                    "information to answer that confidently."
                ),
                sources=[],
            )

        context = build_context(results)

        if not context:
            return ChatResponse(
                answer=(
                    "The available portfolio evidence does not provide enough "
                    "information to answer that confidently."
                ),
                sources=[],
            )

        answer = generate_answer(message, context)

        sources = [
            Source(
                section=(result.get("metadata") or {}).get("section")
                or result.get("source_title"),
                project=(result.get("metadata") or {}).get("project"),
                category=(result.get("metadata") or {}).get("category"),
                score=round(float(result.get("rank", result.get("score", 0.0))), 4),
            )
            for result in results
        ]

        return ChatResponse(answer=answer, sources=sources)

    except ValueError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"AI request failed: {exc}",
        ) from exc
