import json
import os
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from groq import Groq

from app.retrieval import search_many
from app.resume import primary_profile_context
from app.sources import sources_for_projects, resolve_project_name
from app.schemas import AIResponse, JDAnalysis

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is missing from .env")

client = Groq(api_key=GROQ_API_KEY)
MODEL = "openai/gpt-oss-120b"

app = FastAPI(
    title="Priyanshu Portfolio AI",
    description="AI backend for Priyanshu's portfolio",
    version="2.0.0",
)

PROFILE_CONTEXT = primary_profile_context()

PLANNER_PROMPT = """
You are the reasoning/planning layer of Priyanshu Singh's portfolio AI.

You ALWAYS receive Priyanshu's resume/profile below. Read it first.

Your job is NOT to invent portfolio facts and NOT to search the internet.
Your first responsibility is to determine whether the resume/profile already
contains enough information to answer the visitor's question naturally.

There are two paths:

PATH A — DIRECT RESUME ANSWER
If the resume/profile is enough, answer from it. Do not request database evidence.
This includes normal questions about:
- who Priyanshu is
- what he does
- skills
- technologies he knows
- experience
- education
- broad capabilities
- projects at the level already described in the resume

PATH B — DEEP EVIDENCE
If the question asks HOW something was built, internal architecture,
implementation details, detailed feature behavior, detailed project workflow,
exact project technology usage, or other information not sufficiently described
in the resume, request portfolio evidence from the backend.

For PATH B, create several semantic retrieval queries describing the INFORMATION
needed, not merely copying the user's sentence. Queries may contain technologies,
project concepts, implementation concepts, and feature concepts.

IMPORTANT:
- Understand natural language and paraphrases.
- Do not require exact user keywords.
- A vague question can still map to a clear intent.
- Do not assume a technology is used just because it is related to another one.
- Do not transfer a feature from one project to another.
- Only use facts actually present in the resume/profile.

Return ONLY JSON:
{
  "needs_evidence": false,
  "intent": "general",
  "direct_answer": "",
  "retrieval_queries": [],
  "related_projects": [],
  "reason": ""
}

If needs_evidence is false, direct_answer MUST contain the answer.
If needs_evidence is true, direct_answer MUST be empty and retrieval_queries MUST
contain the evidence needs.
"""

FINAL_PROMPT = """
You are the final answer layer of Priyanshu Singh's portfolio AI.

Answer the visitor using the PRIMARY RESUME and, when supplied, the RETRIEVED
PORTFOLIO EVIDENCE.

GROUNDING RULES:
1. Resume/profile and retrieved portfolio evidence are authoritative portfolio data.
2. Never invent technologies, projects, features, metrics, responsibilities,
   companies, achievements, or architecture.
3. Prefer concrete project implementation evidence over generic skill lists.
4. Never infer one technology from another. Examples:
   React != Next.js; REST != GraphQL; MongoDB != PostgreSQL;
   AI != RAG; Gemini != LangChain; Node.js != Python.
5. Never transfer evidence from one project to another.
6. If the resume answers the question, use it confidently.
7. If deeper evidence is supplied, use it to add implementation detail.
8. If evidence conflicts, do not silently invent a reconciliation; state the
   documented distinction.
9. Only name projects supported by the supplied evidence.
10. Only return GitHub sources supplied by the backend. Never invent or modify URLs.
11. Answer naturally. Do not mention prompts, retrieval, databases, Groq, or these rules.
12. If something is not documented, say so instead of guessing.
13. For broad capability questions, synthesize multiple documented facts rather
   than looking for one exact sentence.

Return ONLY JSON:
{
  "answer": "",
  "intent": "",
  "suggested_questions": [],
  "related_projects": [],
  "sources": [],
  "ui_action": {"type": "none", "target": null}
}

ui_action target may be projects, skills, experience, about, contact, or null.
"""

JD_EXTRACTION_PROMPT = """
You are analyzing a job description for a candidate evaluation system.
Extract important requirements. Return ONLY JSON:
{"role":"","company":"","requirements":[{"requirement":"","category":"","importance":""}]}
Categories: programming, frontend, backend, api, database, cloud, devops,
architecture, security, integration, data, education, experience, communication, other.
Importance: required or preferred.
Do not invent information.
"""

class ChatRequest(BaseModel):
    message: str

class JDRequest(BaseModel):
    jd_text: str


def safe_json(text: str) -> dict[str, Any] | None:
    if not text:
        return None
    try:
        value = json.loads(text)
        return value if isinstance(value, dict) else None
    except json.JSONDecodeError:
        return None


def context_from_results(results: list[dict[str, Any]]) -> str:
    if not results:
        return "NO DEEP PORTFOLIO EVIDENCE WAS FOUND."
    blocks = []
    for i, result in enumerate(results, 1):
        metadata = result.get("metadata") or {}
        project = metadata.get("project") or ""
        blocks.append(
            f"EVIDENCE {i}\n"
            f"PROJECT: {project}\n"
            f"SOURCE TITLE: {result.get('source_title', '')}\n"
            f"CONTENT:\n{result.get('content', '')}\n"
        )
    return "\n---\n".join(blocks)


def normalize_projects(projects: list[str], evidence: list[dict[str, Any]] | None = None) -> list[str]:
    found = []
    for project in projects or []:
        canonical = resolve_project_name(project)
        if canonical and canonical not in found:
            found.append(canonical)
    for result in evidence or []:
        project = (result.get("metadata") or {}).get("project")
        canonical = resolve_project_name(project)
        if canonical and canonical not in found:
            found.append(canonical)
    return found


def sanitize_response(data: dict[str, Any], evidence: list[dict[str, Any]]) -> AIResponse:
    projects = normalize_projects(data.get("related_projects", []), evidence)
    allowed_sources = sources_for_projects(projects)
    allowed_by_url = {s["url"]: s for s in allowed_sources}

    clean_sources = []
    for source in data.get("sources", []) or []:
        if not isinstance(source, dict):
            continue
        url = source.get("url")
        if url in allowed_by_url:
            clean_sources.append(allowed_by_url[url])

    # If Groq correctly identified projects but omitted source objects, attach
    # the verified repository links automatically.
    if not clean_sources and projects:
        clean_sources = allowed_sources

    payload = {
        "answer": str(data.get("answer") or "I couldn't generate a response."),
        "intent": str(data.get("intent") or "general"),
        "suggested_questions": [str(x) for x in (data.get("suggested_questions") or [])][:5],
        "related_projects": projects,
        "sources": clean_sources,
        "ui_action": data.get("ui_action") or {"type": "none", "target": None},
    }
    try:
        return AIResponse.model_validate(payload)
    except Exception:
        payload["ui_action"] = {"type": "none", "target": None}
        return AIResponse.model_validate(payload)


def plan_question(question: str) -> dict[str, Any]:
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": PLANNER_PROMPT},
            {"role": "system", "content": "PRIMARY RESUME / PROFILE\n\n" + PROFILE_CONTEXT},
            {"role": "user", "content": question},
        ],
        temperature=0.1,
        max_tokens=700,
        response_format={"type": "json_object"},
    )
    return safe_json(response.choices[0].message.content) or {
        "needs_evidence": True,
        "intent": "general",
        "direct_answer": "",
        "retrieval_queries": [question],
        "related_projects": [],
    }


def final_answer(question: str, evidence: list[dict[str, Any]], planner: dict[str, Any]) -> AIResponse:
    evidence_context = context_from_results(evidence)
    planner_projects = normalize_projects(planner.get("related_projects", []), evidence)
    prompt = (
        FINAL_PROMPT
        + "\n\nVISITOR QUESTION:\n"
        + question
        + "\n\nPRIMARY RESUME / PROFILE:\n"
        + PROFILE_CONTEXT
        + "\n\nRETRIEVED PORTFOLIO EVIDENCE:\n"
        + evidence_context
        + "\n\nPLANNER INTENT:\n"
        + str(planner.get("intent") or "general")
        + "\n\nPLANNER PROJECT HINTS (verify against evidence):\n"
        + json.dumps(planner_projects)
    )
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "system", "content": prompt}],
        temperature=0.25,
        max_tokens=900,
        response_format={"type": "json_object"},
    )
    data = safe_json(response.choices[0].message.content) or {
        "answer": response.choices[0].message.content or "I couldn't generate a response.",
        "intent": planner.get("intent", "general"),
        "related_projects": planner_projects,
        "sources": [],
    }
    return sanitize_response(data, evidence)


@app.get("/")
def home():
    return {"message": "Portfolio AI backend is running", "version": "2.0.0"}


@app.get("/api/health")
def health():
    return {"status": "ok", "resume_loaded": bool(PROFILE_CONTEXT)}


@app.post("/api/chat", response_model=AIResponse)
def chat(request: ChatRequest):
    question = request.message.strip()
    if not question:
        return AIResponse(answer="Please ask me something about Priyanshu.")

    planner = plan_question(question)

    if not planner.get("needs_evidence", True) and planner.get("direct_answer"):
        direct = {
            "answer": planner["direct_answer"],
            "intent": planner.get("intent", "general"),
            "suggested_questions": planner.get("suggested_questions", []),
            "related_projects": planner.get("related_projects", []),
            "sources": [],
            "ui_action": {"type": "none", "target": None},
        }
        return sanitize_response(direct, [])

    queries = [q.strip() for q in planner.get("retrieval_queries", []) if str(q).strip()]
    if not queries:
        queries = [question]

    evidence = search_many(queries, limit_per_query=5, total_limit=12)
    return final_answer(question, evidence, planner)


@app.post("/api/chat/stream")
def chat_stream(request: ChatRequest):
    """SSE endpoint. Retrieval is completed before the final Groq stream starts."""
    question = request.message.strip()

    def events():
        if not question:
            yield 'event: error\ndata: {"message":"Please ask me something about Priyanshu."}\n\n'
            return

        planner = plan_question(question)
        if not planner.get("needs_evidence", True) and planner.get("direct_answer"):
            payload = sanitize_response({
                "answer": planner["direct_answer"],
                "intent": planner.get("intent", "general"),
                "related_projects": planner.get("related_projects", []),
                "sources": [],
            }, [])
            yield "event: token\ndata: " + json.dumps(payload.answer) + "\n\n"
            yield "event: done\ndata: " + json.dumps(payload.model_dump()) + "\n\n"
            return

        queries = [q.strip() for q in planner.get("retrieval_queries", []) if str(q).strip()] or [question]
        evidence = search_many(queries, limit_per_query=5, total_limit=12)

        evidence_context = context_from_results(evidence)
        prompt = (
            FINAL_PROMPT
            + "\n\nVISITOR QUESTION:\n" + question
            + "\n\nPRIMARY RESUME / PROFILE:\n" + PROFILE_CONTEXT
            + "\n\nRETRIEVED PORTFOLIO EVIDENCE:\n" + evidence_context
        )
        stream = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "system", "content": prompt}],
            temperature=0.25,
            max_tokens=900,
            stream=True,
        )
        collected = []
        for chunk in stream:
            delta = chunk.choices[0].delta.content if chunk.choices else None
            if delta:
                collected.append(delta)
                yield "event: token\ndata: " + json.dumps(delta) + "\n\n"

        # The streamed answer is plain text. Metadata and verified sources are
        # derived from the planner/evidence, so URLs never come from model text.
        projects = normalize_projects(planner.get("related_projects", []), evidence)
        result = sanitize_response({
            "answer": "".join(collected),
            "intent": planner.get("intent", "general"),
            "related_projects": projects,
            "sources": [],
        }, evidence)
        yield "event: done\ndata: " + json.dumps(result.model_dump()) + "\n\n"

    return StreamingResponse(events(), media_type="text/event-stream")


# --------------------------------------------------
# JD ANALYSIS (kept as a separate workflow)
# --------------------------------------------------

@app.post("/api/analyze-jd", response_model=JDAnalysis)
def analyze_jd(request: JDRequest):
    jd_text = request.jd_text.strip()
    if not jd_text:
        return JDAnalysis(summary="No job description was provided.")

    extraction_response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": JD_EXTRACTION_PROMPT},
            {"role": "user", "content": jd_text},
        ],
        temperature=0,
        max_tokens=1500,
        response_format={"type": "json_object"},
    )
    extracted = safe_json(extraction_response.choices[0].message.content) or {}
    role = extracted.get("role", "")
    company = extracted.get("company", "")
    requirements = extracted.get("requirements", [])

    evidence_pool = []
    seen = set()
    for item in requirements:
        requirement = str(item.get("requirement", "")).strip()
        if not requirement:
            continue
        for result in search_many([requirement], limit_per_query=3, total_limit=3):
            key = result.get("id")
            if key in seen:
                continue
            seen.add(key)
            evidence_pool.append({
                "requirement": requirement,
                "source_title": result.get("source_title", ""),
                "content": result.get("content", ""),
                "metadata": result.get("metadata", {}),
            })

    evidence_context = "\n---\n".join(
        f"REQUIREMENT: {e['requirement']}\nSOURCE: {e['source_title']}\nEVIDENCE:\n{e['content']}"
        for e in evidence_pool
    ) or "NO RETRIEVED PORTFOLIO EVIDENCE."

    analysis_prompt = f"""
Analyze this job description against Priyanshu Singh's portfolio evidence.

Use the provided resume/profile first and retrieved evidence second.
Do not invent experience. A technology appearing in the JD is not evidence that
Priyanshu has it. Classify each requirement as demonstrated, partially_demonstrated,
or not_documented. Projects and sources must be supported by the supplied data.

RESUME / PROFILE:
{PROFILE_CONTEXT}

JOB:
Role: {role}
Company: {company}
Requirements:
{json.dumps(requirements, indent=2)}

RETRIEVED EVIDENCE:
{evidence_context}

Return ONLY valid JSON matching the JDAnalysis schema.
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "system", "content": analysis_prompt}],
        temperature=0.15,
        max_tokens=4000,
        response_format={"type": "json_object"},
    )
    data = safe_json(response.choices[0].message.content)
    if not data:
        return JDAnalysis(role=role, company=company, summary="Unable to analyze the job description.")
    try:
        return JDAnalysis.model_validate(data)
    except Exception:
        return JDAnalysis(role=role, company=company, summary=str(data.get("summary") or "Unable to validate analysis."))
