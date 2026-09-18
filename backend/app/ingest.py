import json
import re
from pathlib import Path

from supabase import create_client
from dotenv import load_dotenv
import os


# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

KNOWLEDGE_FILE = DATA_DIR / "portfolio_knowledge.md"
PORTFOLIO_FILE = DATA_DIR / "portfolio.json"


# --------------------------------------------------
# ENVIRONMENT
# --------------------------------------------------

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is missing from .env")

if not SUPABASE_KEY:
    raise ValueError("SUPABASE_KEY is missing from .env")


supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY,
)


# --------------------------------------------------
# LOAD FILES
# --------------------------------------------------

def load_markdown():
    if not KNOWLEDGE_FILE.exists():
        raise FileNotFoundError(
            f"Knowledge file not found: {KNOWLEDGE_FILE}"
        )

    return KNOWLEDGE_FILE.read_text(
        encoding="utf-8"
    )


def load_json():
    if not PORTFOLIO_FILE.exists():
        return {}

    with open(
        PORTFOLIO_FILE,
        "r",
        encoding="utf-8"
    ) as file:
        return json.load(file)


# --------------------------------------------------
# MARKDOWN CHUNKING
# --------------------------------------------------

def chunk_markdown(markdown: str):

    sections = re.split(
        r"\n(?=#+\s)",
        markdown
    )

    chunks = []

    for section in sections:

        section = section.strip()

        if not section:
            continue

        # Ignore extremely small sections
        if len(section) < 80:
            continue

        lines = section.splitlines()

        title = lines[0].strip("# ").strip()

        chunks.append({
            "title": title,
            "content": section,
        })

    return chunks


# --------------------------------------------------
# EXTRACT PROJECT NAME
# --------------------------------------------------

def detect_project(title: str, content: str):
    known_projects = [
        "Netflix GPT", "Inventory Management System", "Sales CRM", "SocialPost",
        "AI Safety SOS", "Mail Inbox", "Brand Project", "PrimeReactPagination",
        "AI Trading Research", "Dev Meetup", "Personal Portfolio", "Portfolio",
        "AI Workspace", "AI Integration", "AI Recruiter",
    ]
    normalized = " ".join(title.strip().lower().split())
    for project in known_projects:
        p = " ".join(project.lower().split())
        if normalized == p or normalized.startswith(p + " —") or normalized.startswith(p + " -"):
            return project
        if normalized.startswith("featured project: " + p):
            return project
    return None


# --------------------------------------------------
# FIND PROJECT ID
# --------------------------------------------------

def get_project_id(project_name):

    if not project_name:
        return None

    response = (
        supabase
        .table("projects")
        .select("id")
        .eq("name", project_name)
        .execute()
    )

    data = response.data

    if not data:
        return None

    # Supabase normally returns a list of dictionaries,
    # but protect against unexpected response shapes.
    if isinstance(data, list) and isinstance(data[0], dict):
        return data[0].get("id")

    return None


# --------------------------------------------------
# INSERT PROJECTS
# --------------------------------------------------

def insert_projects(portfolio):

    projects = portfolio.get(
        "projects",
        []
    )

    inserted = 0

    for project in projects:

        name = project.get(
            "name",
            ""
        ).strip()

        if not name:
            continue

        project_data = {
            "name": name,
            "description": project.get(
                "description",
                ""
            ),
            "role": project.get(
                "role",
                ""
            ),
            "technologies": project.get(
                "technologies",
                []
            ),
        }

        response = (
            supabase
            .table("projects")
            .upsert(
                project_data,
                on_conflict="name"
            )
            .execute()
        )

        if response.data:
            inserted += 1

    return inserted


# --------------------------------------------------
# INSERT KNOWLEDGE
# --------------------------------------------------

def insert_knowledge(chunks):

    inserted = 0

    for index, chunk in enumerate(chunks, start=1):

        project_name = detect_project(
            chunk["title"],
            chunk["content"]
        )

        project_id = get_project_id(
            project_name
        )

        knowledge_data = {
            "project_id": project_id,
            "content": chunk["content"],
            "source_type": "portfolio_knowledge",
            "source_title": chunk["title"],
            "metadata": {
                "project": project_name
            }
        }

        try:

            response = (
                supabase
                .table("knowledge_chunks")
                .insert(knowledge_data)
                .execute()
            )

            inserted += 1

            print(
                f"   [{index}/{len(chunks)}] "
                f"{chunk['title']}"
            )

        except Exception as error:

            print(
                f"   ❌ Failed chunk: {chunk['title']}"
            )

            print(
                f"      Error: {error}"
            )

    return inserted


# --------------------------------------------------
# MAIN
# --------------------------------------------------

def main():

    print("\n🚀 Starting portfolio ingestion...\n")

    print("📄 Loading portfolio knowledge...")

    markdown = load_markdown()

    print(
        f"   Loaded {len(markdown):,} characters"
    )

    print("📦 Loading portfolio JSON...")

    portfolio = load_json()

    print("   JSON loaded")

    print("\n🧩 Splitting Markdown into chunks...")

    chunks = chunk_markdown(
        markdown
    )

    print(
        f"   Created {len(chunks)} chunks"
    )

    print("\n📁 Inserting projects...")

    project_count = insert_projects(
        portfolio
    )

    print(
        f"   Projects processed: {project_count}"
    )

    print("\n🧠 Inserting knowledge chunks...")

    knowledge_count = insert_knowledge(
        chunks
    )

    print(
        f"   Knowledge chunks inserted: {knowledge_count}"
    )

    print("\n✅ Portfolio ingestion completed!\n")


if __name__ == "__main__":
    main()