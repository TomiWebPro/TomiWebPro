# Workflows — building, verifying, and extending `tomiweb.pro`

## 1. Build / verify / preview (run from repo root)

```bash
python3 tools/build.py                                  # src/ -> site/
python3 tools/build.py --check && python3 tools/check-links.py   # MUST pass before finishing
python3 -m http.server 8090 --directory site           # local preview of ./site
```

`--check` fails on: drift between `src/` and `site/`, orphans in `site/`,
broken internal `href="/.../"` links. `check-links.py` additionally fails on:
visible "Public"/"Private" UI text, external CDN `<script>/<link>` or font URLs,
missing `@media print` in `main.css`. (`compatibility/` is exempt from link checks.)

Deploy (only after checks pass; needs `wrangler` + Cloudflare auth):

```bash
npx wrangler deploy   # serves ./site per wrangler.jsonc
```

## 2. Page-directive format (every `src/**/*.html` page starts with this)

```html
<!-- page {"title": "...", "description": "...", "nav": "home|projects|about|blog|contact|none",
           "header_container": "container-wide|container|container-wiki",
           "footer_container": "container-wide|container|container-wiki",
           "footer_extra": "|connections"} -->
```

Optional tail block for page scripts, placed after content:

```html
<!-- page-tail -->
<script>...</script>
<!-- /page-tail -->
```

`nav: "none"` + `footer_extra: "connections"` is the convention for
`/public/connection/*` pages. New routes must be `index.html` inside their folder
(Cloudflare `auto-trailing-slash` maps folder → page).

## 3. Standing conventions (do not break)

- **Naming:** body prose calls him **Tomi** — never a standalone "Yang".
  Formal full names stay where they belong: `<title>`, H1/infobox
  (`Tomi Yang`, `Zixuan "Tomi" Yang`), CV preview header, `By Tomi Yang` bylines.
  After a rename sweep, verify: bare `Yang` should appear only next to
  `Tomi`/`Zixuan`, in titles, or in meta descriptions.
- **No visible "Public"/"Private"** in nav, headings, breadcrumbs, or buttons.
  Use natural labels: Projects, Blog, About, Contact, Connections.
- **Zero-dependency:** plain HTML + one CSS file + vanilla JS. No frameworks,
  no npm build, no CDN scripts/fonts.
- **Theme lock:** warm blonde (`#F7F3EA`/`#FBF9F4` canvas, `#B8863B` gold).
  Never restyle to dark/minimal unasked.
- **Privacy filter:** the only contact string allowed is `tomiwebpro@gmail.com`.
  Strip street addresses, phone numbers, third-party personal details on sight.
- **Print:** CV export = `window.print()` + `@media print` in `main.css`
  (`@page { size: A4; }`, hides chrome/controls/unchecked modules,
  `break-inside: avoid` on blocks). Test by toggling modules, never by editing CSS blindly.
- **Ground truth:** `AGENTS.md` §6 lists verified facts. New facts come only from
  the user — never invent metrics, employers, or addresses.

## 4. Cookbooks

### A. Fold user updates into the wiki (`/private/about/`)
1. Edit `src/private/about/index.html` in the matching section (see anchor registry in `SITE-MAP.md`).
2. Keep encyclopedic third-person tone; add/extend a `ref-N` footnote + inline `<sup>` if the fact is new and load-bearing.
3. Update the infobox if a major milestone changed (role, residence, honors).
4. Rebuild + run both checks.

### B. New blog post
1. Create `src/private/blog/<YYYY-MM-DD-slug>/index.html` (copy an existing post's
   directive + structure; date byline `By Tomi Yang`; casual first-person voice).
2. Add a card at the top of `src/private/blog/index.html` (`cards-grid-single`).
3. Optionally surface it on `/` (`src/index.html` Recent Logs) if it's major.
4. Rebuild + checks.

### C. New project head page (one file + build — the registry generates itself)
1. Copy the smallest existing `src/public/<slug>/index.html` (e.g. `pixelquest/`)
   to `src/public/<new-slug>/index.html`.
2. Fill in the `"card"` object in the page directive (build fails with an example
   if it's missing/invalid):
   `"card": {"title", "tag", "date" ("Dec 2026"), "sort" ("2026-12"),
   "category" ("ai"|"systems"|"tools"), "desc", "tech" ([str]),
   "origin": "#wiki-anchor" or null}`. Omit `seq` unless you must order
   same-month projects (default 50; lower = first).
3. Major builds: add the matching `#<new>-origin` block in the wiki engineering
   section AND keep the page's `origin-callout` div linking to it — the build
   verifies both directions and fails otherwise. Minor/fun builds may use
   `"origin": null` (no wiki section, no callout required).
4. Homepage (`src/index.html`) "Selected" grid stays hand-curated (8 slots) —
   add a card there only if the new build displaces one.
5. Rebuild + checks. The registry grid, newest-first order, `All (N)` /
   category counts, eyebrow, and homepage `View all N projects` count update
   automatically. `sitemap.xml` picks up the new route too.

### D. New connection person
1. Copy `src/public/connection/alex8791-cyber/index.html` → `src/public/connection/<handle>/index.html`.
2. Keep the backlink to `/public/connection/`, the wiki-mention link, and related build(s).
3. Add the person to `src/public/connection/index.html` and link them from the wiki.
4. Rebuild + checks.

## 5. Current known state (Nov 2026 — update as things change)

- 28 pages; projects index lists 15 (auto-generated from per-page `card`
  metadata — never hand-edit the grid or counts); wiki covers 9 engineering
  origins + GoodIdeas + remote-pacing (`#tum-remote`) + 6 references.
- Crawler files: `src/robots.txt` (permissive policy + guide, verbatim copy) and
  `site/sitemap.xml` (regenerated every build from the page inventory; 404 excluded).
- `src/compatibility/` = legacy quiz app, verbatim copy, out of scope for checks.
- Root `compatibility/` is a stray duplicate of `src/compatibility/`; the deployed
  one comes from `src/`. Prefer removing the stray over editing it.
- Repo is not under git; `docs/` is agent-only and never deployed.
