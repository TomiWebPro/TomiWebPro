/**
 * tomiweb.pro — Spatial 3D Engine & Interactive Canvas
 * Subtle, high-craft 60fps orbital wireframe constellation + card tilt
 * Zero dependencies, respects prefers-reduced-motion.
 */

(function () {
  'use strict';

  // Check reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const canvas = document.getElementById('spatial-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;

  // Mouse & Scroll Tracking with Spring Damping
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, speed: 0.045 };
  let scrollY = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.parentElement.offsetHeight || window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouse.targetX = (e.clientX - cx) / (rect.width / 2);
    mouse.targetY = (e.clientY - cy) / (rect.height / 2);
  }, { passive: true });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });

  // 3D Point & Lattice Generation
  // An elegant revolving 3D wireframe icosahedron / constellation
  const nodes = [];
  const numNodes = 36;
  const radius = Math.min(width, height) * 0.32;

  // Fibonacci sphere distribution
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < numNodes; i++) {
    const y = 1 - (i / (numNodes - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    nodes.push({ x: x * radius, y: y * radius, z: z * radius, origX: x, origY: y, origZ: z });
  }

  let angleX = 0.3;
  let angleY = 0.4;

  function render() {
    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * mouse.speed;
    mouse.y += (mouse.targetY - mouse.y) * mouse.speed;

    ctx.clearRect(0, 0, width, height);

    // Dynamic rotation from time, mouse, and scroll
    angleY += 0.0025 + mouse.x * 0.003;
    angleX = 0.2 + mouse.y * 0.35 + (scrollY * 0.0004);

    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);

    const centerX = width * 0.72; // Position on the right side of hero
    const centerY = height * 0.48;

    const projected = [];

    // Project 3D to 2D
    for (let i = 0; i < nodes.length; i++) {
      const p = nodes[i];

      // Rotate around Y
      let x1 = p.origX * radius * cosY - p.origZ * radius * sinY;
      let z1 = p.origZ * radius * cosY + p.origX * radius * sinY;

      // Rotate around X
      let y1 = p.origY * radius * cosX - z1 * sinX;
      let z2 = z1 * cosX + p.origY * radius * sinX;

      // Perspective projection
      const fov = 480;
      const scale = fov / (fov + z2 + radius);
      const px = centerX + x1 * scale;
      const py = centerY + y1 * scale;

      projected.push({ x: px, y: py, z: z2, scale: scale });
    }

    // Draw connecting wireframe lines between close nodes
    ctx.lineWidth = 0.85;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx = projected[i].x - projected[j].x;
        const dy = projected[i].y - projected[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius * 0.65) {
          const alpha = (1 - dist / (radius * 0.65)) * 0.28;
          ctx.strokeStyle = `rgba(184, 134, 59, ${alpha})`; // Brushed champagne gold
          ctx.beginPath();
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw node vertices
    for (let i = 0; i < projected.length; i++) {
      const pt = projected[i];
      const nodeAlpha = Math.max(0.15, Math.min(0.85, (pt.z + radius) / (radius * 2)));
      
      ctx.fillStyle = `rgba(184, 134, 59, ${nodeAlpha * 0.9})`;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, Math.max(1.5, 3.2 * pt.scale), 0, Math.PI * 2);
      ctx.fill();

      // Soft outer ring for depth
      ctx.strokeStyle = `rgba(28, 27, 24, ${nodeAlpha * 0.15})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, Math.max(3, 6 * pt.scale), 0, Math.PI * 2);
      ctx.stroke();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  // 3D Perspective Card Tilt on Hover
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

  // Domain Anchor Highlights
  const domainPills = document.querySelectorAll('.domain-pill');
  domainPills.forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      const targetCategory = pill.getAttribute('data-target');
      if (targetCategory) {
        document.querySelectorAll(`.project-item`).forEach(item => {
          if (item.getAttribute('data-category') === targetCategory) {
            item.style.borderColor = 'var(--gold)';
            item.style.boxShadow = 'var(--shadow-lift)';
          }
        });
      }
    });

    pill.addEventListener('mouseleave', () => {
      document.querySelectorAll(`.project-item`).forEach(item => {
        item.style.borderColor = '';
        item.style.boxShadow = '';
      });
    });
  });
})();
