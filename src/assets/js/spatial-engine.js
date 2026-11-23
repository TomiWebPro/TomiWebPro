/**
 * tomiweb.pro — Spatial 3D Engine & Interactive Visual Canvas (Refactored)
 * Multi-mode 60fps spatial visualizer with ambient depth, particle constellations,
 * gyroscopic orbital rings, and dynamic cursor-reactive fields.
 * Zero external dependencies. Respects prefers-reduced-motion.
 */

class SpatialEngine {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.options = Object.assign({
      mode: 'lattice', // 'lattice', 'gyroscope', 'field'
      numNodes: 42,
      numDust: 35,
      interactive: true,
      autoRotate: true,
      enableAura: true,
      accentColor: '184, 134, 59', // champagne gold #B8863B
      inkColor: '28, 27, 24'        // warm charcoal #1C1B18
    }, options);

    this.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.prefersReduced) return;

    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.animId = null;

    // Mouse, scroll, and dampening physics
    this.mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      rawX: 0,
      rawY: 0,
      speed: 0.045,
      isHovered: false
    };
    this.scrollY = 0;

    // Geometric angles & time
    this.angleX = 0.28;
    this.angleY = 0.42;
    this.time = 0;

    // Click ripples
    this.ripples = [];

    // Geometry data
    this.nodes = [];
    this.dust = [];
    this.gyroRings = [];
    this.fieldPoints = [];

    this.init();
  }

  init() {
    this.handleResize = this.resize.bind(this);
    this.handleMouseMove = this.onMouseMove.bind(this);
    this.handleScroll = this.onScroll.bind(this);
    this.handleClick = this.onClick.bind(this);

    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.canvas.addEventListener('click', this.handleClick);

    this.resize();
    this.generateGeometry();
    this.initCardTilt();
    this.initDomainAnchors();
    this.start();
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parent = this.canvas.parentElement;
    this.width = parent ? parent.offsetWidth : window.innerWidth;
    this.height = parent ? parent.offsetHeight : window.innerHeight;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    this.radius = Math.min(this.width, this.height) * 0.32;
    this.generateGeometry();
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    this.mouse.rawX = e.clientX - rect.left;
    this.mouse.rawY = e.clientY - rect.top;

    this.mouse.targetX = (e.clientX - cx) / (rect.width / 2);
    this.mouse.targetY = (e.clientY - cy) / (rect.height / 2);

    this.mouse.isHovered = (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );
  }

  onScroll() {
    this.scrollY = window.scrollY;
  }

  onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.ripples.push({
      x: x,
      y: y,
      radius: 4,
      maxRadius: Math.min(this.width, this.height) * 0.45,
      alpha: 0.65,
      speed: 4.5
    });
  }

  setMode(newMode) {
    if (['lattice', 'gyroscope', 'field'].includes(newMode)) {
      this.options.mode = newMode;
      this.generateGeometry();
      
      // Update UI buttons if present
      document.querySelectorAll('[data-spatial-mode]').forEach(btn => {
        if (btn.getAttribute('data-spatial-mode') === newMode) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  generateGeometry() {
    const r = this.radius || 200;

    // 1. Lattice: Fibonacci Sphere
    this.nodes = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < this.options.numNodes; i++) {
      const y = 1 - (i / (this.options.numNodes - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      this.nodes.push({
        origX: x,
        origY: y,
        origZ: z,
        pulseSpeed: 0.8 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2
      });
    }

    // 2. Ambient Floating Depth Dust
    this.dust = [];
    for (let i = 0; i < this.options.numDust; i++) {
      this.dust.push({
        x: (Math.random() - 0.5) * this.width * 1.5,
        y: (Math.random() - 0.5) * this.height * 1.5,
        z: (Math.random() - 0.5) * 600,
        size: 1 + Math.random() * 2,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35,
        alpha: 0.15 + Math.random() * 0.35
      });
    }

    // 3. Gyroscope Rings
    this.gyroRings = [
      { radius: r * 1.15, tiltX: 0.4, tiltZ: 0.2, numPoints: 36, speed: 0.008, color: 'rgba(184, 134, 59, 0.45)' },
      { radius: r * 0.85, tiltX: -0.6, tiltZ: 0.5, numPoints: 28, speed: -0.012, color: 'rgba(184, 134, 59, 0.35)' },
      { radius: r * 0.55, tiltX: 0.8, tiltZ: -0.4, numPoints: 20, speed: 0.015, color: 'rgba(184, 134, 59, 0.55)' }
    ];

    // 4. Spatial Wave Field
    this.fieldPoints = [];
    const cols = 14;
    const rows = 10;
    const spacingX = (this.width * 0.75) / cols;
    const spacingY = (this.height * 0.6) / rows;
    for (let ix = 0; ix < cols; ix++) {
      for (let iy = 0; iy < rows; iy++) {
        this.fieldPoints.push({
          gridX: (ix - cols / 2) * spacingX,
          gridY: (iy - rows / 2) * spacingY,
          origZ: 0,
          distFromCenter: Math.hypot(ix - cols / 2, iy - rows / 2)
        });
      }
    }
  }

  render() {
    this.time += 0.02;

    // Smooth mouse spring interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * this.mouse.speed;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * this.mouse.speed;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Dynamic rotation from time, mouse, and scroll
    this.angleY += 0.0028 + this.mouse.x * 0.0035;
    this.angleX = 0.22 + this.mouse.y * 0.32 + (this.scrollY * 0.00035);

    // Center location on canvas (balanced slightly toward right side for hero text)
    const centerX = this.width > 768 ? this.width * 0.72 : this.width * 0.5;
    const centerY = this.height * 0.48;

    // 1. Draw Ambient Cursor Aura
    if (this.options.enableAura && this.mouse.isHovered) {
      const aura = this.ctx.createRadialGradient(
        this.mouse.rawX, this.mouse.rawY, 10,
        this.mouse.rawX, this.mouse.rawY, Math.min(this.width, this.height) * 0.45
      );
      aura.addColorStop(0, `rgba(${this.options.accentColor}, 0.09)`);
      aura.addColorStop(0.5, `rgba(${this.options.accentColor}, 0.03)`);
      aura.addColorStop(1, 'rgba(247, 243, 234, 0)');
      this.ctx.fillStyle = aura;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // 2. Render Floating Ambient Depth Particles (Dust)
    this.renderDust(centerX, centerY);

    // 3. Render Current Geometric Visual Mode
    if (this.options.mode === 'lattice') {
      this.renderLattice(centerX, centerY);
    } else if (this.options.mode === 'gyroscope') {
      this.renderGyroscope(centerX, centerY);
    } else if (this.options.mode === 'field') {
      this.renderField(centerX, centerY);
    }

    // 4. Render Active Click Ripples
    this.renderRipples();

    this.animId = requestAnimationFrame(this.render.bind(this));
  }

  renderDust(cx, cy) {
    for (let i = 0; i < this.dust.length; i++) {
      const d = this.dust[i];
      d.x += d.speedX;
      d.y += d.speedY;

      if (d.x < -this.width * 0.75) d.x = this.width * 0.75;
      if (d.x > this.width * 0.75) d.x = -this.width * 0.75;
      if (d.y < -this.height * 0.75) d.y = this.height * 0.75;
      if (d.y > this.height * 0.75) d.y = -this.height * 0.75;

      const px = cx + d.x + this.mouse.x * 25;
      const py = cy + d.y + this.mouse.y * 25;

      this.ctx.fillStyle = `rgba(${this.options.accentColor}, ${d.alpha * 0.4})`;
      this.ctx.beginPath();
      this.ctx.arc(px, py, d.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  renderLattice(centerX, centerY) {
    const cosX = Math.cos(this.angleX);
    const sinX = Math.sin(this.angleX);
    const cosY = Math.cos(this.angleY);
    const sinY = Math.sin(this.angleY);
    const r = this.radius;

    const projected = [];
    const fov = 480;

    // Project 3D nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const p = this.nodes[i];

      // Subtle organic breathing pulse
      const pulse = 1 + Math.sin(this.time * p.pulseSpeed + p.phase) * 0.04;
      const pr = r * pulse;

      // Rotate around Y
      let x1 = p.origX * pr * cosY - p.origZ * pr * sinY;
      let z1 = p.origZ * pr * cosY + p.origX * pr * sinY;

      // Rotate around X
      let y1 = p.origY * pr * cosX - z1 * sinX;
      let z2 = z1 * cosX + p.origY * pr * sinX;

      // Perspective
      const scale = fov / (fov + z2 + r);
      const px = centerX + x1 * scale;
      const py = centerY + y1 * scale;

      projected.push({ x: px, y: py, z: z2, scale: scale, index: i });
    }

    // Draw connecting edges
    this.ctx.lineWidth = 0.9;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx = projected[i].x - projected[j].x;
        const dy = projected[i].y - projected[j].y;
        const dist = Math.hypot(dx, dy);
        const threshold = r * 0.68;

        if (dist < threshold) {
          const alpha = (1 - dist / threshold) * 0.32;
          this.ctx.strokeStyle = `rgba(${this.options.accentColor}, ${alpha})`;
          this.ctx.beginPath();
          this.ctx.moveTo(projected[i].x, projected[i].y);
          this.ctx.lineTo(projected[j].x, projected[j].y);
          this.ctx.stroke();
        }
      }
    }

    // Draw node vertices
    for (let i = 0; i < projected.length; i++) {
      const pt = projected[i];
      const nodeAlpha = Math.max(0.18, Math.min(0.9, (pt.z + r) / (r * 2)));

      // Inner glowing vertex
      this.ctx.fillStyle = `rgba(${this.options.accentColor}, ${nodeAlpha * 0.95})`;
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, Math.max(1.8, 3.4 * pt.scale), 0, Math.PI * 2);
      this.ctx.fill();

      // Outer depth halo
      this.ctx.strokeStyle = `rgba(${this.options.inkColor}, ${nodeAlpha * 0.18})`;
      this.ctx.lineWidth = 0.55;
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, Math.max(3.2, 6.2 * pt.scale), 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  renderGyroscope(centerX, centerY) {
    const fov = 480;
    const cosX = Math.cos(this.angleX);
    const sinX = Math.sin(this.angleX);

    // Glowing core nucleus
    const nucleusPulse = 14 + Math.sin(this.time * 2) * 3;
    const coreGrad = this.ctx.createRadialGradient(
      centerX, centerY, 2,
      centerX, centerY, nucleusPulse
    );
    coreGrad.addColorStop(0, `rgba(${this.options.accentColor}, 0.8)`);
    coreGrad.addColorStop(0.5, `rgba(${this.options.accentColor}, 0.25)`);
    coreGrad.addColorStop(1, 'rgba(184, 134, 59, 0)');
    this.ctx.fillStyle = coreGrad;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, nucleusPulse, 0, Math.PI * 2);
    this.ctx.fill();

    // Render each ring
    this.gyroRings.forEach((ring, idx) => {
      const ringAngle = this.angleY * (idx % 2 === 0 ? 1 : -1.2) + (idx * 1.1);
      const cosR = Math.cos(ringAngle);
      const sinR = Math.sin(ringAngle);

      const pts = [];
      for (let i = 0; i < ring.numPoints; i++) {
        const theta = (i / ring.numPoints) * Math.PI * 2;
        let x = Math.cos(theta) * ring.radius;
        let y = Math.sin(theta) * ring.radius * Math.cos(ring.tiltX);
        let z = Math.sin(theta) * ring.radius * Math.sin(ring.tiltX);

        // Apply global mouse tilt & rotation
        let x1 = x * cosR - z * sinR;
        let z1 = z * cosR + x * sinR;
        let y1 = y * cosX - z1 * sinX;
        let z2 = z1 * cosX + y * sinX;

        const scale = fov / (fov + z2 + ring.radius);
        pts.push({
          x: centerX + x1 * scale,
          y: centerY + y1 * scale,
          z: z2,
          scale: scale
        });
      }

      // Draw continuous ring path
      this.ctx.strokeStyle = ring.color;
      this.ctx.lineWidth = 1.1;
      this.ctx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        const next = pts[(i + 1) % pts.length];
        if (i === 0) this.ctx.moveTo(pts[i].x, pts[i].y);
        this.ctx.lineTo(next.x, next.y);
      }
      this.ctx.stroke();

      // Satellite node running along the ring
      const satIndex = Math.floor(((this.time * 20 + idx * 8) % pts.length));
      const satPt = pts[satIndex];
      if (satPt) {
        this.ctx.fillStyle = `rgba(${this.options.accentColor}, 0.95)`;
        this.ctx.beginPath();
        this.ctx.arc(satPt.x, satPt.y, 4 * satPt.scale, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = `rgba(${this.options.inkColor}, 0.3)`;
        this.ctx.lineWidth = 0.8;
        this.ctx.beginPath();
        this.ctx.arc(satPt.x, satPt.y, 7 * satPt.scale, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    });
  }

  renderField(centerX, centerY) {
    const fov = 420;
    const cosX = Math.cos(0.75 + this.mouse.y * 0.2);
    const sinX = Math.sin(0.75 + this.mouse.y * 0.2);
    const cosY = Math.cos(this.angleY * 0.4);
    const sinY = Math.sin(this.angleY * 0.4);

    const projected = [];

    // Project each grid point with harmonic wave motion
    for (let i = 0; i < this.fieldPoints.length; i++) {
      const pt = this.fieldPoints[i];
      const wave = Math.sin(this.time * 1.5 + pt.distFromCenter * 0.45) * 22;

      let x = pt.gridX;
      let y = wave;
      let z = pt.gridY;

      // Rotate
      let x1 = x * cosY - z * sinY;
      let z1 = z * cosY + x * sinY;
      let y1 = y * cosX - z1 * sinX;
      let z2 = z1 * cosX + y * sinX;

      const scale = fov / (fov + z2 + 300);
      projected.push({
        x: centerX + x1 * scale,
        y: centerY + y1 * scale,
        scale: scale,
        z: z2
      });
    }

    // Draw field vertices & connections
    this.ctx.lineWidth = 0.65;
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      const alpha = Math.max(0.12, Math.min(0.65, (p.z + 200) / 400));

      this.ctx.fillStyle = `rgba(${this.options.accentColor}, ${alpha * 0.8})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, Math.max(1.2, 2.6 * p.scale), 0, Math.PI * 2);
      this.ctx.fill();

      // Connect to right neighbor
      if ((i + 1) % 10 !== 0 && i + 1 < projected.length) {
        const next = projected[i + 1];
        this.ctx.strokeStyle = `rgba(${this.options.accentColor}, ${alpha * 0.25})`;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(next.x, next.y);
        this.ctx.stroke();
      }
    }
  }

  renderRipples() {
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rip = this.ripples[i];
      rip.radius += rip.speed;
      rip.alpha -= 0.015;

      if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
        this.ripples.splice(i, 1);
        continue;
      }

      this.ctx.strokeStyle = `rgba(${this.options.accentColor}, ${rip.alpha})`;
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  initCardTilt() {
    const tiltCards = document.querySelectorAll('.card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  initDomainAnchors() {
    const domainPills = document.querySelectorAll('.domain-pill');
    domainPills.forEach(pill => {
      pill.addEventListener('mouseenter', () => {
        const targetCategory = pill.getAttribute('data-target');
        if (targetCategory) {
          document.querySelectorAll('.project-item').forEach(item => {
            if (item.getAttribute('data-category') === targetCategory) {
              item.style.borderColor = 'var(--gold)';
              item.style.boxShadow = 'var(--shadow-lift)';
            }
          });
        }
      });

      pill.addEventListener('mouseleave', () => {
        document.querySelectorAll('.project-item').forEach(item => {
          item.style.borderColor = '';
          item.style.boxShadow = '';
        });
      });
    });
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
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('scroll', this.handleScroll);
    if (this.canvas) {
      this.canvas.removeEventListener('click', this.handleClick);
    }
  }
}

// Global initialization & export
window.SpatialEngine = SpatialEngine;
