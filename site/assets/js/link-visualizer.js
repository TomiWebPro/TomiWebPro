/**
 * tomiweb.pro — Interactive Knowledge & Link Graph Visualizer
 * Physics-driven canvas graph visualizing connections between Tomi's
 * software repositories, technical domains, academic origins, and field hardware.
 * Zero external dependencies. Fully responsive.
 */

class LinkVisualizer {
  constructor(canvasId, containerId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId) || (this.canvas ? this.canvas.parentElement : null);
    if (!this.canvas || !this.container) return;

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.options = Object.assign({
      accentColor: '184, 134, 59', // Champagne Gold #B8863B
      inkColor: '28, 27, 24',       // Charcoal #1C1B18
      canvasBg: '#F7F3EA',
      enableDragging: true,
      springLength: 85,
      springK: 0.0035,
      repulsion: 850,
      damping: 0.88
    }, options);

    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.animId = null;

    // Interaction states
    this.hoveredNode = null;
    this.selectedNode = null;
    this.draggedNode = null;
    this.dragOffset = { x: 0, y: 0 };
    this.mouse = { x: -1000, y: -1000 };
    this.activeFilter = 'all';

    // Tooltip Element
    this.tooltip = null;

    this.initData();
    this.init();
  }

  initData() {
    // Categories:
    // 'domain': Domain Hubs (larger nodes)
    // 'project': Software Repositories
    // 'origin': Origins, Field Labs & Academic Milestones
    this.nodes = [
      // Domain Hubs
      { id: 'hub-ai', label: 'Agentic AI & Harnesses', type: 'domain', category: 'ai', radius: 24, badge: 'Core Domain', desc: 'Autonomous LLM harnesses, computer use, and reasoning benchmarks.' },
      { id: 'hub-systems', label: 'Datacenter & BMC', type: 'domain', category: 'systems', radius: 22, badge: 'Core Domain', desc: 'Baseboard management controller orchestration, Redfish, bare-metal.' },
      { id: 'hub-mesh', label: 'Mesh & Privacy', type: 'domain', category: 'mesh', radius: 21, badge: 'Core Domain', desc: 'DPI-resistant tunnels, TLS 1.3 encapsulation, and WireGuard.' },
      { id: 'hub-vision', label: 'Vision & Tooling', type: 'domain', category: 'tools', radius: 19, badge: 'Core Domain', desc: 'Image quality evaluation, natural scene statistics, and scrapers.' },
      { id: 'hub-infra', label: 'Homelab & Compute', type: 'domain', category: 'infra', radius: 20, badge: 'Core Domain', desc: 'Proxmox hypervisors, Kubernetes clusters, and LLM compute allocation.' },
      { id: 'hub-academic', label: 'Academic & Honors', type: 'domain', category: 'academic', radius: 22, badge: 'Core Domain', desc: 'TUM Heilbronn, IBDP 37/45, IPhO Bronze, and NASA hackathons.' },

      // 8 Open-Source Projects
      { id: 'cognithor', label: 'Cognithor', type: 'project', category: 'ai', radius: 18, url: '/public/cognithor/', badge: '100k+ LoC • ARC-AGI-3', desc: 'Modular multi-autonomous LLM agent harness solving ~30% ARC-AGI-3. 150★.' },
      { id: 'openbmcui', label: 'OpenBMCUI', type: 'project', category: 'systems', radius: 17, url: '/public/openbmcui/', badge: 'Redfish & OpenBMC', desc: 'Next-gen BMC orchestration layer tested on server racks at Compal.' },
      { id: 'stealthscale', label: 'Stealthscale', type: 'project', category: 'mesh', radius: 17, url: '/public/stealthscale/', badge: 'WireGuard & TLS 1.3', desc: 'Undetectable mesh networking disguising encrypted traffic against DPI.' },
      { id: 'studyking', label: 'StudyKing', type: 'project', category: 'ai', radius: 15, url: '/public/studyking/', badge: 'Adaptive Learning', desc: 'AI adaptive tutor generating diagnostic lessons from university curricula.' },
      { id: 'ects-tracker', label: 'ECTS Tracker', type: 'project', category: 'tools', radius: 15, url: '/public/ects-tracker/', badge: 'Flutter & Riverpod', desc: 'Local-first Flutter app converting university ECTS credits into daily targets.' },
      { id: 'pchess', label: 'PChess', type: 'project', category: 'ai', radius: 14, url: '/public/pchess/', badge: 'Stockfish & LLM', desc: 'Chess tactical analyzer paired with conversational LLM coaching (IB CS 7).' },
      { id: 'niqe', label: 'NIQE Fork', type: 'project', category: 'tools', radius: 14, url: '/public/niqe/', badge: 'Python 3.11 & OpenCV', desc: 'Natural Image Quality Evaluator used to benchmark DLSS vs FSR in IB EE.' },
      { id: 'activelearn', label: 'ActiveLearnBypass', type: 'project', category: 'tools', radius: 14, url: '/public/activelearn-bypass/', badge: 'Concurrent IO & PDF', desc: 'Parallel Python asset scraper and lossless offline PDF compiler.' },

      // Origins & Academic Milestones
      { id: 'tum', label: 'TUM Campus Heilbronn', type: 'origin', category: 'academic', radius: 16, url: '/private/about/#education', badge: 'B.Sc. Info Engineering', desc: 'Technical University of Munich studies in distributed systems & math.' },
      { id: 'compal', label: 'Compal Labs Taiwan', type: 'origin', category: 'systems', radius: 15, url: '/private/about/#compal-taiwan', badge: 'Hardware Testing', desc: 'Server hardware testing lab inspiring out-of-band BMC tooling.' },
      { id: 'nasa', label: 'NASA Space Apps', type: 'origin', category: 'academic', radius: 15, url: '/private/about/#hardware', badge: '2nd Place / 18 Teams', desc: 'Budapest regional hackathon building engineering document retrieval.' },
      { id: 'ipho', label: 'IPhO Physics', type: 'origin', category: 'academic', radius: 14, url: '/private/about/#hardware', badge: 'Bronze Medalist', desc: 'International Physics Olympiad recognition in theoretical mechanics.' },
      { id: 'bisb', label: 'BISB Budapest', type: 'origin', category: 'academic', radius: 14, url: '/private/about/#education', badge: 'IBDP 37/45', desc: 'High school graduation with Physics HL 7, CS SL 7, and Economics HL 6.' },
      { id: 'homelab', label: 'Proxmox & K8s Cluster', type: 'origin', category: 'infra', radius: 15, url: '/private/about/#homelab', badge: 'Compute Infra', desc: 'Self-hosted bare-metal clusters contributing compute to sub-100M LLMs.' }
    ];

    // Edges (Interconnections)
    this.edges = [
      // AI Domain cluster
      { source: 'hub-ai', target: 'cognithor', weight: 1.2 },
      { source: 'hub-ai', target: 'studyking', weight: 1.0 },
      { source: 'hub-ai', target: 'pchess', weight: 1.0 },
      { source: 'cognithor', target: 'studyking', weight: 0.8 },
      { source: 'cognithor', target: 'nasa', weight: 0.9 },

      // Systems & Datacenter cluster
      { source: 'hub-systems', target: 'openbmcui', weight: 1.2 },
      { source: 'openbmcui', target: 'compal', weight: 1.1 },
      { source: 'openbmcui', target: 'homelab', weight: 0.9 },
      { source: 'hub-systems', target: 'tum', weight: 0.8 },

      // Mesh Networking cluster
      { source: 'hub-mesh', target: 'stealthscale', weight: 1.2 },
      { source: 'stealthscale', target: 'homelab', weight: 1.0 },
      { source: 'stealthscale', target: 'cognithor', weight: 0.6 },

      // Tools & Vision cluster
      { source: 'hub-vision', target: 'niqe', weight: 1.1 },
      { source: 'hub-vision', target: 'activelearn', weight: 1.1 },
      { source: 'hub-vision', target: 'ects-tracker', weight: 1.0 },
      { source: 'niqe', target: 'bisb', weight: 0.9 },
      { source: 'pchess', target: 'bisb', weight: 0.9 },

      // Academic & Honors cluster
      { source: 'hub-academic', target: 'tum', weight: 1.2 },
      { source: 'hub-academic', target: 'bisb', weight: 1.1 },
      { source: 'hub-academic', target: 'ipho', weight: 1.0 },
      { source: 'hub-academic', target: 'nasa', weight: 1.0 },
      { source: 'tum', target: 'ects-tracker', weight: 1.1 },

      // Infrastructure cross-links
      { source: 'hub-infra', target: 'homelab', weight: 1.2 },
      { source: 'hub-infra', target: 'openbmcui', weight: 0.8 }
    ];
  }

  init() {
    this.createTooltip();
    this.handleResize = this.resize.bind(this);
    this.handleMouseMove = this.onMouseMove.bind(this);
    this.handleMouseDown = this.onMouseDown.bind(this);
    this.handleMouseUp = this.onMouseUp.bind(this);
    this.handleClick = this.onClick.bind(this);
    this.handleTouchStart = this.onTouchStart.bind(this);
    this.handleTouchMove = this.onTouchMove.bind(this);
    this.handleTouchEnd = this.onTouchEnd.bind(this);

    window.addEventListener('resize', this.handleResize, { passive: true });
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
    this.canvas.addEventListener('click', this.handleClick);

    // Touch support
    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd);

    this.resize();
    this.initFilterButtons();
    this.start();
  }

  createTooltip() {
    let el = this.container.querySelector('.link-graph-tooltip');
    if (!el) {
      el = document.createElement('div');
      el.className = 'link-graph-tooltip no-print';
      el.innerHTML = `
        <div class="tooltip-badge"></div>
        <div class="tooltip-title"></div>
        <div class="tooltip-desc"></div>
        <div class="tooltip-footer">
          <span class="tooltip-link-hint">Click node to visit page →</span>
        </div>
      `;
      this.container.appendChild(el);
    }
    this.tooltip = el;
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = this.container.offsetWidth || 800;
    this.height = Math.max(480, Math.min(620, window.innerHeight * 0.65));

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);

    this.layoutInitialPositions();
  }

  layoutInitialPositions() {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const r = Math.min(this.width, this.height) * 0.38;

    // Arrange domain hubs in a balanced central ring
    const domainHubs = this.nodes.filter(n => n.type === 'domain');
    domainHubs.forEach((hub, idx) => {
      const angle = (idx / domainHubs.length) * Math.PI * 2 - Math.PI / 2;
      hub.x = cx + Math.cos(angle) * (r * 0.45);
      hub.y = cy + Math.sin(angle) * (r * 0.45);
      hub.vx = 0;
      hub.vy = 0;
    });

    // Place projects and origins orbiting their respective domains
    const otherNodes = this.nodes.filter(n => n.type !== 'domain');
    otherNodes.forEach((node, idx) => {
      const angle = (idx / otherNodes.length) * Math.PI * 2;
      const dist = r * (0.75 + (idx % 2) * 0.2);
      node.x = cx + Math.cos(angle) * dist;
      node.y = cy + Math.sin(angle) * dist;
      node.vx = (Math.random() - 0.5) * 0.5;
      node.vy = (Math.random() - 0.5) * 0.5;
    });
  }

  initFilterButtons() {
    const btns = this.container.querySelectorAll('[data-graph-filter]');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.getAttribute('data-graph-filter') || 'all';
      });
    });
  }

  getNodeAt(x, y) {
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const n = this.nodes[i];
      if (this.isNodeFiltered(n)) continue;
      const dist = Math.hypot(n.x - x, n.y - y);
      if (dist <= n.radius + 6) {
        return n;
      }
    }
    return null;
  }

  isNodeFiltered(node) {
    if (this.activeFilter === 'all') return false;
    if (this.activeFilter === 'projects') return node.type !== 'project';
    if (this.activeFilter === 'domains') return node.type !== 'domain';
    if (this.activeFilter === 'origins') return node.type !== 'origin';
    return false;
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;

    if (this.draggedNode) {
      this.draggedNode.x = this.mouse.x - this.dragOffset.x;
      this.draggedNode.y = this.mouse.y - this.dragOffset.y;
      this.draggedNode.vx = 0;
      this.draggedNode.vy = 0;
      return;
    }

    const hovered = this.getNodeAt(this.mouse.x, this.mouse.y);
    if (hovered !== this.hoveredNode) {
      this.hoveredNode = hovered;
      this.canvas.style.cursor = hovered ? 'pointer' : 'default';
      this.updateTooltip(e);
    } else if (this.hoveredNode) {
      this.positionTooltip(e);
    }
  }

  onMouseDown(e) {
    if (!this.options.enableDragging) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = this.getNodeAt(x, y);
    if (clicked) {
      this.draggedNode = clicked;
      this.dragOffset.x = x - clicked.x;
      this.dragOffset.y = y - clicked.y;
    }
  }

  onMouseUp() {
    this.draggedNode = null;
  }

  onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clicked = this.getNodeAt(x, y);

    if (clicked && clicked.url) {
      window.location.href = clicked.url;
    }
  }

  onTouchStart(e) {
    if (e.touches.length === 1) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      const node = this.getNodeAt(x, y);
      if (node) {
        e.preventDefault();
        this.hoveredNode = node;
        this.draggedNode = node;
        this.dragOffset.x = x - node.x;
        this.dragOffset.y = y - node.y;
        this.updateTooltip({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }
    }
  }

  onTouchMove(e) {
    if (this.draggedNode && e.touches.length === 1) {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      this.draggedNode.x = (e.touches[0].clientX - rect.left) - this.dragOffset.x;
      this.draggedNode.y = (e.touches[0].clientY - rect.top) - this.dragOffset.y;
      this.draggedNode.vx = 0;
      this.draggedNode.vy = 0;
      this.positionTooltip({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
    }
  }

  onTouchEnd() {
    this.draggedNode = null;
  }

  updateTooltip(e) {
    if (!this.tooltip) return;
    if (!this.hoveredNode) {
      this.tooltip.classList.remove('active');
      return;
    }

    const n = this.hoveredNode;
    this.tooltip.querySelector('.tooltip-badge').textContent = n.badge || n.type.toUpperCase();
    this.tooltip.querySelector('.tooltip-title').textContent = n.label;
    this.tooltip.querySelector('.tooltip-desc').textContent = n.desc || '';
    
    const footer = this.tooltip.querySelector('.tooltip-footer');
    if (n.url) {
      footer.style.display = 'block';
    } else {
      footer.style.display = 'none';
    }

    this.positionTooltip(e);
    this.tooltip.classList.add('active');
  }

  positionTooltip(e) {
    if (!this.tooltip) return;
    const rect = this.container.getBoundingClientRect();
    const tx = e.clientX - rect.left + 16;
    const ty = e.clientY - rect.top + 16;

    // Bounds checking
    const tipWidth = 240;
    const finalX = (tx + tipWidth > this.width) ? (tx - tipWidth - 28) : tx;
    this.tooltip.style.left = `${Math.max(10, finalX)}px`;
    this.tooltip.style.top = `${Math.max(10, ty)}px`;
  }

  stepPhysics() {
    const cx = this.width / 2;
    const cy = this.height / 2;

    // 1. Repulsion between all active nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const n1 = this.nodes[i];
      if (this.isNodeFiltered(n1)) continue;

      for (let j = i + 1; j < this.nodes.length; j++) {
        const n2 = this.nodes[j];
        if (this.isNodeFiltered(n2)) continue;

        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.hypot(dx, dy) || 1;

        if (dist < 260) {
          const force = (this.options.repulsion / (dist * dist));
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (n1 !== this.draggedNode) {
            n1.vx -= fx;
            n1.vy -= fy;
          }
          if (n2 !== this.draggedNode) {
            n2.vx += fx;
            n2.vy += fy;
          }
        }
      }

      // Gentle centering gravity
      const distToCenter = Math.hypot(n1.x - cx, n1.y - cy);
      const gravity = 0.0006 * distToCenter;
      if (n1 !== this.draggedNode) {
        n1.vx += (cx - n1.x) * gravity;
        n1.vy += (cy - n1.y) * gravity;
      }
    }

    // 2. Spring attraction along edges
    for (let i = 0; i < this.edges.length; i++) {
      const edge = this.edges[i];
      const source = this.nodes.find(n => n.id === edge.source);
      const target = this.nodes.find(n => n.id === edge.target);

      if (!source || !target) continue;
      if (this.isNodeFiltered(source) || this.isNodeFiltered(target)) continue;

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.hypot(dx, dy) || 1;
      const targetDist = this.options.springLength * (edge.weight || 1);
      const delta = dist - targetDist;
      const force = delta * this.options.springK;

      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      if (source !== this.draggedNode) {
        source.vx += fx;
        source.vy += fy;
      }
      if (target !== this.draggedNode) {
        target.vx -= fx;
        target.vy -= fy;
      }
    }

    // 3. Update positions with damping and canvas boundary walls
    const padding = 32;
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      if (n === this.draggedNode) continue;

      n.x += n.vx;
      n.y += n.vy;
      n.vx *= this.options.damping;
      n.vy *= this.options.damping;

      // Keep within boundaries
      if (n.x < padding) { n.x = padding; n.vx *= -0.5; }
      if (n.x > this.width - padding) { n.x = this.width - padding; n.vx *= -0.5; }
      if (n.y < padding) { n.y = padding; n.vy *= -0.5; }
      if (n.y > this.height - padding) { n.y = this.height - padding; n.vy *= -0.5; }
    }
  }

  render() {
    this.stepPhysics();
    this.ctx.clearRect(0, 0, this.width, this.height);

    const isConnectedToHovered = (nodeId) => {
      if (!this.hoveredNode) return false;
      if (this.hoveredNode.id === nodeId) return true;
      return this.edges.some(e => 
        (e.source === this.hoveredNode.id && e.target === nodeId) ||
        (e.target === this.hoveredNode.id && e.source === nodeId)
      );
    };

    // 1. Draw Connecting Edges
    for (let i = 0; i < this.edges.length; i++) {
      const e = this.edges[i];
      const source = this.nodes.find(n => n.id === e.source);
      const target = this.nodes.find(n => n.id === e.target);

      if (!source || !target) continue;
      if (this.isNodeFiltered(source) || this.isNodeFiltered(target)) continue;

      const isHighlighted = this.hoveredNode && 
        (this.hoveredNode.id === source.id || this.hoveredNode.id === target.id);

      let alpha = 0.22;
      let lineWidth = 1.0;

      if (this.hoveredNode) {
        if (isHighlighted) {
          alpha = 0.85;
          lineWidth = 2.0;
        } else {
          alpha = 0.06;
        }
      }

      this.ctx.beginPath();
      this.ctx.moveTo(source.x, source.y);
      this.ctx.lineTo(target.x, target.y);
      this.ctx.strokeStyle = isHighlighted 
        ? `rgba(184, 134, 59, ${alpha})` 
        : `rgba(28, 27, 24, ${alpha})`;
      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();
    }

    // 2. Draw Nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      if (this.isNodeFiltered(n)) continue;

      const isHovered = this.hoveredNode === n;
      const isNeighbor = isConnectedToHovered(n.id);
      let alpha = 1;

      if (this.hoveredNode && !isHovered && !isNeighbor) {
        alpha = 0.35;
      }

      // Outer glow on hover or neighbor
      if (isHovered || isNeighbor) {
        this.ctx.fillStyle = `rgba(184, 134, 59, ${isHovered ? 0.2 : 0.08})`;
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, n.radius + (isHovered ? 8 : 4), 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Node Surface
      if (n.type === 'domain') {
        this.ctx.fillStyle = `rgba(184, 134, 59, ${alpha * 0.95})`;
      } else if (n.type === 'origin') {
        this.ctx.fillStyle = `rgba(74, 99, 117, ${alpha * 0.9})`; // Slate
      } else {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      }

      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Border
      this.ctx.strokeStyle = n.type === 'domain'
        ? `rgba(28, 27, 24, ${alpha * 0.4})`
        : `rgba(184, 134, 59, ${alpha * 0.85})`;
      this.ctx.lineWidth = isHovered ? 2.2 : 1.4;
      this.ctx.stroke();

      // Label below node
      this.ctx.font = n.type === 'domain' 
        ? '600 12px "Georgia", serif' 
        : '500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      this.ctx.fillStyle = `rgba(28, 27, 24, ${alpha * 0.92})`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(n.label, n.x, n.y + n.radius + 14);
    }

    this.animId = requestAnimationFrame(this.render.bind(this));
  }

  start() {
    if (!this.animId) {
      this.animId = requestAnimationFrame(this.render.bind(this));
    }
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mouseup', this.handleMouseUp);
    if (this.tooltip && this.tooltip.parentElement) {
      this.tooltip.parentElement.removeChild(this.tooltip);
    }
  }
}

// Global attachment
window.LinkVisualizer = LinkVisualizer;
