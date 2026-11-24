# Site map — where everything lives (`tomiweb.pro`)

Repo root: `/home/tomi/Documents/tomiweb.pro` (not a git repo; deploy via `wrangler`).

## Root layout

| Path | What it is | Templated? |
|------|------------|------------|
| `AGENTS.md` | Behavioral spec: voice, architecture, ground-truth data, guardrails | n/a (spec) |
| `docs/` | This folder: agent-facing guides (you are here) | never built/deployed |
| `src/` | **Source of truth.** Mirrors `site/` layout | yes (via `tools/build.py`) |
| `site/` | Build artifact served by Cloudflare Workers Static Assets | generated — do not edit |
| `tools/build.py` | Assembles pages (`doc-top` + `header` + content + `footer` + optional `page-tail`); generates the project registry (`%%PROJECT_CARDS%%` / `%%N*%%` tokens) from per-page `card` metadata; copies `src/robots.txt`; regenerates `site/sitemap.xml` from the page inventory | — |
| `tools/check-links.py` | Verifies internal links, bans visible "Public"/"Private" text and CDN URLs, requires `@media print` in CSS (HTML files only; `sitemap.xml`/`robots.txt` exempt) | — |
| `src/robots.txt` | Crawler policy (permissive: guide, don't block) + sitemap pointer + entry-point guide | copied verbatim to `site/` |
| `wrangler.jsonc` | Cloudflare config: serves `./site`, `auto-trailing-slash`, `404-page` | — |
| `README.md` | Public GitHub-profile style intro | — |
| `compatibility/` (root) | Stray copy — the live one is `src/compatibility/` (see below) | — |

## `src/` layout

```
src/
  _partials/        shared chrome, injected by build.py (never a page):
    doc-top.html      <head> + opening <body>  ({{title}}, {{description}} slots)
    header.html       site nav  ({{header-container}}, {{nav-*}} slots)
    footer.html       footer    ({{footer-container}}, {{footer-extra}} slots)
  assets/
    css/main.css      the ONLY stylesheet: blonde theme vars, wiki grid,
                      cards, CV builder, and the @media print A4 rules
    js/main.js        global vanilla JS (filters, copy-email, misc)
    js/spatial-3d.js  homepage hero canvas: champagne-gold wireframe,
                      cursor/scroll reactive, honors prefers-reduced-motion
  index.html          /  (hero + bento: bio lead, 8 project cards, blog teasers)
  404.html            /404
  public/             PROJECTS index + one head page per repo (see table)
  private/
    index.html        /private/ hub (links to About / Blog / Contact)
    about/index.html  /private/about/ — the Living Wikipedia + CV builder
    blog/index.html   /private/blog/ index of dated posts
    blog/<slug>/      one folder per post, each with index.html
    contact/index.html
  compatibility/      legacy standalone quiz app — copied VERBATIM, never
                      templated, and SKIPPED by check-links.py. Touch rarely.
```

## Route → source file inventory (28 pages)

- `/` — `src/index.html`
- `/public/` — `src/public/index.html` (15 cards: lmchess, pixelquest, ects-tracker, stealthscale, opencode-scheduler, openbmcui, ducklingbrowser, studyking, cognithor, pchess, niqe, activelearn-bypass, taskmanager-image, german-noun-chooser, audioeq)
- Project heads — `src/public/<slug>/index.html`: `cognithor`, `openbmcui`, `stealthscale`, `studyking`, `ects-tracker`, `pchess`, `niqe`, `activelearn-bypass`, `pixelquest`, plus `lmchess`, `opencode-scheduler`, `ducklingbrowser`, `taskmanager-image`, `german-noun-chooser`, `audioeq`
- `/public/connection/` + `/public/connection/<slug>/` — people registry (`alex8791-cyber` = Cognithor co-dev). Visible label must read "Connections". Unlisted variant (link-only, no index card, no sitemap entry, `"unlisted": true` + `noindex`): see WORKFLOWS §4E, template `docs/templates/private-person.html`.
- `/private/` — `src/private/index.html`
- `/private/about/` — `src/private/about/index.html` (the wiki; see anchors below)
- `/private/blog/` — `src/private/blog/index.html` + posts: `building-cognithor`, `stealthscale-mesh-networking`, `llm-bmc-orchestration`, `homelab-proxmox-k8s`
- `/private/contact/` — `src/private/contact/index.html`

## Wiki anchor registry (`src/private/about/index.html`)

Every `/public/<project>/` head page has an `origin-callout` div linking to one of
these — keep them stable, and add a matching anchor when adding a project:

| Anchor | Section |
|--------|---------|
| `#overview` | 1. Overview & Philosophy |
| `#education` | 2. Early Life & International Education (+ `#tum-remote` remote-pacing subsection) |
| `#cognithor-origin` | 3. Cognithor |
| `#stealthscale-origin` | 3. Stealthscale |
| `#compal-taiwan` | 3. OpenBMCUI (engineering origin; linked from `/public/openbmcui/`) |
| `#studyking-origin` | 3. StudyKing |
| `#ects-origin` | 3. ECTS Tracker |
| `#pchess-origin` | 3. PChess |
| `#niqe-origin` | 3. NIQE Fork |
| `#activelearn-origin` | 3. ActiveLearnBypass |
| `#pixelquest-origin` | 3. PixelQuest |
| `#hardware` | 4. Entrepreneurship, Hardware & Field Notes (contains `#goodideas-origin`, `#compal-taiwan-extended` field-notes record, `#compal-lab-origin` OpenBMCUI-origin recap) |
| `#homelab` (+ `#silcia-compute`) | 5. Infrastructure & Homelab |
| `#cv-builder` | 6. Modular CV Self-Checkout (checkbox ids `mod-edu/ai/sys/tools/honors` ↔ preview blocks `block-edu/ai/sys/tools/honors`) |

References list lives at the bottom of the wiki article (`ref-1`…`ref-6`);
inline markers use `<sup class="wiki-cite" data-ref="ref-N">[N]</sup>`.
