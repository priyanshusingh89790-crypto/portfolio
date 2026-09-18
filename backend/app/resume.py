import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
RESUME_TEXT_FILE = BASE_DIR / "data" / "resume.txt"
PORTFOLIO_JSON_FILE = BASE_DIR / "data" / "portfolio.json"


def load_resume_text() -> str:
    if RESUME_TEXT_FILE.exists():
        return RESUME_TEXT_FILE.read_text(encoding="utf-8").strip()
    return ""


def load_portfolio_profile() -> dict:
    if not PORTFOLIO_JSON_FILE.exists():
        return {}
    return json.loads(PORTFOLIO_JSON_FILE.read_text(encoding="utf-8"))

RESUME_TEXT = load_resume_text()
PORTFOLIO_PROFILE = load_portfolio_profile()


def primary_profile_context() -> str:
    parts = []
    if RESUME_TEXT:
        parts.append("PRIMARY RESUME\n" + RESUME_TEXT)
    if PORTFOLIO_PROFILE:
        parts.append("STRUCTURED PORTFOLIO PROFILE\n" + json.dumps(PORTFOLIO_PROFILE, indent=2, ensure_ascii=False))
    return "\n\n".join(parts)
