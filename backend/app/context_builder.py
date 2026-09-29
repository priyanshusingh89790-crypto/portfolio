from __future__ import annotations

from typing import Any


def build_context(
    results: list[dict[str, Any]],
    *,
    max_chars: int = 12000,
) -> str:
    """Convert retrieved evidence into a compact, labeled grounding context."""
    if not results:
        return ""

    blocks: list[str] = []
    total_chars = 0

    for index, result in enumerate(results, start=1):
        metadata = result.get("metadata") or {}
        source = result.get("source") or "unknown source"
        section = metadata.get("section") or result.get("source_title") or "unknown section"
        project = metadata.get("project")
        content = str(result.get("content") or "").strip()

        if not content:
            continue

        label_parts = [f"Evidence {index}", f"source={source}", f"section={section}"]
        if project:
            label_parts.append(f"project={project}")

        block = f"[{' | '.join(label_parts)}]\n{content}"
        remaining = max_chars - total_chars

        if remaining <= 0:
            break

        if len(block) > remaining:
            block = block[:remaining].rstrip()
            if len(block) < 80:
                break

        blocks.append(block)
        total_chars += len(block) + 2

    return "\n\n".join(blocks)
