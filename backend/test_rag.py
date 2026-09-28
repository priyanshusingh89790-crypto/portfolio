from __future__ import annotations

from app.qdrant_store import collection_info
from app.retrieval import search_knowledge


TEST_QUERIES = [
    "Where did Priyanshu use PostgreSQL?",

    "Which project uses MongoDB?",

    "Which projects use JWT authentication?",

    "What AI projects has Priyanshu built?",

"What projects use TypeScript?",

"Which project uses TensorFlow.js?",

"Where did he use Redux Toolkit?",

"Which project has role-based access control?",

"Which project uses Cloudinary?",

"What backend technologies has Priyanshu actually implemented?"

    "What projects use React and Express together?",

"Tell me about his AI Trading Research project.",
"Tell me about his AI Safety SOS project."

"What is Priyanshu's experience with databases?",
"    What projects involve authentication and authorization?",
"Does Priyanshu have experience with RAG?",
"Has he actually implemented a vector database?",

"Which project uses Qdrant for RAG?",
]


def print_result(index: int, result: dict) -> None:
    metadata = result.get("metadata") or {}

    print("\n" + "=" * 78)
    print(f"RESULT {index}")
    print("=" * 78)
    print(f"Score:       {result.get('score', 0):.4f}")
    print(f"Project:     {metadata.get('project')}")
    print(f"Category:    {metadata.get('category')}")
    print(f"Subcategory: {metadata.get('subcategory')}")
    print(f"Type:        {metadata.get('content_type')}")
    print(f"Section:     {metadata.get('section')}")
    print(f"Chunk key:   {metadata.get('chunk_key')}")
    print("\nContent:\n")
    print(result.get("content", ""))


def main() -> None:
    print("\n🔎 Qdrant RAG retrieval test\n")

    try:
        print("Collection:", collection_info())
    except Exception as error:
        print("❌ Could not read Qdrant collection.")
        print(f"   {error}")
        print("\nRun ingestion first: python -m app.ingest")
        return

    for query in TEST_QUERIES:
        print("\n\n" + "#" * 78)
        print(f"QUERY: {query}")
        print("#" * 78)

        try:
            results = search_knowledge(query, limit=5)
        except Exception as error:
            print(f"❌ Retrieval failed: {error}")
            continue

        print(f"Found {len(results)} relevant chunks")
        for index, result in enumerate(results, start=1):
            print_result(index, result)


if __name__ == "__main__":
    main()
