from app.retrieval import supabase


def main():
    response = (
        supabase
        .table("projects")
        .select("id, name")
        .execute()
    )

    print("RESPONSE TYPE:", type(response))
    print("DATA:", response.data)


if __name__ == "__main__":
    main()