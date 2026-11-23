// Designed multi-page PDF (no dependencies) — echoes the site:
// blush pages, candy top bands, score ring, lavender section cards,
// alternating rows, and real color swatches for palette answers.
const PDF = (() => {
  const PINK = [1, 0.435, 0.647], PINKDK = [0.78, 0.2, 0.42], LAV = [0.71, 0.58, 1],
        INK = [0.29, 0.25, 0.3], MUTED = [0.6, 0.545, 0.62], WHITE = [1, 1, 1],
        BLUSH = [1, 0.976, 0.984], ROWA = [1, 0.94, 0.965], PEACH = [1, 0.72, 0.42],
        MINT = [0.5, 0.89, 0.76], CARDBD = [1, 0.83, 0.9];
  const R = (n) => Math.round(n * 100) / 100;
  const FC = (c) => `${R(c[0])} ${R(c[1])} ${R(c[2])} rg`;
  const SC = (c) => `${R(c[0])} ${R(c[1])} ${R(c[2])} RG`;
  // Helvetica/WinAnsi can't do emoji — strip anything outside Latin-1.
  function clean(s) { return String(s == null ? '' : s).replace(/[^\x20-\xFF]/g, '').replace(/\s+/g, ' ').trim(); }
  function esc(s) { return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)'); }
  function T(s) { return esc(clean(s)); }
  function hex(h) {
    const m = /^#?([0-9a-f]{6})$/i.exec(h || '');
    if (!m) return null;
    const v = parseInt(m[1], 16);
    return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
  }
  function wrap(s, n) {
    const words = (s || '').split(' ').filter(Boolean); const rows = []; let cur = '';
    for (const w of words) { if ((cur + ' ' + w).trim().length > n) { rows.push(cur.trim()); cur = w; } else cur = cur ? cur + ' ' + w : w; }
    if (cur.trim()) rows.push(cur.trim());
    return rows.length ? rows : [''];
  }

  let pages, cur, y, firstPage;
  function newPage() {
    cur = []; pages.push(cur); y = 790;
    rect(0, 0, 595, 842, BLUSH);
    if (!firstPage) { rect(0, 828, 595, 14, PINK); firstPage = true; }
    else { rect(0, 828, 595, 8, LAV); }
  }
  function rect(x, yy, w, h, fill, stroke, lw) {
    if (fill) cur.push(`${FC(fill)} ${R(x)} ${R(yy)} ${R(w)} ${R(h)} re f`);
    if (stroke) cur.push(`${SC(stroke)} ${R(lw || 1)} w ${R(x)} ${R(yy)} ${R(w)} ${R(h)} re S`);
  }
  function rrect(x, yy, w, h, r, fill, stroke, lw) {
    // Rounded rectangle via 4 Bezier corners (PDF has no round-rect primitive).
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    if (r <= 0.5) { rect(x, yy, w, h, fill, stroke, lw); return; }
    const k = 0.5523 * r;
    const x0 = x, x1 = x + w, y0 = yy, y1 = yy + h;
    let op = '';
    if (fill) op += FC(fill) + ' ';
    if (stroke) op += `${SC(stroke)} ${R(lw || 1)} w `;
    cur.push(`${op}${R(x0 + r)} ${R(y0)} m ` +
      `${R(x1 - r)} ${R(y0)} l ` +
      `${R(x1 - r + k)} ${R(y0)} ${R(x1)} ${R(y0 + r - k)} ${R(x1)} ${R(y0 + r)} c ` +
      `${R(x1)} ${R(y1 - r)} l ` +
      `${R(x1)} ${R(y1 - r + k)} ${R(x1 - r + k)} ${R(y1)} ${R(x1 - r)} ${R(y1)} c ` +
      `${R(x0 + r)} ${R(y1)} l ` +
      `${R(x0 + r - k)} ${R(y1)} ${R(x0)} ${R(y1 - r + k)} ${R(x0)} ${R(y1 - r)} c ` +
      `${R(x0)} ${R(y0 + r)} l ` +
      `${R(x0)} ${R(y0 + r - k)} ${R(x0 + r - k)} ${R(y0)} ${R(x0 + r)} ${R(y0)} c ` +
      `${(fill && stroke) ? 'B' : fill ? 'f' : 'S'}`);
  }
  function text(str, size, color, x, yy) { cur.push(`BT /F1 ${size} Tf ${FC(color)} ${R(x)} ${R(yy)} Td (${str}) Tj ET`); }
  function circle(cx, cy, r, fill) {
    const k = 0.5523 * r;
    cur.push(`${FC(fill)} ${R(cx + r)} ${R(cy)} m ` +
      `${R(cx + r)} ${R(cy + k)} ${R(cx + k)} ${R(cy + r)} ${R(cx)} ${R(cy + r)} c ` +
      `${R(cx - k)} ${R(cy + r)} ${R(cx - r)} ${R(cy + k)} ${R(cx - r)} ${R(cy)} c ` +
      `${R(cx - r)} ${R(cy - k)} ${R(cx - k)} ${R(cy - r)} ${R(cx)} ${R(cy - r)} c ` +
      `${R(cx + k)} ${R(cy - r)} ${R(cx + r)} ${R(cy - k)} ${R(cx + r)} ${R(cy)} c f`);
  }
  function room(h) { if (y - h < 60) newPage(); }
  function approxW(str, size) { return str.length * size * 0.52; }

  const QMAP = {};
  function qdef(id) {
    if (!QMAP.built) {
      for (const s of SECTIONS) for (const q of s.questions) QMAP[q.id] = { q, sec: s };
      QMAP.built = true;
    }
    return QMAP[id];
  }
  function singleLabel(f, val) {
    const o = (f.options || []).find(o => String(o.value) === String(val));
    return o ? o.label : val;
  }
  const LEVEL_LABELS = { native: 'Native', fluent: 'Fluent', conversational: 'Conversational', learning: 'Learning', weekly: 'Weekly', monthly: 'Monthly', rarely: 'Few times a year', want_try: 'Want to try', watching: 'Just watching' };
  const levelLabel = (v) => LEVEL_LABELS[String(v)] || String(v == null ? '' : v);
  function renderGroup(q, ans, x0) {
    const lines = []; // {t} text lines or {swatch:{color,label}, prefix}
    for (const f of (q.fields || [])) {
      const v = ans ? ans[f.key] : undefined;
      if (v == null || v === '' || (Array.isArray(v) && !v.length)) continue;
      if (f.showIf && ans && String(ans[f.showIf.key]) !== String(f.showIf.value)) continue;
      if (f.kind === 'single' || f.kind === 'number' || f.kind === 'text') {
        lines.push({ t: `${f.label}: ${singleLabel(f, v)}` });
      } else if (f.kind === 'select') {
        lines.push({ t: `${f.label}: ${singleLabel(f, v)}` });
      } else if (f.kind === 'palette') {
        const o = (f.options || []).find(o => String(o.value) === String(v));
        lines.push({ swatch: { color: o && o.color ? hex(o.color) : null, label: o ? o.label : String(v) }, prefix: f.label + ': ' });
      } else if (f.kind === 'langrows' || f.kind === 'sportrows') {
        const list = f.languages || f.sports || [];
        const parts = (Array.isArray(v) ? v : []).map(r => {
          const p = String(r).split('|');
          const o = list.find(o => String(o.value) === p[0]);
          return (o ? o.label : p[0]) + (p[1] ? ` (${levelLabel(p[1])})` : '');
        });
        if (parts.length) lines.push({ t: `${f.label}: ${parts.join(' | ')}` });
      } else if (f.kind === 'multi') {
        const arr = Array.isArray(v) ? v : [v];
        lines.push({ t: `${f.label}: ${arr.map(x => singleLabel(f, x)).join(', ')}` });
      } else {
        lines.push({ t: `${f.label}: ${Array.isArray(v) ? v.join(', ') : v}` });
      }
    }
    return lines;
  }

  function answerBlock(qid) {
    const info = qdef(qid);
    if (!info) return [{ t: '(unknown question)' }];
    const q = info.q, ans = window.__answers ? window.__answers[qid] : undefined;
    if (ans == null) return [{ t: '(no answer)' }];
    if (typeof ans === 'object' && ans.__skipped) return [{ t: '(question skipped)' }];
    if (q.type === 'single') {
      const o = (q.options || []).find(o => String(o.value) === String(ans));
      return [{ t: o ? o.label : String(ans) }];
    }
    if (q.type === 'multi') {
      const arr = Array.isArray(ans) ? ans : [ans];
      return [{ t: arr.map(v => { const o = (q.options || []).find(o => String(o.value) === String(v)); return o ? o.label : String(v); }).join(' | ') }];
    }
    if (q.type === 'group') return renderGroup(q, ans);
    return [{ t: String(ans) }];
  }

  function drawLine(line, x) {
    // returns height used
    if (line.swatch) {
      const labelLines = wrap(clean(line.swatch.label), 60);
      const h = labelLines.length * 12.5 + 7.5;
      room(h);
      text(T(line.prefix), 9.5, MUTED, x, y);
      const px = x + approxW(clean(line.prefix), 9.5) + 6;
      if (line.swatch.color) circle(px + 7, y + 3.5, 7, line.swatch.color);
      text(T(labelLines[0] || ''), 9.5, INK, px + 18, y);
      y -= 12.5;
      for (let i = 1; i < labelLines.length; i++) { text(T(labelLines[i]), 9.5, INK, x + 24, y); y -= 12.5; }
      y -= 4;
      return h;
    }
    const parts = wrap(clean(line.t), 88);
    room(parts.length * 12.5 + 4);
    for (const ln of parts) { text(T(ln), 9.5, INK, x, y); y -= 12.5; }
    y -= 4;
    return parts.length * 12.5 + 4;
  }

  function build(display) {
    pages = []; firstPage = false; newPage();
    // hero bands + title
    rect(0, 814, 595, 14, PEACH);
    rect(0, 806, 595, 8, MINT);
    text(T('Compatibility Journey'), 26, PINK, 50, 764);
    const sub = wrap('A friendly compatibility quiz result. Generated locally in the browser - it holds only the answers given.', 90);
    let sy = 742;
    for (const ln of sub) { text(T(ln), 10.5, MUTED, 50, sy); sy -= 15; }
    const gdpr = wrap('Privacy notice (GDPR): by sending this result, you agree that your answers and any attached file will be emailed to the site owner and stored in their mailbox. You can request deletion at any time. Only share what you are comfortable sharing.', 90);
    for (const ln of gdpr) { text(T(ln), 8.5, MUTED, 50, sy); sy -= 12; }
    sy -= 2;
    const metaLine = `Generated ${new Date().toISOString().slice(0, 10)} · Score ${display} / 100 · Contact TomiWebPro@gmail.com`;
    text(T(metaLine), 8.5, MUTED, 50, sy); sy -= 14;
    sy -= 4;
    // score ring
    const cx = 297, cy = sy - 72;
    circle(cx, cy, 48, PINK);
    circle(cx, cy, 36, WHITE);
    const sTxt = `${display}`;
    text(T(sTxt), 26, PINK, cx - approxW(sTxt, 26) / 2, cy - 2);
    const cap = 'pairing / 100';
    text(T(cap), 9, MUTED, cx - approxW(cap, 9) / 2, cy - 22);
    y = cy - 70;

    let n = 0;
    for (const sec of SECTIONS) {
      room(64);
      rrect(46, y - 10, 503, 32, 9, LAV);
      text(T(`${sec.emoji}  ${sec.title}`), 13, WHITE, 60, y - 2);
      y -= 38;
      for (const q of sec.questions) {
        const block = answerBlock(q.id);
        // measure (must match drawLine)
        let h = 20;
        for (const ln of block) {
          h += ln.swatch ? (wrap(clean(ln.swatch.label), 60).length * 12.5 + 7.5) : wrap(clean(ln.t), 88).length * 12.5 + 4;
        }
        room(h + 10);
        rrect(46, y - h + 2, 503, h + 6, 8, n % 2 ? WHITE : ROWA, CARDBD, 1);
        text(T(q.id + '  ' + clean(q.title)), 10.5, PINKDK, 60, y - 4);
        y -= 22;
        for (const ln of block) drawLine(ln, 72);
        y -= 8;
        n++;
      }
      y -= 6;
    }
    pages.forEach((pg, i) => {
      const keep = cur; cur = pg;
      text(T(`Page ${i + 1} / ${pages.length}  -  Compatibility Journey, generated locally`), 8, MUTED, 50, 28);
      cur = keep;
    });

    const objs = [''];
    objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
    const kids = []; let oi = 3;
    const streams = pages.map(p => p.join('\n'));
    pages.forEach((pg, i) => {
      const pageOi = oi++, contOi = oi++;
      kids.push(pageOi + ' 0 R');
      objs[pageOi] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${contOi} 0 R /Resources << /Font << /F1 ${oi} 0 R >> >> >>`;
      objs[contOi] = `<< /Length ${streams[i].length} >>\nstream\n${streams[i]}\nendstream`;
    });
    const fontOi = oi++;
    objs[2] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages.length} >>`;
    objs[fontOi] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
    const infoOi = oi++;
    objs[infoOi] = '<< /Title (Compatibility Journey result) /Creator (Compatibility Journey, generated locally) >>';
    let out = '%PDF-1.4\n';
    const offs = {};
    for (let i = 1; i <= infoOi; i++) { offs[i] = out.length; out += `${i} 0 obj\n${objs[i]}\nendobj\n`; }
    const xref = out.length, total = infoOi + 1;
    out += `xref\n0 ${total}\n0000000000 65535 f \n`;
    for (let i = 1; i <= infoOi; i++) out += String(offs[i]).padStart(10, '0') + ' 00000 n \n';
    out += `trailer\n<< /Size ${total} /Root 1 0 R /Info ${infoOi} 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return new Blob([out], { type: 'application/pdf' });
  }

  function download(displayScore) {
    const blob = build(displayScore);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'compatibility-result.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }
  return { download, build };
})();
