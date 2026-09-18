import json
import os
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq
from pypdf import PdfReader

import sys

sys.path.append(
    str(Path(__file__).resolve().parents[1])
)

from app.schemas import Portfolio


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError(
        "GROQ_API_KEY is missing from .env"
    )


# ============================================================
# GROQ
# ============================================================

client = Groq(api_key=GROQ_API_KEY)

MODEL = "openai/gpt-oss-120b"


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[1]

RESUME_PATH = (
    BASE_DIR
    / "data"
    / "Priyanshu_Singh_Updated_Resume.pdf"
)

OUTPUT_PATH = (
    BASE_DIR
    / "data"
    / "portfolio.json"
)


# ============================================================
# PDF
# ============================================================

def extract_resume_text() -> str:

    reader = PdfReader(RESUME_PATH)

    pages = []

    for page in reader.pages:
        text = page.extract_text()

        if text:
            pages.append(text)

    return "\n\n".join(pages)


# ============================================================
# LLM PARSER
# ============================================================

def parse_resume(resume_text: str) -> Portfolio:

    schema = Portfolio.model_json_schema()

    system_prompt = f"""
You are a precise portfolio knowledge extractor.

Convert the candidate's resume into structured
portfolio data.

Return ONLY valid JSON matching this schema:

{json.dumps(schema, indent=2)}

Rules:

- Use ONLY information explicitly present in the resume.
- Never invent information.
- Do not infer technologies that are not mentioned.
- Keep each employment experience separate.
- Keep projects separate from employment experience.
- Extract technologies for each project.
- Extract important project features when explicitly stated.
- Preserve meaningful technical details.
- Keep descriptions concise but informative.
- If a field is unavailable, return an empty string,
  empty list, or appropriate default value.
"""

    user_prompt = f"""
Extract the portfolio information from this resume:

--- RESUME START ---

{resume_text}

--- RESUME END ---
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
        response_format={
            "type": "json_object"
        },
        temperature=0,
        max_tokens=3000,
    )

    content = response.choices[0].message.content

    if not content:
        raise ValueError(
            "LLM returned an empty response"
        )

    data = json.loads(content)

    return Portfolio(**data)


# ============================================================
# MAIN
# ============================================================

def main():

    print("Reading resume...")

    resume_text = extract_resume_text()

    if not resume_text.strip():
        raise ValueError(
            "No text could be extracted from the PDF"
        )

    print("Parsing resume with AI...")

    portfolio = parse_resume(resume_text)

    OUTPUT_PATH.write_text(
        portfolio.model_dump_json(indent=2),
        encoding="utf-8",
    )

    print("\nPortfolio knowledge created:")
    print(OUTPUT_PATH)

    print("\nExtracted data:")
    print(portfolio.model_dump_json(indent=2))


if __name__ == "__main__":
    main()