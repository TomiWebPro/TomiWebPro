/**
 * tomiweb.pro — Interactive Systems & Milestones Timeline Component
 * Chronological engineering, research, and academic journey with category filtering,
 * interactive detail drawers, and direct cross-links.
 * Zero dependencies. Accessible & responsive.
 */

class TimelineComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = Object.assign({
      initialFilter: 'all',
      defaultSort: 'desc' // 'desc' (newest first) or 'asc' (oldest first)
    }, options);

    this.activeFilter = this.options.initialFilter;
    this.currentSort = this.options.defaultSort;
    this.searchQuery = '';
    this.expandedIds = new Set();

    this.initData();
    this.render();
    this.bindEvents();
  }

  initData() {
    this.items = [
      {
        id: 'ects-tracker',
        date: '2026.11',
        title: 'ECTS Tracker — Local-First Pacing Engine',
        category: 'systems',
        categoryLabel: 'Applied Systems',
        summary: 'Local-first Flutter application (Riverpod + SQLite) converting university credit quotas into daily and weekly study targets.',
        details: 'Designed specifically for TUM Information Engineering students. Uses Drift SQLite for zero-latency local-first persistence, reactive Riverpod providers, and desktop/mobile multi-platform compilation.',
        tags: ['Flutter', 'Dart', 'Drift / SQLite', 'Riverpod'],
        links: [
          { text: 'Project Head Page →', url: '/public/ects-tracker/' },
          { text: 'Wiki Origin →', url: '/private/about/#ects-origin' }
        ]
      },
      {
        id: 'stealthscale',
        date: '2026.10',
        title: 'Stealthscale — DPI-Resistant Mesh Networking',
        category: 'systems',
        categoryLabel: 'Mesh Networking',
        summary: 'Self-hosted mesh networking system building on Tailscale and Headscale concepts, disguising encrypted peer traffic as ordinary HTTPS web traffic.',
        details: 'Encapsulates WireGuard packets in authentic TLS 1.3 frames, adding randomized padding and timing jitter to defeat deep packet inspection (DPI) and state-level firewall filters encountered during travel.',
        tags: ['WireGuard', 'Headscale', 'TLS 1.3', 'DPI Bypass'],
        links: [
          { text: 'Project Head Page →', url: '/public/stealthscale/' },
          { text: 'Architecture Blog Log →', url: '/private/blog/stealthscale-mesh-networking/' }
        ]
      },
      {
        id: 'tum-matriculation',
        date: '2026.09',
        title: 'TUM Campus Heilbronn — B.Sc. Information Engineering',
        category: 'academic',
        categoryLabel: 'Education',
        summary: 'Commenced Bachelor of Science in Information Engineering at Technical University of Munich (TUM), Campus Heilbronn.',
        details: 'Core curriculum focuses on distributed systems, signal processing, discrete mathematics, and computer architecture. Campus located in the innovative Dieter Schwarz Foundation tech ecosystem in Heilbronn, Germany.',
        tags: ['TUM', 'Heilbronn', 'B.Sc. Info Engineering', 'Distributed Systems'],
        links: [
          { text: 'Biography Dossier →', url: '/private/about/#education' }
        ]
      },
      {
        id: 'openbmcui',
        date: '2026.09',
        title: 'OpenBMCUI & Taiwan Compal Hardware Lab',
        category: 'systems',
        categoryLabel: 'Datacenter BMC',
        summary: 'Next-gen Baseboard Management Controller interface with DMTF Redfish REST APIs and LLM automation layer.',
        details: 'Inspired by visits to Compal hardware testing laboratories in Taiwan alongside Computex 2026. Automates bare-metal OS deployment, driver compilation, and InfiniBand bandwidth qualification on live server racks.',
        tags: ['Redfish', 'OpenBMC', 'InfiniBand', 'Compal Taiwan Lab'],
        links: [
          { text: 'Project Head Page →', url: '/public/openbmcui/' },
          { text: 'Taiwan Lab Notes →', url: '/private/about/#compal-taiwan' }
        ]
      },
      {
        id: 'studyking',
        date: '2026.06',
        title: 'StudyKing — Adaptive STEM Curriculum Assistant',
        category: 'ai',
        categoryLabel: 'Agentic AI',
        summary: 'AI-powered adaptive learning assistant that decomposes engineering syllabi into concept prerequisite mastery graphs.',
        details: 'Built right after completing IB examinations to test how LLMs can dynamically scaffold STEM concepts, offering diagnostic problem sets and adaptive remediation loops at zero marginal cost.',
        tags: ['Python', 'FastAPI', 'LLM Tutoring', 'Adaptive Graphs'],
        links: [
          { text: 'Project Head Page →', url: '/public/studyking/' },
          { text: 'Wiki Context →', url: '/private/about/#studyking-origin' }
        ]
      },
      {
        id: 'cognithor',
        date: '2026.01',
        title: 'Cognithor — 100k+ LoC Multi-Agent LLM Harness',
        category: 'ai',
        categoryLabel: 'Agentic AI',
        summary: 'Co-developed 100k+ line modular LLM harness featuring multi-autonomous agents, episodic memory, and ARC-AGI-3 benchmark breakthroughs.',
        details: 'Enabled open-weights Qwen 30B to solve ~30% of ARC-AGI-3 reasoning tasks, outperforming published Claude Opus 4.7 approaches. Incorporates computer-use tooling, workflow orchestration, and GDPR security guardrails. Earned 150+ organic GitHub stars.',
        tags: ['100k+ LoC', 'ARC-AGI-3', 'Multi-Agent', '150★ GitHub'],
        links: [
          { text: 'Project Head Page →', url: '/public/cognithor/' },
          { text: 'Deep Dive Postmortem →', url: '/private/blog/building-cognithor/' }
        ]
      },
      {
        id: 'pchess',
        date: '2025.09',
        title: 'PChess — Stockfish Tactical Engine & LLM Coach',
        category: 'ai',
        categoryLabel: 'Agentic AI',
        summary: 'Chess training engine using Stockfish to extract tactical puzzles from real games, paired with conversational LLM explanations of motifs.',
        details: 'Authored as the Internal Assessment for the IB Computer Science curriculum, achieving a Grade 7. Analyzes PGN game logs to identify critical evaluation swings and translates raw engine lines into intuitive strategic motifs.',
        tags: ['Stockfish', 'Python', 'Conversational AI', 'IB CS Grade 7'],
        links: [
          { text: 'Project Head Page →', url: '/public/pchess/' },
          { text: 'Wiki Section →', url: '/private/about/#pchess-origin' }
        ]
      },
      {
        id: 'niqe',
        date: '2025.03',
        title: 'NIQE Modernized Fork — Neural Image Quality Evaluator',
        category: 'systems',
        categoryLabel: 'Vision Research',
        summary: 'Modernized implementation of Natural Image Quality Evaluator in Python 3.11+ and OpenCV for IB Extended Essay research.',
        details: 'Evaluated perceptual upscaling fidelity in NVIDIA DLSS vs AMD FSR using Natural Scene Statistics (NSS). Upgraded legacy MATLAB/Python 2 codebase into a modern, vectorized Python 3.11 package.',
        tags: ['Python 3.11', 'OpenCV', 'Image Quality (IQA)', 'DLSS vs FSR'],
        links: [
          { text: 'Project Head Page →', url: '/public/niqe/' },
          { text: 'Extended Essay Context →', url: '/private/about/#niqe-origin' }
        ]
      },
      {
        id: 'nasa-hackathon',
        date: '2024.10',
        title: 'NASA Space Apps Hackathon — 2nd Place Regional',
        category: 'honors',
        categoryLabel: 'Honors & Field',
        summary: 'Awarded 2nd Place out of 18 teams in the Budapest regional division of NASA Space Apps Hackathon for an AI agentic mission log retrieval system.',
        details: 'Constructed an LLM-powered technical knowledge retrieval assistant engineered to search, index, and synthesize complex NASA aerospace engineering documentation and historical mission logs.',
        tags: ['NASA Space Apps', '2nd Place / 18 Teams', 'LLM Mission Retrieval', 'Budapest'],
        links: [
          { text: 'Wiki Field Notes →', url: '/private/about/#hardware' }
        ]
      },
      {
        id: 'activelearn',
        date: '2024.06',
        title: 'ActiveLearnBypass — Concurrent Asset Pipeline',
        category: 'systems',
        categoryLabel: 'Applied Tools',
        summary: 'Concurrent Python image-retrieval and lossless PDF-assembly pipeline built for offline study access to digital IGCSE textbooks.',
        details: 'Utilized asynchronous thread pooling and unauthenticated API endpoints to download high-resolution vector and raster textbook pages, automatically compiling them into searchable offline PDFs.',
        tags: ['Python', 'Concurrent IO', 'Pillow', 'PyPDF'],
        links: [
          { text: 'Project Head Page →', url: '/public/activelearn-bypass/' },
          { text: 'Wiki Section →', url: '/private/about/#activelearn-origin' }
        ]
      },
      {
        id: 'bisb-ibdp',
        date: '2026.06',
        title: 'BISB Budapest — IB Diploma Awarded (37/45)',
        category: 'academic',
        categoryLabel: 'Education',
        summary: 'International Baccalaureate Diploma awarded June 2026 at The British International School Budapest.',
        details: 'Achieved 37 / 45 points overall: Physics HL (7/7), Computer Science SL (7/7), Economics HL (6/7), Math AA HL (5), German B (5), English A (5), Core & Extended Essay (2).',
        tags: ['IBDP 37/45', 'Physics HL 7', 'CS SL 7', 'Budapest'],
        links: [
          { text: 'Academic Credentials →', url: '/private/about/#education' }
        ]
      },
      {
        id: 'malvern-chengdu',
        date: '2022.01',
        title: 'Malvern College Chengdu — Academic Merit Scholarship',
        category: 'academic',
        categoryLabel: 'Education & Honors',
        summary: 'Awarded 100,000 CNY/year Academic Merit Scholarship; completed IGCSE with straight A* (9) grades.',
        details: 'Straight A* (9) grades in Physics, Chemistry, Biology, Computer Science, Mathematics, and Business. A in Further Mathematics, English Literature, and History.',
        tags: ['100k CNY Scholarship', 'IGCSE Straight A*s', 'Chengdu'],
        links: [
          { text: 'Biography Dossier →', url: '/private/about/#education' }
        ]
      },
      {
        id: 'ipho-bronze',
        date: '2021.08',
        title: 'Youth Physics Olympiad Bronze & Youth Python Certs',
        category: 'honors',
        categoryLabel: 'Honors & Field',
        summary: 'Early youth competition Bronze Award at the International Physics Olympiad (IPhO) and Chinese National Youth Python Programming Certificates (Levels 1, 2, 3).',
        details: 'Recognized at age 13 for theoretical physics problem solving in relativistic mechanics, thermodynamics, and electromagnetism. Also obtained official National Youth Python certification across all three progressive tiers.',
        tags: ['Youth Physics Bronze', 'Theoretical Physics', 'Python Tier 1-3'],
        links: [
          { text: 'Certifications & Honors →', url: '/private/about/#hardware' }
        ]
      }
    ];
  }

  getFilteredItems() {
    let list = this.items.filter(item => {
      // Category filter
      if (this.activeFilter !== 'all') {
        if (this.activeFilter === 'ai' && item.category !== 'ai') return false;
        if (this.activeFilter === 'systems' && item.category !== 'systems') return false;
        if (this.activeFilter === 'academic' && item.category !== 'academic') return false;
        if (this.activeFilter === 'honors' && item.category !== 'honors') return false;
      }

      // Search query
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSummary = item.summary.toLowerCase().includes(q);
        const matchDetails = item.details.toLowerCase().includes(q);
        const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchDetails && !matchTags) return false;
      }

      return true;
    });

    // Sort order
    list.sort((a, b) => {
      if (this.currentSort === 'asc') {
        return a.date.localeCompare(b.date);
      } else {
        return b.date.localeCompare(a.date);
      }
    });

    return list;
  }

  render() {
    const items = this.getFilteredItems();

    this.container.innerHTML = `
      <div class="timeline-controls-bar no-print">
        <div class="timeline-filter-pills">
          <button class="timeline-pill ${this.activeFilter === 'all' ? 'active' : ''}" data-tfilter="all">All (${this.items.length})</button>
          <button class="timeline-pill ${this.activeFilter === 'ai' ? 'active' : ''}" data-tfilter="ai">AI &amp; Agents (3)</button>
          <button class="timeline-pill ${this.activeFilter === 'systems' ? 'active' : ''}" data-tfilter="systems">Systems &amp; Mesh (5)</button>
          <button class="timeline-pill ${this.activeFilter === 'academic' ? 'active' : ''}" data-tfilter="academic">Education (3)</button>
          <button class="timeline-pill ${this.activeFilter === 'honors' ? 'active' : ''}" data-tfilter="honors">Honors &amp; Field (2)</button>
        </div>

        <div class="timeline-actions">
          <input type="text" class="timeline-search-input" placeholder="Search milestones..." value="${this.searchQuery}">
          <button class="timeline-sort-btn" title="Toggle chronological order">
            ${this.currentSort === 'desc' ? 'Newest First ↓' : 'Oldest First ↑'}
          </button>
        </div>
      </div>

      <div class="timeline-stream">
        ${items.length === 0 ? `
          <div class="timeline-empty">No milestones match your search or filter.</div>
        ` : items.map((item, index) => {
          const isExpanded = this.expandedIds.has(item.id);
          return `
            <div class="timeline-entry ${isExpanded ? 'is-expanded' : ''}" data-entry-id="${item.id}">
              <div class="timeline-marker">
                <div class="timeline-node-dot"></div>
                <div class="timeline-line"></div>
              </div>

              <div class="timeline-card card">
                <div class="timeline-card-header">
                  <div class="timeline-meta-row">
                    <span class="timeline-date">${item.date}</span>
                    <span class="timeline-cat-badge timeline-cat-${item.category}">${item.categoryLabel}</span>
                  </div>
                  <h3 class="timeline-title">${item.title}</h3>
                  <p class="timeline-summary">${item.summary}</p>
                </div>

                <div class="timeline-tags">
                  ${item.tags.map(t => `<span class="tech-chip">${t}</span>`).join('')}
                </div>

                ${isExpanded ? `
                  <div class="timeline-drawer">
                    <p class="timeline-details-text">${item.details}</p>
                    <div class="timeline-links-row">
                      ${item.links.map(l => `<a href="${l.url}" class="btn btn-secondary btn-sm">${l.text}</a>`).join('')}
                    </div>
                  </div>
                ` : ''}

                <div class="timeline-card-footer">
                  <button class="timeline-expand-btn" data-toggle-id="${item.id}">
                    ${isExpanded ? 'Less details ↑' : 'Technical specifics &amp; links ↓'}
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  bindEvents() {
    this.container.addEventListener('click', (e) => {
      // Filter button
      const filterBtn = e.target.closest('[data-tfilter]');
      if (filterBtn) {
        this.activeFilter = filterBtn.getAttribute('data-tfilter');
        this.render();
        return;
      }

      // Sort toggle
      const sortBtn = e.target.closest('.timeline-sort-btn');
      if (sortBtn) {
        this.currentSort = this.currentSort === 'desc' ? 'asc' : 'desc';
        this.render();
        return;
      }

      // Detail toggle
      const toggleBtn = e.target.closest('[data-toggle-id]');
      if (toggleBtn) {
        const id = toggleBtn.getAttribute('data-toggle-id');
        if (this.expandedIds.has(id)) {
          this.expandedIds.delete(id);
        } else {
          this.expandedIds.add(id);
        }
        this.render();
        return;
      }
    });

    this.container.addEventListener('input', (e) => {
      if (e.target.classList.contains('timeline-search-input')) {
        this.searchQuery = e.target.value;
        this.render();
      }
    });
  }
}

// Global attachment
window.TimelineComponent = TimelineComponent;
