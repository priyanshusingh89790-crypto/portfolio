import os
from dotenv import load_dotenv
from supabase import create_client
from app.sources import get_project_sources, resolve_project_name

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is missing from .env")
if not SUPABASE_KEY:
    raise ValueError("SUPABASE_KEY is missing from .env")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def clean_query(query: str) -> str:
    return " ".join(str(query or "").strip().split())


def search_knowledge(query: str, limit: int = 5):
    query = clean_query(query)
    if not query:
        return []
    response = supabase.rpc("search_portfolio_knowledge", {
        "search_query": query,
        "match_limit": limit,
    }).execute()
    return response.data or []


def search_many(queries: list[str], limit_per_query: int = 5, total_limit: int = 12):
    merged = {}
    for query in queries or []:
        for result in search_knowledge(query, limit=limit_per_query):
            key = result.get("id") or (result.get("source_title"), result.get("content"))
            if key not in merged or float(result.get("rank") or 0) > float(merged[key].get("rank") or 0):
                merged[key] = result
    results = list(merged.values())
    results.sort(key=lambda x: float(x.get("rank") or 0), reverse=True)
    return [enrich_result(r) for r in results[:total_limit]]


def enrich_result(result):
    metadata = dict(result.get("metadata") or {})
    project = metadata.get("project")
    canonical = resolve_project_name(project) or project
    metadata["project"] = canonical
    result["metadata"] = metadata
    result["sources"] = get_project_sources(canonical) if canonical else []
    return result
