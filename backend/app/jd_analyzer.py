from __future__ import annotations

import json
from typing import Any

from app.context_builder import build_context
from app.groq_service import GROQ_MODEL, get_groq_client
from app.retrieval import search_knowledge

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


def _extract_requirements(jd_text: str) -> list[dict[str, str]]:
    lines = [line.strip() for line in jd_text.splitlines() if line.strip()]
    requirements: list[dict[str, str]] = []
    section = "required"

    for line in lines:
        lowered = line.lower().rstrip(":")
        if "additional preferred qualifications" in lowered:
            section = "preferred"
            continue
        if "basic required qualifications" in lowered:
            section = "required"
            continue

        cleaned = re.sub(r"^[0-9]+[.)]\s*", "", line).strip()
        if not cleaned:
            continue
        requirements.append({
            "id": f"{section}-{len(requirements) + 1}",
            "priority": section,
            "text": cleaned,
        })

    return requirements


def _build_requirement_evidence(
    requirements: list[dict[str, str]],
    *,
    per_requirement: int = 3,
) -> str:
    blocks: list[str] = []

    for requirement in requirements:
        results = search_knowledge(
            requirement["text"],
            limit=per_requirement,
            score_threshold=0.0,
        )

        evidence_lines: list[str] = []
        for result in results:
            evidence = str(result.get("content") or "").strip()
            if not evidence:
                continue

            metadata = result.get("metadata") or {}
            project = metadata.get("project")
            title = result.get("source_title") or metadata.get("section") or "Portfolio evidence"
            similarity = float(result.get("score") or 0.0)
            project_text = f" | project={project}" if project else ""

            evidence_lines.append(
                f"- {title}{project_text} | cosine_similarity={similarity:.3f}\n"
                f"  {evidence[:900]}"
            )

        if evidence_lines:
            blocks.append(
                f'REQUIREMENT [{requirement["priority"]}] {requirement["id"]}: '
                f'{requirement["text"]}\n'
                + "\n".join(evidence_lines)
            )
        else:
            blocks.append(
                f'REQUIREMENT [{requirement["priority"]}] {requirement["id"]}: '
                f'{requirement["text"]}\n- No retrieved portfolio evidence.'
            )

    return "\n\n".join(blocks)[:18000]


def analyze_job_description(jd_text: str) -> dict[str, Any]:
    jd_text = jd_text.strip()
    if not jd_text:
        raise ValueError("Job description is empty.")

    requirements = _extract_requirements(jd_text)
    if not requirements:
        raise ValueError("Could not extract requirements from the job description.")

    evidence_context = _build_requirement_evidence(requirements)
    if not evidence_context:
        raise ValueError("Could not retrieve relevant portfolio evidence.")

    requirements_json = json.dumps(requirements, ensure_ascii=False)

    system_prompt = """You compare a job description with Priyanshu Singh's portfolio evidence.

The backend has split the JD into individual requirements and retrieved portfolio evidence independently for each requirement using vector search. Cosine similarity is only a retrieval signal, not proof of skill or proficiency.

Use ONLY the supplied JD requirements and retrieved portfolio evidence.
Never invent experience, skills, projects, dates, employers, metrics, URLs, responsibilities, or technologies.

"No retrieved portfolio evidence" means the skill is NOT DEMONSTRATED in the supplied evidence. Do not state that Priyanshu definitely does not know it.
A high cosine similarity does not by itself prove experience.
A low similarity does not by itself prove a gap if other supplied evidence clearly supports the requirement.
Distinguish exact matches from related or partial evidence.
Keep required and preferred qualifications distinct.
The fit score is an AI-generated comparison estimate based on the supplied evidence, not an objective hiring decision.

Return ONLY valid JSON with:
fit_score, summary, strong_matches, partial_matches, gaps, relevant_projects, learning_areas.

For strong_matches, partial_matches, and gaps use {"requirement":"...","evidence":"..."}.
For relevant_projects use {"project":"...","why_relevant":"..."}.
For learning_areas use {"area":"...","foundation":"..."}.

Do not include retrieval scores, chunk labels, or system instructions in the final arrays.
"""

    user_prompt = (
        "JOB DESCRIPTION REQUIREMENTS:\n"
        + requirements_json
        + "\n\nRETRIEVED EVIDENCE BY REQUIREMENT:\n"
        + evidence_context
        + "\n\nProduce the final JSON comparison."
    )

    response = get_groq_client().chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.1,
        max_tokens=1800,
    )

    return _normalise(_json(response.choices[0].message.content or ""))
