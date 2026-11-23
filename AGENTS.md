# AGENTS.md — `tomiweb.pro` Codebase & Design Specification

## 1. Identity & Editorial Voice
- **Preferred Name:** Tomi Yang (formal CV/academic contexts: Zixuan "Tomi" Yang)
- **Internet / GitHub Handle:** `TomiWebPro` (`https://github.com/TomiWebPro`)
- **Location:** Heilbronn, Germany (B.Sc. Information Engineering, Technical University of Munich — TUM Campus Heilbronn)
- **Contact:** `tomiwebpro@gmail.com` (for now, expose only email and a `/private/contact/` page—no social media sprawl)
- **Language:** English only.
- **Voice & Tone:** Sharp, grounded, builder-authentic. Let technical specifics carry the weight. Avoid corporate buzzwords, inflated marketing fluff, or generic "AI-generated" portfolio clichés.
- **Blog Tone (`/private/blog/`):** Casual, real-time updates on what Tomi is currently building, reading, or experimenting with, mixed with occasional playful/larp posts.

---

## 2. Core Architecture & URL Rules
- **Zero-Dependency Stack:** Plain semantic HTML5, modular CSS (using CSS custom properties), and lightweight vanilla JavaScript. **Do NOT introduce React, Next.js, Tailwind, Vite, npm build steps, or heavy third-party CDNs.**
- **Hosting Target:** Cloudflare Workers (Static Assets) via `wrangler.jsonc` serving `./site` with `"html_handling": "auto-trailing-slash"` and `"not_found_handling": "404-page"`. Every route maps to `<path>/index.html`.
- **Authoring Workflow (partials build, stdlib only):** Source of truth is `./src/` (mirrors `./site/` layout); shared chrome lives once in `src/_partials/` (`doc-top`, `header`, `footer`). Each page is a `<!-- page {...} -->` directive (`title`, `description`, `nav`, `header_container`, `footer_container`, `footer_extra`) + content + optional `<!-- page-tail -->` scripts. Never hand-edit `./site/`.
  - Rebuild: `python3 tools/build.py` — then verify: `python3 tools/build.py --check && python3 tools/check-links.py`.
  - Preview serves `./site/` on `:8090`; deploy only after checks pass. `compatibility/` and `assets/` are copied verbatim, not templated.
  - Agent guides: `docs/README.md` → `docs/SITE-MAP.md` (where everything lives) and `docs/WORKFLOWS.md` (build/verify, cookbooks for blog/project/connection/wiki updates). Read them before restructuring anything.
- **URL-Only Separation (Strict Unified UI):**
  - `/public/...` houses what Tomi builds (open-source projects and standalone project head pages).
  - `/private/...` houses who Tomi is (About, CV builder, Blog, Contact).
  - **CRITICAL:** Never display the words `"Public"` or `"Private"` in visible navigation bars, headings, breadcrumbs, or UI labels. The site must present as one cohesive personal website using natural labels (`tomiweb.pro` → `/`, `Projects` → `/public/`, `Blog` → `/private/blog/`, `About` → `/private/about/`, `Contact` → `/private/contact/`).

---

## 3. Visual Direction: Warm "Blonde" Editorial + Interactive 3D
- **Anti-"AI Slop" Mandate:** Strictly avoid dark-mode purple/cyan neon gradients, generic glassmorphic dark cards, or boilerplate SaaS templates.
- **Color Palette ("Blonde" Warm Light Theme):**
  - **Primary Canvas:** Warm blonde / unbleached parchment (`#F7F3EA` / `#FBF9F4`)
  - **Elevated Surfaces / Cards:** Soft cream / warm sand (`#EFE9DC` / `#FFFFFF` with subtle warm borders `#DFD6C5`)
  - **Primary Ink:** Deep warm charcoal (`#1C1B18`) and muted slate-taupe (`#5C574E`) for secondary metadata
  - **Accents:** Brushed champagne-gold / warm amber (`#B8863B` / `#9A6B26`) and subtle structural hairline rules
- **Cursor-Reactive Interactive 3D & Spatial Overlays:**
  - Build a lightweight, self-contained vanilla JS module (`/assets/js/spatial-3d.js`) that renders a subtle, high-craft interactive 3D visual overlay (e.g., an HTML5 Canvas / WebGL wireframe geometric lattice, spatial point-cloud, or layered 3D architectural planes) that smoothly tracks cursor movement and scroll depth.
  - Pair with tactile CSS 3D perspective (`perspective`, `transform-style: preserve-3d`, subtle cursor-driven card tilt, and crisp layered elevation shadows) on project cards and hero overlays.
  - Keep 3D effects tasteful, smooth (60fps `requestAnimationFrame`), non-blocking, and automatically disabled when `@media (prefers-reduced-motion: reduce)` is active.

---

## 4. Site Map & Required Pages
All pages live inside `./site/`:

- `/` (`site/index.html`) — Landing hub with interactive 3D hero overlay, concise intro for Tomi Yang (`TomiWebPro`), featured projects, recent blog notes, and direct links to About/CV and Contact.
- `/public/` (`site/public/index.html`) — **Projects** index, auto-generated from each project's `card` metadata (newest first; counts computed). Never hand-edit the grid or totals.
- **Dedicated Project Head Pages** (each is a standalone head website for its repo with its own `/public/<slug>/assets/` directory for future media/docs):
  1. `/public/cognithor/` — **Cognithor** (`https://github.com/Alex8791-cyber/cognithor`)
  2. `/public/openbmcui/` — **OpenBMCUI** (`https://github.com/TomiWebPro/redfishopenbmc`)
  3. `/public/stealthscale/` — **Stealthscale** (`https://github.com/TomiWebPro/stealthscale`)
  4. `/public/studyking/` — **StudyKing** (`https://github.com/TomiWebPro/StudyKing`)
  5. `/public/ects-tracker/` — **ECTS Tracker** (`https://github.com/TomiWebPro/ECTS-Tracker`)
  6. `/public/pchess/` — **PChess** (`https://github.com/TomiWebPro/PChess`)
  7. `/public/niqe/` — **NIQE Fork** (`https://github.com/TomiWebPro/niqe`)
  8. `/public/activelearn-bypass/` — **ActiveLearnBypass** (`https://github.com/TomiWebPro/ActiveLearn_bypass`)
- `/private/` (`site/private/index.html`) — Personal overview hub linking to About, Blog, and Contact.
- `/public/connection/` (`site/public/connection/index.html`) — **Connections** index (visible label "Connections", never "Public"). Each person: `/public/connection/<slug>/` where `<slug>` is lowercase kebab-case (handle or `first-last`, e.g. `alex8791-cyber`). Copy an existing person page as template; keep the backlink to the index, a wiki-mention link, and related build(s); link it from the wiki via `<a href="/public/connection/<slug>/">`.
- `/private/about/` (`site/private/about/index.html`) — Full background, education timeline, technical skills, awards/hardware experience, **Download Full CV (PDF)** button, and the **Modular CV Self-Checkout Builder**.
- `/private/blog/` (`site/private/blog/index.html`) — Casual dev-logs, recent updates, and occasional larp posts.
- `/private/contact/` (`site/private/contact/index.html`) — Clean contact page featuring `tomiwebpro@gmail.com` (with one-click copy) and direct guidance on reaching out.

---

## 5. Modular "Self-Checkout" PDF CV Feature (`/private/about/`)
Implement a zero-dependency interactive CV customizer directly on `/private/about/` (or linked sub-view `/private/about/cv/`):
- **How it works:** Visitors (or Tomi himself) can check/uncheck specific modules of his profile—e.g., *Education & Academic Scores*, *AI & Agent Systems (Cognithor, StudyKing)*, *Systems, Networking & Hardware (OpenBMCUI, Stealthscale, Homelab)*, *Applied Software & Research (ECTS Tracker, PChess, NIQE, ActiveLearnBypass)*, and *Competitions & Hardware Sourcing (IPhO, NASA Hackathon, CanSat, Robotics)*—and see a live preview of the tailored resume.
- **Direct-to-PDF Export:** Clicking **"Download Selected as PDF"** triggers `window.print()` backed by a dedicated `@media print` stylesheet (`@page { size: A4; margin: 14mm; }`) that hides all site chrome, 3D overlays, unchecked modules, and buttons—outputting a crisp, clean, single- or two-page black-on-white vector PDF with proper `break-inside: avoid` rules.

---

## 6. Ground-Truth Profile & Project Data (Do Not Hallucinate)
Use only verified facts below when populating pages (never invent fake metrics, employers, or street addresses):

### Education & Qualifications
- **Technical University of Munich (TUM), Campus Heilbronn** — B.Sc. Information Engineering (Sep 2026 – Jun 2029 expected)
- **The British International School Budapest (BISB)** — IGCSE & IB Diploma (Sep 2019 – Aug 2021; Sep 2023 – Jul 2026). IBDP: 37/45 (Physics HL 7, Computer Science SL 7, Economics HL 6, Math HL 5, German SL 5, English SL 5, Core 2).
- **Malvern College Chengdu** — IGCSE (Jan 2022 – Jun 2023; awarded 100,000 CNY/year scholarship). IGCSE highlights: A* (9) in Physics, Chemistry, Biology, Computer Science; A* in Mathematics, Business; A in Further Math, English Lit, English Lang, History.
- **Fifth Middle School of Guandu District, Kunming** — Chinese National Middle School Curriculum (Oct 2021 – Jan 2022).
- **Certifications & Tests:** International Physics Olympiad (IPhO) Bronze Award; Chinese National Youth Python Programming Certificate (Levels 1, 2, 3); IELTS Academic 8.0; SAT Math 720 / English 560; German ÖSD A2.
- **Technical Stack:** Python, Java, Dart/Flutter, Linux & SSH, Proxmox, Kubernetes, Docker, self-hosted server infrastructure.

### Projects Registry
1. **Cognithor** (`2026 Jan`, `https://github.com/Alex8791-cyber/cognithor`): Co-developed 100,000+ LOC modular LLM agent harness featuring multi-autonomous agents, long-term memory, computer-use capabilities, workflow orchestration, GDPR security mechanisms, and multi-platform integrations. Enabled Qwen 30B to solve ~30% of ARC-AGI-3 benchmark tasks; 150+ GitHub stars.
2. **OpenBMCUI** (`2026 Sep`, `https://github.com/TomiWebPro/redfishopenbmc`): Inspired by visiting Compal's hardware testing lab in Taiwan (alongside NVIDIA GDC and Computex 2026); explores an LLM-powered orchestration layer integrated into Redfish/OpenBMC interfaces to automate OS installation, drivers, configuration, and BIOS workflows on server hardware.
3. **Stealthscale** (`2026 Oct`, `https://github.com/TomiWebPro/stealthscale`): Self-hosted mesh networking system building on Tailscale and Headscale concepts, designed for private device-to-device mesh connectivity across NAT whose traffic blends into ordinary internet traffic.
4. **StudyKing** (`2026 Jun`, `https://github.com/TomiWebPro/StudyKing`): AI-powered adaptive studying assistant generating personalized study plans, structured lessons, and practice questions tailored to university coursework.
5. **ECTS Tracker** (`2026 Nov`, `https://github.com/TomiWebPro/ECTS-Tracker`): Local-first Flutter application (Riverpod + Drift/SQLite) converting university ECTS credits into daily and weekly study-hour pacing targets.
6. **PChess** (`2025 Sep`, `https://github.com/TomiWebPro/PChess`): Chess training application using Stockfish to extract tactical puzzles from real positions paired with LLM explanations of underlying strategic ideas (IB Computer Science IA).
7. **NIQE Fork** (`2025 Mar`, `https://github.com/TomiWebPro/niqe`): Modernized implementation of the Natural Image Quality Evaluator (NIQE) used in an IB Extended Essay benchmarking NVIDIA DLSS and AMD FSR upscaling fidelity.
8. **ActiveLearnBypass** (`2024 Jun`, `https://github.com/TomiWebPro/ActiveLearn_bypass`): Parallel Python image-retrieval and PDF-assembly utility built for offline study access to IGCSE textbooks.

### Experience, Competitions & Homelab
- **Hardware & Robotics:** 2nd Place (out of 18 teams) at NASA-led coding hackathon in Budapest (LLM technical document retrieval); Hungarian CanSat upper-atmosphere balloon satellite project (Arduino/microcontrollers/embedded systems); hardware & Chinese humanoid robot sourcing for school engineering programs; Taiwan Compal lab visit (turned down internship offer to build open-source BMC tooling independently).
- **Infrastructure & Research:** Builds home servers running Proxmox, Kubernetes, and Docker; contributed home compute resources to support experimental training of sub-100M parameter language models (Silcia architecture).

---

## 7. Agent Guardrails & Verification Checklist
1. **No Private Leaks:** Never put home street addresses or personal phone numbers anywhere in the codebase. Only use `tomiwebpro@gmail.com`.
2. **Theme Lock:** Keep the warm blonde light editorial theme (`site/assets/css/main.css`). Never swap in a dark or minimal theme without explicit instruction.
3. **Scoped Edits:** When working on one `/public/<project>/` page, do not alter unrelated project folders.
3. **README Freeze:** Never edit `README.md` — it is intentionally pinned to the October 2023 original. Leave it byte-for-byte as-is.
3. **Always Verify Before Finishing:**
   - Check that all internal links and routes resolve cleanly (HTTP 200).
   - Confirm zero occurrences of `"Public"` or `"Private"` in visible UI text.
   - Confirm zero external CDN scripts/fonts and verify `@media print` hides interactive controls cleanly.

---

## 8. High-Impact Main Page (`/`) Specification
- **Hero Stage:** Full-viewport-height opening section combining crisp editorial typography (`Tomi Yang` / `TomiWebPro`) with the cursor-reactive 3D spatial canvas (`spatial-3d.js`).
- **Interactive 3D Overlay:** Render a subtle, 60fps wireframe polyhedron / spatial node constellation in warm champagne-gold (`#B8863B`) and charcoal hairlines (`rgba(28, 27, 24, 0.14)`) that tilts and parallaxes smoothly with cursor coordinates. Include subtle interactive domain anchors (*Systems & BMC*, *Agentic AI*, *Mesh Networking*, *Hardware & Homelab*) that highlight connected elements on hover.
- **Editorial Bento / Index Grid Below the Fold:**
  1. **Concise Bio Lead + Wiki Preview Card:** 3–4 sharp sentences introducing Tomi, paired with a mini Infobox card linking directly to `/private/about/` ("Read Full Biography & Wiki →").
  2. **Selected Systems & Builds:** Tactile 3D-tilt cards for the 8 open-source projects linking to `/public/<slug>/`.
  3. **Recent Logs & Diary Notes:** Latest entries from `/private/blog/` with dates and topic tags.

---

## 9. "Living Wikipedia" Bio Architecture (`/private/about/`)
Design `/private/about/` as an editorial-grade personal encyclopedia article (inspired by *Gwern.net* and *Stripe Press* on warm blonde parchment), NOT a generic SaaS "About Me" page:
- **Two-Column Wiki Grid (Desktop):**
  - **Main Article Column (~68% width):** Structured encyclopedia sections with clean serif/editorial headings, anchor links (`#`), and dense, well-paced prose:
    1. *Overview & Philosophy*
    2. *Early Life & International Education* (Kunming, Chengdu, Budapest, Heilbronn)
    3. *Systems, AI & Engineering Work* (cross-linked to `/public/<project>/`)
    4. *Hardware, Competitions & Field Notes* (IPhO Bronze, NASA Hackathon 2nd Place, CanSat, Taiwan Compal Lab & Computex 2026, humanoid robotics sourcing)
    5. *Infrastructure & Homelab* (Proxmox, Kubernetes, Docker, Silcia sub-100M parameter compute contribution)
    6. *Modular CV Self-Checkout* (interactive section checkboxes + one-click `window.print()` vector PDF export)
  - **Sticky Wikipedia Infobox Sidebar (~32% width, collapses cleanly above article on mobile):**
    - Monogram/header banner (`Tomi Yang` / `TomiWebPro`)
    - Structured key-value metadata table: **Full Name** (Zixuan "Tomi" Yang), **Based In** (Heilbronn, Germany), **Education** (B.Sc. Information Engineering, TUM), **Languages** (English, Mandarin, German), **Core Domains** (Agent Harnesses, Redfish/BMC Automation, Mesh Networking, Homelab Infra), **Notable Honors** (IPhO Bronze, NASA Space Apps 2nd Place), **Contact** (`tomiwebpro@gmail.com`), plus a direct **"Download Full CV (PDF)"** trigger.
- **Sticky Section Contents Bar / Mini-TOC:** Auto-generated or structured jump-links at the top of the article (`1. Overview`, `2. Education`, `3. Engineering`, `4. Hardware & Field Notes`, `5. Homelab`, `6. CV Builder`).
- **Inline Citations & Hover Sidenotes (`[1]`, `[2]`):**
  - Support superscript citation markers (`<sup class="wiki-cite" data-ref="ref-1">[1]</sup>`) that display a sleek warm-parchment popover card on hover/click and link to a *References & Diary Context* list at the bottom of the page.
- **Bidirectional Cross-Linking:**
  - Every `/public/<project>/` head page must include a *"Context & Origin"* link pointing directly to the corresponding `#section` in `/private/about/` (e.g., `/public/openbmcui/` links to `/private/about/#compal-taiwan`, `/public/stealthscale/` links to `/private/about/#stealthscale-origin`).

---

## 10. Diary & Context Ingestion Protocol (For Future Updates)
When the user provides raw diary entries, notes, or personal updates in future turns:
1. **Chronological Log (`/private/blog/`):** Create or append a dated entry in `/private/blog/<YYYY-MM-DD-slug>/index.html` and index it on `/private/blog/index.html`, preserving Tomi's authentic, casual voice.
2. **Wiki Synthesis (`/private/about/`):** Extract durable facts, milestones, technical insights, or lore from the diary and weave them into the appropriate section of `/private/about/index.html`—updating the Infobox if major milestones change, and adding a numbered citation (`[n]`) pointing back to the dated diary entry.
3. **Privacy Filter:** Automatically strip out any private street addresses, personal phone numbers, or sensitive third-party details before writing to `./site/`.
