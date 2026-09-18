PROJECT_SOURCES = {
    "Netflix GPT": {"title": "Netflix GPT — GitHub", "url": "https://github.com/priyanshusingh89790-crypto/netflix-gpt"},
    "Personal Portfolio": {"title": "Personal Portfolio — GitHub", "url": "https://github.com/priyanshusingh89790-crypto/portfolio"},
    "Sales CRM": {"title": "Sales CRM — GitHub", "url": "https://github.com/priyanshusingh89790-crypto/sales_CRM"},
    "SocialPost": {"title": "SocialPost — GitHub", "url": "https://github.com/priyanshusingh89790-crypto/3w-social-post-app"},
    "Dev Meetup": {"title": "Dev Meetup — GitHub", "url": "https://github.com/priyanshusingh89790-crypto/Dev-meetup"},
    "Inventory Management System": {"title": "Inventory Management System — GitHub", "url": "https://github.com/priyanshusingh89790-crypto/inventory-management-system"},
    "Mail Inbox": {"title": "Mail Inbox — GitHub", "url": "https://github.com/priyanshusingh89790-crypto/Mail-Inbox-Task"},
    "AI Safety SOS": {"title": "AI Safety SOS — GitHub", "url": "https://github.com/priyanshusingh89790-crypto/ai-safety-sos"},
    "Brand Project": {"title": "Brand Project — GitHub", "url": "https://github.com/priyanshusingh89790-crypto/brand-project"},
    "PrimeReactPagination": {"title": "PrimeReactPagination — GitHub", "url": "https://github.com/priyanshusingh89790-crypto/PrimeReactPagination"},
    "AI Trading Research": {"title": "AI Trading Research — GitHub", "url": "https://github.com/priyanshusingh89790-crypto/AI-TRADING-RESEARCH"},
    "AI Workspace": {"title": "AI Workspace — GitHub", "url": "https://github.com/priyanshusingh89790-crypto/Ai-workspace"},
    "AI Integration": {"title": "AI Integration — GitHub", "url": "https://github.com/priyanshusingh89790-crypto/Ai-integration"},
    "AI Recruiter": {"title": "AI Recruiter — GitHub", "url": "https://github.com/priyanshusingh89790-crypto/ai-recruiter"},
}

ALIASES = {k.lower(): k for k in PROJECT_SOURCES}
ALIASES.update({
    "netflix-ai": "Netflix GPT",
    "netflix ai": "Netflix GPT",
    "netflix gpt": "Netflix GPT",
    "portfolio": "Personal Portfolio",
    "personal portfolio": "Personal Portfolio",
    "crm": "Sales CRM",
    "sales crm": "Sales CRM",
    "social post": "SocialPost",
    "devmeetup": "Dev Meetup",
    "dev meetup": "Dev Meetup",
    "inventory": "Inventory Management System",
    "inventory management system": "Inventory Management System",
    "ai safety": "AI Safety SOS",
    "ai safety sos": "AI Safety SOS",
    "mail inbox": "Mail Inbox",
    "ai trading research": "AI Trading Research",
})

def resolve_project_name(name):
    if not name:
        return None
    value = " ".join(str(name).strip().lower().split())
    return ALIASES.get(value)

def get_project_sources(project_name):
    canonical = resolve_project_name(project_name) or project_name
    source = PROJECT_SOURCES.get(canonical)
    return [dict(source)] if source else []

def sources_for_projects(projects):
    out, seen = [], set()
    for project in projects or []:
        source = get_project_sources(project)
        for item in source:
            if item["url"] not in seen:
                seen.add(item["url"])
                out.append(item)
    return out
