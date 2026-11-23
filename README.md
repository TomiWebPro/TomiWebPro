# Hi, I'm Zixuan (Tomi) Yang (TomiWebPro) 👋

B.Sc. Information Engineering student at the **Technical University of Munich (TUM)** (Heilbronn, Germany). Systems enthusiast building autonomous multi-agent LLM harnesses, undetectable mesh networks, and datacenter hardware automation tooling.

🌐 **Website:** [tomiweb.pro](https://tomiweb.pro)  
📫 **Email:** [tomiwebpro@gmail.com](mailto:tomiwebpro@gmail.com)  
📍 **Location:** Heilbronn, Germany  

---

### 🚀 Highlight Projects

- **[Cognithor](https://github.com/Alex8791-cyber/cognithor)** (`/public/cognithor/`): Modular multi-agent LLM framework (100k+ LoC). Solved ~30% on ARC-AGI-3 with Qwen 30B, surpassing Opus 4.7 baselines. 150★ on GitHub.
- **[Stealthscale](https://github.com/TomiWebPro/stealthscale)** (`/public/stealthscale/`): Undetectable self-hosted mesh networking based on Tailscale & Headscale primitives, disguised as normal HTTPS traffic against DPI.
- **[OpenBMCUI](https://github.com/TomiWebPro/redfishopenbmc)** (`/public/openbmcui/`): Next-gen Baseboard Management Controller interface with DMTF Redfish APIs and LLM automation for server provisioning & InfiniBand validation.
- **[PChess](https://github.com/TomiWebPro/PChess)** (`/public/pchess/`): Stockfish-powered tactical chess puzzle generator & conversational LLM tutor (IB Computer Science Internal Assessment, Grade 7).
- **[StudyKing](https://github.com/TomiWebPro/StudyKing)** (`/public/studyking/`): Adaptive AI learning assistant generating personalized engineering study curricula.
- **[NIQE Modernized Fork](https://github.com/TomiWebPro/niqe)** (`/public/niqe/`): Modernized Python implementation of the Natural Image Quality Evaluator, used in research comparing NVIDIA DLSS and AMD FSR.
- **[ActiveLearn Bypass](https://github.com/TomiWebPro/ActiveLearn_bypass)** (`/public/activelearn-bypass/`): High-throughput concurrent textbook image scraper and PDF assembler.

---

### 🎓 Education & Honors

- **Technical University of Munich (TUM):** B.Sc. Information Engineering (Heilbronn, 2026 – 2029)
- **International Baccalaureate (IBDP):** 37/45 (Higher Level Physics 7, Computer Science 7, Economics 6)
- **International Physics Olympiad (IPhO):** Bronze Award
- **NASA Space Apps Hackathon Budapest:** 2nd Place (LLM technical document retrieval)
- **Chinese National Youth Python Programming Certificate:** Levels 1, 2, and 3

---

### 🛠️ Site Architecture

This repository hosts [tomiweb.pro](https://tomiweb.pro), deployed via Cloudflare Workers Static Assets (`wrangler.jsonc`):
- `/`: Homepage with featured projects, stats, and background overview
- `/public/`: Open source projects index, with each project having its own dedicated page (`/public/<project>/`)
- `/private/`: Personal hub containing `/private/about/` (credentials, education, homelab) and `/private/blog/` (engineering notes)
