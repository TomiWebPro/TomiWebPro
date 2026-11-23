# Docs for future agents (`tomiweb.pro`)

Practical companion to [`AGENTS.md`](../AGENTS.md) (the behavioral spec — read that first).
These files describe **where things live** and **how to change them** without breaking the build.

| File | Contents |
|------|----------|
| [`SITE-MAP.md`](SITE-MAP.md) | Repo layout, route → source-file inventory, partials/assets/tools roles, wiki anchor registry, `compatibility/` status |
| [`WORKFLOWS.md`](WORKFLOWS.md) | Build/verify commands, page-directive format, naming + guardrails, cookbooks (blog post, project page, connection person, wiki update), deploy notes |

**Golden rules (enforced by `tools/`):**
1. Source of truth is `./src/` — never hand-edit `./site/` (it's a build artifact).
2. After any `src/` edit: `python3 tools/build.py` then `python3 tools/build.py --check && python3 tools/check-links.py`. Both must pass.
3. Body copy calls him **Tomi**, never standalone "Yang" (formal names like `Tomi Yang` / `Zixuan "Tomi" Yang` in titles, infobox, CV header, bylines are fine).
4. Only contact allowed anywhere: `tomiwebpro@gmail.com`. No phone numbers, no street addresses.
