// Quiz flow renderer
let answers = {}; window.__answers = answers;
let flat = [];
let idx = 0;
let started = false;

const SVGS = {
  hearts: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="40" font-size="36">💕</text><circle cx="80" cy="15" r="6" fill="#ffd6e8"><animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite"/></circle></svg>`,
  cake: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="42" font-size="36">🎂</text></svg>`,
  flower: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="42" font-size="36">🌷</text><circle cx="75" cy="12" r="5" fill="#fff3b0"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle></svg>`,
  rainbow: `<svg viewBox="0 0 100 60" class="deco"><text x="5" y="42" font-size="34">🌈</text></svg>`,
  ruler: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="42" font-size="34">📏</text></svg>`,
  scale: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="42" font-size="34">⚖️</text></svg>`,
  chat: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="42" font-size="34">🗣️</text></svg>`,
  palette: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="42" font-size="34">🎨</text></svg>`,
  brain: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="42" font-size="34">🧠</text></svg>`,
  access: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="42" font-size="34">🦻</text></svg>`,
  glasses: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="42" font-size="34">👓</text></svg>`,
  globe: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="42" font-size="38">🌍</text></svg>`,
  pin: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="42" font-size="34">📍</text></svg>`,
  briefcase: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="42" font-size="34">💼</text></svg>`,
  chart: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="42" font-size="34">📊</text></svg>`,
  phone: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="42" font-size="34">📱</text></svg>`,
  bird: `<svg viewBox="0 0 100 60" class="deco"><text x="10" y="42" font-size="34">🕊️</text></svg>`,
  default: `<svg viewBox="0 0 100 60" class="deco"><circle cx="20" cy="20" r="8" fill="#ffe5ec"><animate attributeName="cy" values="20;12;20" dur="2.4s" repeatCount="indefinite"/></circle><circle cx="55" cy="30" r="6" fill="#e0f7ff"><animate attributeName="cy" values="30;22;30" dur="2s" repeatCount="indefinite"/></circle><text x="70" y="42" font-size="28">✨</text></svg>`
};
function deco(name) { return SVGS[name] || SVGS.default; }

function buildFlat() {
  flat = [];
  SECTIONS.forEach((sec, si) => sec.questions.forEach((q, qi) => flat.push({ sec, q, si, qi })));
}

function answeredCount() { return Object.keys(answers).length; }
function updateProgress() {
  const fill = document.getElementById('progressFill'), txt = document.getElementById('progressText');
  if (!fill || !txt) return;
  const pct = Math.round(answeredCount() / flat.length * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = pct + '% ' + I18N.t('ui.progressLabel', 'completed');
}

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }

async function init() {
  await I18N.load();
  buildFlat();
  applyStaticText();
  showIntro();
  updateProgress();
}

function applyStaticText() {
  document.getElementById('siteTitle').textContent = I18N.t('ui.siteTitle');
  document.getElementById('siteSubtitle').textContent = I18N.t('ui.siteSubtitle');
}

function showIntro() {
  const box = document.getElementById('card');
  const heroDossier = document.getElementById('heroDossier');
  const prog = document.getElementById('progress');
  if (heroDossier) heroDossier.style.display = 'block';
  if (prog) prog.style.display = 'none';

  box.innerHTML = '';
  box.appendChild(el(`<div class="anim">
    <div class="dossier-pill-header">
      <span class="dossier-badge-pill">Marital Status Fact Sheet</span>
      <span class="dossier-verified-tag">✓ Verified Record</span>
    </div>

    <h2 class="dossier-main-title">Tomi is Untaken — Are You the Love of His Life? 💛</h2>

    <div class="intro-profile-card">
      <div class="dossier-stats-grid">
        <div class="dossier-stat-box">
          <div class="stat-big-val">Untaken</div>
          <div class="stat-small-label">Marital Status (Single)</div>
        </div>
        <div class="dossier-stat-box highlight">
          <div class="stat-big-val">0</div>
          <div class="stat-small-label">Past Relationships (Clean Slate)</div>
        </div>
        <div class="dossier-stat-box">
          <div class="stat-big-val">100%</div>
          <div class="stat-small-label">Genuine Intent</div>
        </div>
      </div>

      <div class="intro-profile-grid">
        <div><strong>Current Status:</strong> Single &amp; Untaken</div>
        <div><strong>Romantic History:</strong> No past relationships (0)</div>
        <div><strong>Looking For:</strong> Long-term partner, deep mutual spark &amp; trust</div>
        <div><strong>Communication:</strong> Direct, low-drama, affectionate, honest</div>
      </div>
    </div>

    <p class="intro-note">
      Tomi is currently untaken and curious whether genuine chemistry exists. This questionnaire evaluates day-to-day rhythms, lifestyle expectations, communication styles, and shared values. Answer honestly — no trick questions!
    </p>

    <div class="dossier-actions-row">
      <button class="btn primary" id="startBtn">See How Compatible You Are With Tomi →</button>
      <a class="btn secondary-outline" href="friend.html">Connect as Friends Instead 🤝</a>
    </div>
  </div>`));

  document.getElementById('startBtn').onclick = () => {
    started = true;
    idx = 0;
    renderQ();
  };
}

function renderQ() {
  const heroDossier = document.getElementById('heroDossier');
  const prog = document.getElementById('progress');
  if (heroDossier) heroDossier.style.display = 'none';
  if (prog) prog.style.display = 'flex';

  const { sec, q } = flat[idx];
  const box = document.getElementById('card');
  box.innerHTML = '';
  const secLabel = `${sec.emoji} Part ${flat[idx].si + 1}/4 · ${sec.title} · Q${idx + 1}/${flat.length}`;
  const wrap = el(`<div class="anim q-container">
    <div class="q-header-row">
      <div class="secLabel">${secLabel}</div>
    </div>
    <h2 class="q-title">${q.emoji} ${q.title}</h2>
    <p class="desc">${q.desc}</p>
    <div class="inputs" id="inputs"></div>
    <div class="nav">
      <button class="btn ghost" id="backBtn">${I18N.t('ui.back')}</button>
      <button class="btn linklike" id="skipBtn">${I18N.t('ui.skip')}</button>
      <button class="btn primary" id="nextBtn">${I18N.t('ui.next')}</button>
    </div>
  </div>`);
  box.appendChild(wrap);
  renderInputs(document.getElementById('inputs'), q);
  document.getElementById('backBtn').onclick = () => { if (idx > 0) { idx--; renderQ(); } else showIntro(); updateProgress(); };
  document.getElementById('skipBtn').onclick = () => { answers[q.id] = { __skipped: true }; afterAnswer(); };
  document.getElementById('nextBtn').onclick = () => {
    const v = collectInputs(q);
    if (v === null) { shake(); return; }
    answers[q.id] = v; window.__answers = answers;
    afterAnswer();
  };
  updateProgress();
}

function afterAnswer() {
  const cur = flat[idx];
  // friend-only redirect
  if (cur.q.id === 'b1' && answers['b1'] === 'friends_only') { showFriend(); return; }
  // section gate?
  const isLastOfSection = cur.qi === cur.sec.questions.length - 1;
  if (isLastOfSection) {
    const r = Scoring.scoreAll(answers);
    if (r.hard[cur.sec.id]) { showGate(); return; }
  }
  if (idx + 1 >= flat.length) { showResult(); return; }
  idx++; renderQ();
}

function showFriend() {
  const box = document.getElementById('card');
  box.innerHTML = `<div class="anim">${deco('default')}<h2>🤝 Friends only?</h2>
    <p>${I18N.t('ui.friendNote')}</p>
    <p><a class="btn primary" href="friend.html">🤝 ${I18N.t('ui.friendButton')}</a></p>
    <p><button class="btn ghost" id="backBtn2">${I18N.t('ui.back')}</button></p></div>`;
  document.getElementById('backBtn2').onclick = () => renderQ();
}

function showGate() {
  const box = document.getElementById('card');
  box.innerHTML = `<div class="anim">${deco('default')}<h2>${I18N.t('ui.sectionGateTitle')}</h2>
    <p>${I18N.t('ui.sectionGateBody')}</p>
    <p><button class="btn primary" id="pdfBtn">📄 ${I18N.t('ui.downloadPdf')}</button></p>
    <p class="muted">📧 ${I18N.t('ui.contactEmailLabel')}: <b>TomiWebPro@gmail.com</b> — feel free to send an invite with your result!</p></div>`;
  document.getElementById('pdfBtn').onclick = () => PDF.download(0);
}

function showResult() {
  const r = Scoring.scoreAll(answers);
  window.__score = r;
  const box = document.getElementById('card');
  const high = r.internal > 75;
  box.innerHTML = `<div class="anim resultCard" id="resultCard">${deco('hearts')}
    <h2 class="fadeUp">${high ? I18N.t('ui.resultHighTitle') : I18N.t('ui.resultLowTitle')}</h2>
    <div class="scoreRing${high ? ' glow' : ''}"><div class="scoreHole"><div class="scoreVal"><span id="scoreNum">0</span>%</div><small>pairing · 0–100</small></div></div>
    <p class="fadeUp" style="animation-delay:.15s">${high ? I18N.t('ui.resultHighBody') : I18N.t('ui.resultLowBody')}</p>
    <p class="fadeUp" style="animation-delay:.25s"><button class="btn primary" id="pdfBtn2">📄 ${I18N.t('ui.downloadPdf')}</button></p>
    <p class="muted fadeUp" style="animation-delay:.35s">🔒 ${I18N.t('ui.gdprNotice')}</p>
    <p class="muted fadeUp" style="animation-delay:.45s">📧 ${I18N.t('ui.contactEmailLabel')}: <b>TomiWebPro@gmail.com</b></p>
    <div id="contactZone"></div></div>`;
  document.getElementById('pdfBtn2').onclick = () => PDF.download(r.display);
  // count-up score
  const numEl = document.getElementById('scoreNum'), target = r.display, t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / 1300), e = 1 - Math.pow(1 - p, 3);
    numEl.textContent = Math.round(target * e);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  // festive pieces for high scores, gentle hearts otherwise
  const card = document.getElementById('resultCard');
  const cols = ['#ff6fa5', '#ffb86b', '#7fe3c3', '#7cc7ff', '#c5a3ff', '#ffe066'];
  const bits = high ? 42 : 0;
  for (let i = 0; i < bits; i++) {
    const c = document.createElement('span');
    c.className = 'confetti';
    const sz = 6 + Math.random() * 7;
    c.style.cssText = `left:${Math.random() * 100}%;width:${sz}px;height:${sz * (Math.random() > .5 ? 1 : .5)}px;background:${cols[i % cols.length]};animation-duration:${2.4 + Math.random() * 2}s;animation-delay:${Math.random() * 1.2}s;`;
    card.appendChild(c);
    setTimeout(() => c.remove(), 5200);
  }
  for (let i = 0; i < 6; i++) {
    const h = document.createElement('span');
    h.className = 'floatHeart';
    h.textContent = high ? '💖' : '🌷';
    h.style.cssText = `left:${8 + Math.random() * 84}%;font-size:${14 + Math.random() * 14}px;animation-duration:${5 + Math.random() * 5}s;animation-delay:${Math.random() * 4}s;`;
    card.appendChild(h);
  }
  const cz = document.getElementById('contactZone');
  if (high) renderContact(cz, r);
  else {
    cz.innerHTML = `<p class="fadeUp" style="animation-delay:.55s">🍀 Send an invite to <b>TomiWebPro@gmail.com</b>, preferably with your result PDF attached!</p>`;
  }
}

function renderContact(zone, r) {
  zone.appendChild(el(`<div class="contact">
    <h3 class="fadeUp">💌 Make contact</h3>
    <input class="fadeUp" style="animation-delay:.1s" id="cName" placeholder="${I18N.t('ui.namePlaceholder')}" />
    <input class="fadeUp" style="animation-delay:.18s" id="cContact" placeholder="${I18N.t('ui.contactPlaceholder')}" />
    <textarea class="fadeUp" style="animation-delay:.26s" id="cMsg" rows="6" placeholder="${I18N.t('ui.messagePlaceholder')}"></textarea>
    <div class="muted fadeUp" style="animation-delay:.3s"><span id="wCount">1000 ${I18N.t('ui.wordsLeft')}</span></div>
    <label class="chk fadeUp" style="animation-delay:.34s"><input type="checkbox" id="cInc" checked /> ${I18N.t('ui.includeAnswers')}</label>
    <label class="fadeUp" style="animation-delay:.38s">${I18N.t('ui.attachLabel')}<input type="file" id="cFile" accept="application/pdf" /></label>
    <button class="btn primary shimmer fadeUp" style="animation-delay:.42s" id="sendBtn">${I18N.t('ui.sendButton')}</button>
    <div id="sendOut"></div></div>`));
  const msg = zone.querySelector('#cMsg');
  msg.addEventListener('input', () => {
    const n = msg.value.trim() ? msg.value.trim().split(/\s+/).length : 0;
    zone.querySelector('#wCount').textContent = Math.max(0, 1000 - n) + ' ' + I18N.t('ui.wordsLeft');
    if (n > 1000) { msg.value = msg.value.split(/\s+/).slice(0, 1000).join(' '); }
  });
  zone.querySelector('#sendBtn').onclick = () => {
    const f = zone.querySelector('#cFile').files[0];
    if (f && (f.type !== 'application/pdf' || f.size > 25 * 1024 * 1024)) {
      zone.querySelector('#sendOut').innerHTML = '<p class="err">⚠️ PDF only, up to 25MB please!</p>'; return;
    }
    openGdpr(() => doSend(zone, r, f));
  };
}

function openGdpr(onOk) {
  const m = document.getElementById('modal');
  m.style.display = 'flex';
  m.innerHTML = `<div class="modalBox"><h3>🔒 GDPR</h3><p>${I18N.t('ui.gdprNotice')}</p>
    <button class="btn primary" id="okBtn">${I18N.t('ui.gdprConfirm')}</button>
    <button class="btn ghost" id="cancelBtn">Cancel</button></div>`;
  document.getElementById('okBtn').onclick = () => { m.style.display = 'none'; onOk(); };
  document.getElementById('cancelBtn').onclick = () => { m.style.display = 'none'; };
}

function doSend(zone, r, file) {
  const name = zone.querySelector('#cName').value.trim();
  const contact = zone.querySelector('#cContact').value.trim();
  const message = zone.querySelector('#cMsg').value.trim();
  const inc = zone.querySelector('#cInc').checked;
  if (!name || !message) { zone.querySelector('#sendOut').innerHTML = '<p class="err">⚠️ Please add your name and a message! 💛</p>'; return; }
  let body = `Name: ${name}\nContact: ${contact}\nScore: ${r.display}% (internal ${r.internal}/125)\nInclude answers: ${inc ? 'yes' : 'no'}\n\n${message}\n`;
  if (inc) body += '\n--- Answers ---\n' + PDF_ANSWERS_TEXT();
  if (file) body += `\n[Attached: ${file.name} ${(file.size / 1048576).toFixed(1)}MB — please attach it manually to your email!]`;
  const a = document.createElement('a');
  a.href = 'mailto:TomiWebPro@gmail.com?subject=' + encodeURIComponent('Compatibility ' + r.display + '% from ' + name) + '&body=' + encodeURIComponent(body);
  a.click();
  zone.querySelector('#sendOut').innerHTML = '<p class="ok">✅ Opening your mail app to <b>TomiWebPro@gmail.com</b>… if it didn’t open, copy the text below or download your PDF! 💌</p><textarea rows="6" style="width:100%">' + body.replace(/</g, '&lt;') + '</textarea>';
}

function PDF_ANSWERS_TEXT() {
  const out = [];
  for (const sec of SECTIONS) for (const q of sec.questions) {
    const v = answers[q.id];
    out.push(q.id + ' ' + q.title + ': ' + (v && v.__skipped ? '(not answered)' : JSON.stringify(v)));
  }
  return out.join('\n');
}

// ---- inputs ----
function renderInputs(box, q) {
  const prev = answers[q.id];
  if (q.type === 'single') {
    q.options.forEach(o => {
      const sel = prev === o.value ? 'checked' : '';
      box.appendChild(el(`<label class="opt"><input type="radio" name="q" value="${o.value}" ${sel}/> ${o.label}</label>`));
    });
  } else if (q.type === 'multi') {
    const arr = Array.isArray(prev) ? prev : [];
    q.options.forEach(o => {
      const sel = arr.includes(o.value) ? 'checked' : '';
      box.appendChild(el(`<label class="opt"><input type="checkbox" name="qm" value="${o.value}" ${sel}/> ${o.label}</label>`));
    });
    if (q.allowOther) box.appendChild(el(`<input type="text" id="fOther" placeholder="${q.otherPlaceholder || 'Other…'}" value=""/>`));
  } else if (q.type === 'number') {
    box.appendChild(el(`<label>${q.unit || ''}<input type="number" id="f0" min="${q.min || ''}" max="${q.max || ''}" placeholder="${q.placeholder || ''}" value="${prev || ''}"/></label>`));
  } else if (q.type === 'date') {
    box.appendChild(el(`<input type="date" id="f0" value="${prev || ''}"/>`));
  } else if (q.type === 'text') {
    box.appendChild(el(`<input type="text" id="f0" placeholder="${q.placeholder || ''}" value="${prev || ''}"/>`));
  } else if (q.type === 'textarea') {
    const ta = el(`<textarea id="f0" rows="4" placeholder="${q.placeholder || ''}">${prev || ''}</textarea>`);
    box.appendChild(ta);
    if (q.maxWords) {
      const cnt = el(`<div class="muted"><span id="wCount">0 / ${q.maxWords} words</span></div>`);
      box.appendChild(cnt);
      const sync = () => {
        const words = ta.value.trim() ? ta.value.trim().split(/\s+/) : [];
        if (words.length > q.maxWords) ta.value = words.slice(0, q.maxWords).join(' ');
        const n = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
        cnt.querySelector('#wCount').textContent = `${n} / ${q.maxWords} words`;
      };
      ta.addEventListener('input', sync);
      sync();
    }
  } else if (q.type === 'group') {
    const keyToIndex = {};
    q.fields.forEach((f, i) => { keyToIndex[f.key] = i; });
    const wrappers = [];
    q.fields.forEach((f, i) => {
      const pv = (prev && typeof prev === 'object' ? prev[f.key] : '') || '';
      const d = el(`<div class="field" data-field="${f.key}"><label>${f.label}</label><div id="gf${i}"></div></div>`);
      const host = d.querySelector(`#gf${i}`);
      if (f.kind === 'single') {
        f.options.forEach(o => {
          const sel = pv === o.value ? 'checked' : '';
          host.appendChild(el(`<label class="opt"><input type="radio" name="g${i}" value="${o.value}" ${sel}/> ${o.label}</label>`));
        });
      } else if (f.kind === 'multi') {
        const arr = Array.isArray(pv) ? pv : [];
        (f.options || []).forEach(o => {
          const sel = arr.includes(o.value) ? 'checked' : '';
          host.appendChild(el(`<label class="opt"><input type="checkbox" name="gm${i}" value="${o.value}" ${sel}/> ${o.label}</label>`));
        });
      } else if (f.kind === 'palette') {
        const hidden = el(`<input type="hidden" data-k="${f.key}" value="${String(pv == null ? '' : pv).replace(/"/g, '&quot;')}"/>`);
        host.appendChild(hidden);
        const sw = el(`<div class="swatches"></div>`);
        const lab = el(`<div class="swatchLabel muted">Pick one ✨</div>`);
        const paint = () => {
          sw.querySelectorAll('.sw,.chip').forEach(x => x.classList.remove('sel'));
          const btn = sw.querySelector(`[data-v="${hidden.value}"]`);
          if (btn) { btn.classList.add('sel'); lab.textContent = btn.getAttribute('title'); }
          else lab.textContent = 'Pick one ✨';
        };
        (f.options || []).forEach(o => {
          const b = o.color
            ? el(`<button type="button" class="sw" data-v="${o.value}" title="${o.label}" style="background:${o.color}"></button>`)
            : el(`<button type="button" class="chip" data-v="${o.value}" title="${o.label}">${o.label}</button>`);
          b.onclick = () => { hidden.value = o.value; paint(); };
          sw.appendChild(b);
        });
        host.appendChild(sw); host.appendChild(lab);
        paint();
      } else if (f.kind === 'langrows' || f.kind === 'sportrows') {
        const list = el(`<div data-rows="${f.key}"></div>`);
        host.appendChild(list);
        const isSport = f.kind === 'sportrows';
        const itemList = isSport ? (f.sports || []) : (f.languages || []);
        const itemPh = isSport ? 'Sport…' : 'Language…';
        const levels = isSport
          ? [['weekly', 'Weekly 🔥'], ['monthly', 'Monthly 🌿'], ['rarely', 'Few times a year 🍂'], ['want_try', 'Want to try 🌱'], ['watching', 'Just watching 👀']]
          : [['native', 'Native 🌟'], ['fluent', 'Fluent 💬'], ['conversational', 'Conversational 🙂'], ['learning', 'Learning 🌱']];
        const addRow = (lang = '', level = '') => {
          if (list.children.length >= (f.max || 8)) return;
          if (!level) level = isSport ? 'weekly' : 'conversational';
          const row = el(`<div class="langrow"></div>`);
          const s1 = document.createElement('select'); s1.setAttribute('data-l', '');
          s1.appendChild(el(`<option value="">${itemPh}</option>`));
          itemList.forEach(o => {
            const op = document.createElement('option');
            op.value = o.value; op.textContent = o.label;
            if (lang === o.value) op.selected = true;
            s1.appendChild(op);
          });
          const s2 = document.createElement('select'); s2.setAttribute('data-v', '');
          levels.forEach(([v, l]) => {
            const op = document.createElement('option');
            op.value = v; op.textContent = l;
            if (level === v) op.selected = true;
            s2.appendChild(op);
          });
          const del = el(`<button type="button" class="chip">✕</button>`);
          del.onclick = () => row.remove();
          row.appendChild(s1); row.appendChild(s2); row.appendChild(del);
          list.appendChild(row);
        };
        const prevRows = Array.isArray(pv) ? pv : [];
        if (prevRows.length) prevRows.forEach(r => { const parts = String(r).split('|'); addRow(parts[0] || '', parts[1] || ''); });
        else addRow();
        const addBtn = el(`<button type="button" class="btn ghost">${isSport ? '＋ Add sport 🏸' : '＋ Add language 🌍'}</button>`);
        addBtn.onclick = () => addRow();
        host.appendChild(addBtn);
      } else if (f.kind === 'number') {
        host.appendChild(el(`<input type="number" data-k="${f.key}" placeholder="${f.placeholder || ''}" value="${pv}"/>`));
      } else if (f.kind === 'select') {
        const sel = el(`<select data-k="${f.key}"><option value="">Select… ✨</option></select>`);
        (f.options || []).forEach(o => {
          const op = document.createElement('option');
          op.value = o.value; op.textContent = o.label;
          if (pv === o.value) op.selected = true;
          sel.appendChild(op);
        });
        host.appendChild(sel);
      } else if (f.kind === 'range') {
        const val = pv !== '' ? pv : (f.default || 3);
        const r = el(`<div><input type="range" data-k="${f.key}" min="${f.min || 0}" max="${f.max || 10}" step="${f.step || 0.5}" value="${val}"/> <b data-bubble="${f.key}">${val}</b> ${f.unit || ''}</div>`);
        host.appendChild(r);
        const inp = r.querySelector('input');
        inp.addEventListener('input', () => { r.querySelector('b').textContent = inp.value; });
      } else {
        host.appendChild(el(`<input type="text" data-k="${f.key}" placeholder="${f.placeholder || ''}" value="${String(pv).replace(/"/g, '&quot;')}"/>`));
      }
      box.appendChild(d);
      wrappers.push(d);
    });
    // conditional write-in boxes: only show when trigger value selected
    q.fields.forEach((f, i) => {
      if (!f.showIf) return;
      const triggerIdx = keyToIndex[f.showIf.key];
      if (triggerIdx == null) return;
      const row = wrappers[i];
      const sync = () => {
        const sel = box.querySelector(`input[name="g${triggerIdx}"]:checked`);
        const show = sel && sel.value === f.showIf.value;
        row.style.display = show ? '' : 'none';
        if (!show) { const inp = row.querySelector(`[data-k="${f.key}"]`); if (inp) inp.value = ''; }
      };
      box.querySelectorAll(`input[name="g${triggerIdx}"]`).forEach(r => r.addEventListener('change', sync));
      sync();
    });
  }
}

function collectInputs(q) {
  const box = document.getElementById('inputs');
  if (q.type === 'single') {
    const c = box.querySelector('input[name="q"]:checked');
    return c ? c.value : null;
  }
  if (q.type === 'multi') {
    const sel = [...box.querySelectorAll('input[name="qm"]:checked')].map(x => x.value);
    const other = box.querySelector('#fOther');
    if (other && other.value.trim()) sel.push('other:' + other.value.trim());
    return sel.length ? sel : null;
  }
  if (q.type === 'number' || q.type === 'date' || q.type === 'text' || q.type === 'textarea') {
    const v = box.querySelector('#f0').value.trim();
    return v ? v : null;
  }
  if (q.type === 'group') {
    const out = {};
    for (let i = 0; i < q.fields.length; i++) {
      const f = q.fields[i];
      if (f.kind === 'single') {
        const c = box.querySelector(`input[name="g${i}"]:checked`);
        // optional singles (e.g. w2/w4 track when a number was entered) may stay empty
        if (!c) { if (f.optional) { out[f.key] = ''; continue; } return null; }
        out[f.key] = c.value;
      } else if (f.kind === 'multi') {
        out[f.key] = [...box.querySelectorAll(`input[name="gm${i}"]:checked`)].map(x => x.value);
      } else if (f.kind === 'langrows' || f.kind === 'sportrows') {
        const wrap = box.querySelector(`[data-rows="${f.key}"]`);
        out[f.key] = wrap ? [...wrap.querySelectorAll('.langrow')].map(r => {
          const l = r.querySelector('[data-l]').value, v = r.querySelector('[data-v]').value;
          return l ? l + '|' + v : null;
        }).filter(Boolean) : [];
      } else {
        const inp = box.querySelector(`[data-k="${f.key}"]`);
        out[f.key] = inp ? inp.value.trim() : '';
      }
    }
    // group valid if at least one non-empty (except track logic handled in scoring)
    const isEmpty = (v) => v === '' || v == null || (Array.isArray(v) && v.length === 0);
    if (Object.values(out).every(isEmpty)) return null;
    // l14: if gambling beyond "never/rare", require the max-stake number so €100+ is enforceable
    if (q.id === 'l14' && ['past', 'sometimes'].includes(out.gamble) && (out.max_stake === '' || out.max_stake == null)) return null;
    // e3: require the 8values link OR all four 0-100 scores (screenshot can go via contact step)
    if (q.id === 'e3') {
      const hasLink = out.link && String(out.link).trim() !== '';
      const scores = [out.equality, out.nation, out.liberty, out.tradition].map(v => parseFloat(v));
      const hasAllScores = scores.every(v => !isNaN(v) && v >= 0 && v <= 100);
      if (!hasLink && !hasAllScores) return null;
    }
    return out;
  }
  return null;
}

function shake() {
  const c = document.getElementById('card');
  c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake');
}

document.addEventListener('DOMContentLoaded', init);
