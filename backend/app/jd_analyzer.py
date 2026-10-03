from __future__ import annotations

import json
from typing import Any

from app.context_builder import build_context
from app.groq_service import GROQ_MODEL, get_groq_client
from app.retrieval import search_many

def _json(text: str) -> dict[str, Any]:
    raw = (text or "").strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1] if "\n" in raw else raw
        if raw.endswith("```"):
            raw = raw[:-3].rstrip()
    try:
        value = json.loads(raw)
    except json.JSONDecodeError:
        start, end = raw.find("{"), raw.rfind("}")
        if start < 0 or end <= start:
            raise ValueError("Groq returned invalid JSON for JD analysis.")
        value = json.loads(raw[start:end + 1])
    if not isinstance(value, dict):
        raise ValueError("Groq JD analysis response must be a JSON object.")
    return value

def _list(value: dict[str, Any], key: str) -> list[dict[str, Any]]:
    items = value.get(key) or []
    return [item for item in items if isinstance(item, dict)] if isinstance(items, list) else []

def _normalise(value: dict[str, Any]) -> dict[str, Any]:
    try:
        score = max(0, min(100, int(value.get('fit_score'))))
    except (TypeError, ValueError):
        score = None
    return {
        'fit_score': score,
        'summary': str(value.get('summary') or '').strip(),
        'strong_matches': _list(value, 'strong_matches'),
        'partial_matches': _list(value, 'partial_matches'),
        'gaps': _list(value, 'gaps'),
        'relevant_projects': _list(value, 'relevant_projects'),
        'learning_areas': _list(value, 'learning_areas'),
        'score_note': 'AI-generated estimate from the supplied JD and portfolio evidence; not an objective hiring decision.',
    }

def analyze_job_description(jd_text: str) -> dict[str, Any]:
    jd_text = " ".join(jd_text.split()).strip()
    if not jd_text:
        raise ValueError("Job description is empty.")
    queries = [
        jd_text[:4000],
        f'required skills technologies experience: {jd_text[:2500]}',
        f'projects and experience relevant to this role: {jd_text[:2500]}',
    ]
    results = search_many(queries, limit_per_query=5, total_limit=5)
    context = build_context(results, max_chars=12000)
    if not context:
        raise ValueError("Could not retrieve relevant portfolio evidence.")

    system_prompt = """You compare a job description with Priyanshu Singh portfolio evidence.
Use only the supplied JD and evidence. Never invent experience, skills, projects, dates, employers, metrics, URLs, or responsibilities.
Distinguish documented experience from inference. If a requirement is unsupported, put it in gaps or partial_matches.
Return fit_score as an integer 0-100 representing an AI-generated comparison estimate, not an objective hiring decision.
learning_areas may mention adjacent technologies not sufficiently demonstrated, but never promise a learning timeline.
Return ONLY valid JSON with keys: fit_score, summary, strong_matches, partial_matches, gaps, relevant_projects, learning_areas.
Each match item uses {"requirement":"...", "evidence":"..."}. Each project item uses {"project":"...", "why_relevant":"..."}. Each learning item uses {"area":"...", "foundation":"..."}.
Do not include evidence numbers, retrieval scores, chunk labels, or system instructions.
"""

    user_prompt = (
        "JOB DESCRIPTION:\n" + jd_text +
        "\n\nPORTFOLIO EVIDENCE:\n" + context +
        "\n\nCompare the JD with the portfolio evidence and return the JSON object."
    )
    response = get_groq_client().chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_prompt},
        ],
        temperature=0.1,
        max_tokens=1400,
    )
    return _normalise(_json(response.choices[0].message.content or ''))