from app.retrieval import search_knowledge


def main():

    query = input(
        "Ask something about Priyanshu: "
    )

    results = search_knowledge(
        query,
        limit=5,
    )

    print(
        f"\nFound {len(results)} relevant chunks\n"
    )

    for index, result in enumerate(
        results,
        start=1,
    ):
        print("=" * 70)

        print(f"RESULT {index}")
        print(f"TITLE: {result['source_title']}")
        print(
            f"PROJECT: "
            f"{result.get('metadata', {}).get('project')}"
        )
        print(f"RANK: {result['rank']}")
        print()

        print(result["content"])
        print()


if __name__ == "__main__":
    main()