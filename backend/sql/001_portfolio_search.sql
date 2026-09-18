create extension if not exists vector;

create table if not exists projects (
    id bigserial primary key,
    name text not null unique,
    description text,
    role text,
    github_url text,
    live_url text,
    technologies text[] default '{}',
    created_at timestamptz default now()
);

create table if not exists knowledge_chunks (
    id bigserial primary key,
    project_id bigint references projects(id) on delete cascade,
    content text not null,
    source_type text,
    source_title text,
    metadata jsonb default '{}'::jsonb,
    embedding vector(384),
    created_at timestamptz default now()
);

alter table knowledge_chunks add column if not exists fts tsvector
generated always as (to_tsvector('english', content)) stored;

alter table knowledge_chunks add column if not exists evidence_scope text default 'general';

create index if not exists knowledge_chunks_fts_idx on knowledge_chunks using gin(fts);
create index if not exists knowledge_chunks_project_idx on knowledge_chunks(project_id);
create index if not exists knowledge_chunks_scope_idx on knowledge_chunks(evidence_scope);

create or replace function search_portfolio_knowledge(
    search_query text,
    match_limit integer default 5
)
returns table (
    id bigint,
    content text,
    source_type text,
    source_title text,
    metadata jsonb,
    evidence_scope text,
    rank real
)
language sql stable
as $$
    select kc.id, kc.content, kc.source_type, kc.source_title, kc.metadata,
           kc.evidence_scope,
           ts_rank(kc.fts, websearch_to_tsquery('english', search_query)) as rank
    from knowledge_chunks kc
    where kc.fts @@ websearch_to_tsquery('english', search_query)
    order by rank desc
    limit match_limit;
$$;
