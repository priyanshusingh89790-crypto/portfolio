from pathlib import Path


KNOWLEDGE_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "portfolio_knowledge.md"
)


def load_portfolio_knowledge() -> str:
    if not KNOWLEDGE_FILE.exists():
        raise FileNotFoundError(
            f"Portfolio knowledge file not found: {KNOWLEDGE_FILE}"
        )

    return KNOWLEDGE_FILE.read_text(encoding="utf-8")