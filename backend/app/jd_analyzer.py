from __future__ import annotations

import json
import re
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

def _normalise(value: dict[str, Any], requirements: list[dict[str, str]]) -> dict[str, Any]:
    assessments = value.get("requirement_assessments") or []
    if not isinstance(assessments, list):
        assessments = []

    by_id: dict[str, dict[str, Any]] = {}
    for item in assessments:
        if not isinstance(item, dict):
            continue
        requirement_id = str(item.get("requirement_id") or "").strip()
        status = str(item.get("status") or "").strip().lower()
        if requirement_id and status in {"strong_match", "partial_match", "not_demonstrated"}:
            by_id[requirement_id] = item

    strong_matches: list[dict[str, Any]] = []
    partial_matches: list[dict[str, Any]] = []
    gaps: list[dict[str, Any]] = []

    points = {"strong_match": 1.0, "partial_match": 0.5, "not_demonstrated": 0.0}
    weighted_total = 0.0
    weighted_score = 0.0

    for requirement in requirements:
        item = by_id.get(requirement["id"])
        status = str(item.get("status") if item else "not_demonstrated").lower()
        evidence = str(item.get("evidence") if item else "No retrieved portfolio evidence supporting this requirement.").strip()

        weight = 0.8 if requirement["priority"] == "required" else 0.2
        weighted_total += weight
        weighted_score += weight * points.get(status, 0.0)

        entry = {"requirement": requirement["text"], "evidence": evidence}
        if status == "strong_match":
            strong_matches.append(entry)
        elif status == "partial_match":
            partial_matches.append(entry)
        else:
            gaps.append(entry)

    fit_score = round((weighted_score / weighted_total) * 100) if weighted_total else 0

    return {
        "fit_score": fit_score,
        "summary": str(value.get("summary") or "").strip(),
        "strong_matches": strong_matches,
        "partial_matches": partial_matches,
        "gaps": gaps,
        "relevant_projects": _list(value, "relevant_projects"),
        "learning_areas": _list(value, "learning_areas"),
        "score_note": "Calculated from one classification per requirement: strong match = 100%, partial match = 50%, not demonstrated = 0%, with required qualifications weighted 80% and preferred qualifications weighted 20%. This is a comparison estimate, not an objective hiring decision.",
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
summary, requirement_assessments, relevant_projects, learning_areas.

For requirement_assessments, return EXACTLY ONE object for EVERY supplied requirement, using:
{"requirement_id":"the supplied requirement id","status":"strong_match|partial_match|not_demonstrated","evidence":"brief evidence-based explanation"}

Every requirement must appear exactly once. Do not omit requirements and do not duplicate them.
Use strong_match only when the supplied evidence directly demonstrates the requirement.
Use partial_match when the evidence is related but incomplete.
Use not_demonstrated when the supplied evidence does not demonstrate it; do not claim that Priyanshu definitely lacks the skill.

For relevant_projects use {"project":"...","why_relevant":"..."}.
For learning_areas use {"area":"...","foundation":"..."}.

Do not return fit_score, strong_matches, partial_matches, or gaps. The backend calculates those deterministically from the requirement assessments.
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
        response_format={"type": "json_object"},
    )

    return _normalise(_json(response.choices[0].message.content or ""), requirements)
