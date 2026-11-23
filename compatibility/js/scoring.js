// INTERNAL scoring — never render thresholds in UI text.
// Base 75 for a neutral pass. Bonuses push toward 125, penalties pull down.
// Any hard-fail flag => internal 0 at next section gate. Skip => fail at next gate.
const Scoring = (() => {
  // Internal reference profile (do not display in UI).
  // NOTE: static sites ship JS to the browser — true hiding needs a backend.
  const REF_BIRTH_MS = 1212278400000; // internal only
  const REF_H = 168; // internal only

  function ageFromDob(dobIn) {
    let d;
    if (dobIn && typeof dobIn === 'object' && !Array.isArray(dobIn)) {
      const m = parseInt(dobIn.month), day = parseInt(dobIn.day), y = parseInt(dobIn.year);
      if (!m || !day || !y) return null;
      d = new Date(y, m - 1, day);
      if (d.getFullYear() !== y || d.getMonth() !== m - 1 || d.getDate() !== day) return null;
    } else {
      d = new Date(dobIn);
      if (isNaN(d)) return null;
    }
    const now = new Date();
    let a = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
    return { age: a, date: d };
  }
  const norm = (s) => (s || '').toString().toLowerCase();
  const containsAny = (s, arr) => arr.some(k => norm(s).includes(k));

  function scoreAll(A) {
    // A: {qid: value} where group => object, single => string, number => number/string
    let s = 75;
    const hard = {}; // sectionId -> true
    const fail = (sec) => { hard[sec] = true; };
    const g = (id) => A[id];
    const go = (id, k) => (A[id] && typeof A[id] === 'object' ? A[id][k] : '');

    // ---------- BASIC ----------
    if (g('b1') === 'friends_only') { /* handled as friend redirect, not fail */ }
    const dob = ageFromDob(g('b2'));
    if (!dob || dob.age < 18) fail('basic');
    else {
      const dy = Math.abs((dob.date - new Date(REF_BIRTH_MS)) / (365.25 * 24 * 3600 * 1000));
      if (dy > 8.5) fail('basic'); // ±8y window
    }
    const bs = norm(go('b3', 'birth_sex'));
    const gj = norm((go('b3', 'gender_journey') || '') + ' ' + (go('b3', 'gender_journey_detail') || ''));
    const pr = norm((go('b3', 'pronouns') || '') + ' ' + (go('b3', 'pronouns_detail') || ''));
    if (!(bs === 'female' && (gj.includes('no change') || gj === '' || gj === 'no') && (pr.includes('she/her') || pr.includes('she')))) {
      // strict: born female + never changed + she/her
      if (A['b3'] && !A['b3'].__skipped) fail('basic');
    }
    const identRaw = norm(go('b4', 'identity') || g('b4'));
    const identDetail = norm(go('b4', 'identity_detail') || '');
    const ident = identRaw === 'self_describe' ? (identDetail || 'self_describe') : identRaw;
    const histRaw = norm(go('b4', 'history'));
    const hist = norm(histRaw + ' ' + (go('b4', 'history_detail') || ''));
    if (ident !== 'straight') { if (A['b4'] && !A['b4'].__skipped) fail('basic'); }
    else if (histRaw === 'changed' || histRaw === 'other' || (hist && (hist.includes('bi') || hist.includes('gay') || hist.includes('changed') || hist.includes('used to') || hist.includes('yes')))) {
      // "always was straight" — any hint of change fails
      if (A['b4'] && !A['b4'].__skipped) fail('basic');
    }
    let h = NaN;
    if (A['b5'] && typeof A['b5'] === 'object' && !A['b5'].__skipped) {
      if (A['b5'].unit === 'ft') {
        const ft = parseFloat(A['b5'].feet), inch = parseFloat(A['b5'].inches || 0);
        if (!isNaN(ft)) h = ft * 30.48 + (isNaN(inch) ? 0 : inch * 2.54);
      } else {
        h = parseFloat(A['b5'].cm);
      }
    } else {
      h = parseFloat(g('b5'));
    }
    if (!isNaN(h)) {
      const d = h - REF_H;
      if (d > 12 || d < -22) fail('basic');
      else if (d >= -12 && d <= -2) s += 5;
      // outer ideal band (+8/-16) is neutral: no bonus, so a plain pass stays near 75
    }
    const bmi = parseFloat(typeof g('b6') === 'object' ? '' : g('b6'));
    if (!isNaN(bmi)) {
      if (bmi < 17 || bmi > 28) fail('basic');
      else if (bmi >= 18.5 && bmi <= 23) s += 3;
    }
    const brows = go('b7', 'rows');
    if (Array.isArray(brows) && brows.length) {
      let lb = 0;
      for (const r of brows) {
        const parts = String(r).split('|'), lang = parts[0], lv = parts[1] || 'conversational';
        const hit = lang === 'english' || lang === 'german' || lang === 'hungarian' || (lang && lang.indexOf('chinese') === 0);
        if (hit) lb += (lv === 'native' || lv === 'fluent') ? 3 : lv === 'conversational' ? 1 : 0;
      }
      s += Math.min(lb, 6);
    } else {
      const langs = norm(go('b7', 'langs') || g('b7'));
      const level = norm(go('b7', 'level'));
      if (langs && langs !== '[object object]') {
        const per = level === 'native' || level === 'fluent' ? 3 : level === 'conversational' || level === 'mixed' ? 1 : 0;
        let lb = 0;
        if (langs.includes('english')) lb += per;
        if (langs.includes('german')) lb += per;
        if (langs.includes('hungarian')) lb += per;
        if (langs.includes('chinese')) lb += per;
        s += Math.min(lb, 6);
      }
    }
    // Hard fail if she speaks none of English / German / Chinese (learning-only doesn't count).
    // Hungarian still earns a bonus above but does not satisfy this gate.
    const coreLang = (lang, lv) => {
      const okLv = lv === 'native' || lv === 'fluent' || lv === 'conversational';
      return okLv && (lang === 'english' || lang === 'german' || (lang && lang.indexOf('chinese') === 0));
    };
    let hasCore = false;
    if (Array.isArray(brows) && brows.length) {
      hasCore = brows.some((r) => { const p = String(r).split('|'); return coreLang(p[0], p[1] || 'conversational'); });
    } else if (A['b7'] && typeof A['b7'] === 'object' && !A['b7'].__skipped) {
      hasCore = /(english|german|chinese)/.test(norm(go('b7', 'langs') || g('b7')));
    }
    if (A['b7'] && !A['b7'].__skipped && !hasCore) fail('basic');
    const skin = norm(go('b8', 'skin_tone'));
    if (['brown', 'deep'].includes(skin)) fail('basic');
    else if (skin && containsAny(skin, ['dark', 'black', 'african'])) fail('basic');
    // hair: no effect
    if (norm(g('b9')) && g('b9') !== 'no_diagnosis') { if (!g('b9').__skipped) fail('basic'); }
    const physVals = [go('b10', 'limb'), go('b10', 'vision'), go('b10', 'hearing'), go('b10', 'speech')];
    if (physVals.some(v => norm(v) === 'yes')) fail('basic');
    // b11 glasses + slider: no effect on judgment
    const regScore = (region) => {
      if (!region) return 0;
      if (['china', 'eu', 'europe'].includes(region)) return 3;
      if (['usa', 'australia', 'russia'].includes(region)) return 1;
      if (['africa', 'india', 'pakistan'].includes(region)) return -4;
      return 0;
    };
    const reg = (t) => {
      if (t && typeof t === 'object' && !Array.isArray(t)) {
        return regScore(norm(t.region)) + (t.country ? 0 : 0);
      }
      t = norm(t);
      if (!t) return 0;
      if (containsAny(t, ['china', 'deutschland', 'germany', 'hungar', 'magyar', 'france', 'ital', 'spain', 'netherland', 'belgium', 'austria', 'switz', 'poland', 'czech', 'slovak', 'swed', 'norway', 'denmark', 'finland', 'portugal', 'greece', 'europe', 'eu '])) return 5;
      if (containsAny(t, ['usa', 'united states', 'america', 'australia', 'russia'])) return 2;
      if (containsAny(t, ['africa', 'nigeria', 'india', 'pakistan', 'kenya', 'ghana'])) return -4;
      return 0;
    };
    function countryRegion(v) {
      try {
        // Hong Kong / Taiwan / Macau count toward the China tier (spec: "within china").
        if (['hong_kong', 'taiwan', 'macau'].includes(v)) return 'china';
        const o = (typeof COUNTRIES !== 'undefined' ? COUNTRIES : []).find(o => o.value === v);
        return o ? o.region : '';
      } catch (e) { return ''; }
    }
    s += regScore(countryRegion(go('b12', 'country'))) + regScore(countryRegion(go('b13', 'country')));

    // ---------- WEALTH ----------
    const w2r = parseFloat(go('w2', 'ratio'));
    if (!isNaN(w2r)) {
      if (w2r < 1.3) fail('wealth');
      else if (w2r >= 2) s += 4;
      // 1.3–2.0 is a neutral pass: no bonus, so baseline stays near 75
    } else { s -= 12; } // no clue => very very low
    const info = g('w3');
    if (info === 'browser' || info === 'ai') s += 2;
    else if (info === 'youtube' || info === 'instagram' || info === 'tiktok') s -= 3;
    const fr = parseFloat(go('w4', 'ratio'));
    if (!isNaN(fr)) {
      if (fr < 0) fail('wealth');
      else if (fr >= 30) s += 3;
      // 10–30 is a neutral pass: no bonus
    } else { s -= 12; }

    // ---------- LIFE ----------
    const sl = go('l3', 'sports');
    let sb = 0;
    const sportPts = (tok, freq) => {
      if (tok === 'badminton') return freq === 'weekly' ? 4 : 2;
      if (['table_tennis', 'roller', 'skiing', 'swimming', 'skydiving', 'paragliding'].includes(tok)) return 2;
      return 0;
    };
    if (Array.isArray(sl)) {
      for (const r of sl) { const p = String(r).split('|'); sb += sportPts(p[0], p[1]); }
    } else if (sl) {
      const t = norm(sl);
      if (t.includes('badminton')) sb += 4;
      for (const k of ['table_tennis', 'table tennis', 'roller', 'skiing', 'swimming', 'skydiving', 'paragliding']) {
        if (k === 'skiing' && t.includes('skiing')) { sb += 2; continue; }
        if (k !== 'skiing' && t.includes(k)) sb += 2;
      }
    }
    s += Math.min(sb, 7);
    if (g('l5') === 'comfortable_no' || g('l5') === 'want_learn') s -= 5;
    else if (g('l5') === 'learning') s -= 2;
    else if (g('l5') === 'confident') s += 2;
    // basics is neutral: no bonus, so a plain pass stays near 75
    const petw = go('l6', 'want');
    if (petw === 'cat' || petw === 'can_have' || petw === 'no_opinion' || petw === 'cat_open') s += 2;
    else if (petw === 'none' || petw === 'must_have') s -= 4;
    // 'dog' / 'other_pet' (and legacy 'dog_other') are the neutral middle tier: +0
    if (go('l7', 'ability') && go('l7', 'ability') !== 'dont') s += 1;
    // super willing to take on all cooking, or don't cook + prefer eating out => lower
    if (go('l7', 'willing') === 'takeover') s -= 4;
    if (go('l7', 'willing') === 'eatout' && go('l7', 'ability') === 'dont') s -= 1;
    const diet = go('l8', 'diet'), allergy = norm(go('l8', 'allergy'));
    if (['vegetarian', 'vegan', 'meatonly'].includes(diet)) fail('life');
    if (allergy === 'yes') fail('life');
    // omnivore is the baseline: no bonus, so a plain pass stays near 75
    if (go('l9', 'spice') === 'none') fail('life');
    else if (['hot', 'extreme', 'medium'].includes(go('l9', 'spice'))) s += 1;
    if (['familiar', 'averse'].includes(go('l9', 'adventure'))) s -= 3;
    if (go('l10', 'rhythm') === 'nightowl' || go('l10', 'rhythm') === 'messed') s += 2;
    if (go('l10', 'share') === 'no_share') fail('life');
    else if (go('l10', 'share') === 'own_room') s -= 4;
    const pc = norm(go('l12', 'partners')), kidsh = norm(go('l12', 'kids')), preg = norm(go('l12', 'pregnancy'));
    if (pc === '9+') fail('life');
    else if (pc === '6-8') s -= 10;
    else if (pc === '3-5') s -= 5;
    else if (!isNaN(parseInt(pc)) && parseInt(pc) > 8) fail('life');
    if (kidsh === 'yes' || preg === 'abortion') fail('life');
    if (go('l13', 'history') === 'former' || go('l13', 'history') === 'social' || go('l13', 'history') === 'regular') fail('life');
    if (go('l13', 'future') === 'continue') fail('life');
    // Gambling: hard fail if max single-session stake ever reached €100+ (spec).
    const stake = parseFloat(go('l14', 'max_stake'));
    if (!isNaN(stake) && stake >= 100) fail('life');
    if (['past', 'sometimes'].includes(go('l14', 'gamble')) && !isNaN(stake) && stake >= 100) fail('life');
    // Any drug use ever (past / occasional / regular / recovery) is a hard fail per spec.
    if (['past', 'occasional', 'regular', 'recovery'].includes(go('l14', 'drugs'))) fail('life');
    if (go('l14', 'sexhabit') === 'struggle') s -= 5;
    const alc = go('l15', 'freq');
    if (alc === 'never' || alc === 'rare') s += 2;
    if (alc === 'multiweek' || alc === 'daily') fail('life');
    const maxk = go('l16', 'max');
    const idealk = go('l16', 'ideal');
    if (maxk === '3' || maxk === '4+') s -= 5;
    if (idealk === '3' || idealk === '4+') s -= 3;
    if (g('l17') === 'private') s -= 8;
    if (go('l18', 'abortion') === 'opposed') fail('life');
    if (['current', 'serious_resolved'].includes(g('l19'))) fail('life');
    if (g('l20') === 'iphone' || g('l20') === 'graphene') s += 2;
    if (['linux', 'macos'].includes(go('l21', 'os'))) s += 2;
    if (go('l21', 'os') === 'barely') s -= 8;

    // ---------- BELIEFS ----------
    // Fail only for actual religious affiliation (not a free-text "other" like "humanist").
    const presentBelief = go('e1', 'present');
    const presentDetail = norm(go('e1', 'present_detail'));
    const religiousDetail = /(christian|catholic|protestant|muslim|islam|jew|hindu|buddh|church|mosque|jesus|allah|god\b|jehovah|orthodox|baptist|taoist|shinto|sikh)/i.test(presentDetail);
    if (['christian', 'muslim', 'jewish', 'hindu', 'buddhist'].includes(presentBelief)) fail('beliefs');
    else if (presentBelief === 'other' && religiousDetail) fail('beliefs');
    const pastp = norm(go('e1', 'practice'));
    if (pastp === 'regular') fail('beliefs');
    if (!['same', 'none'].includes(go('e1', 'past')) && go('e1', 'past')) { if (go('e1', 'past') !== 'same') { /* practiced in past */ if (['more', 'different'].includes(go('e1', 'past'))) fail('beliefs'); } }
    if (go('e1', 'present') === 'science') s += 2;
    const fam = norm(go('e1', 'parents') + ' ' + go('e1', 'grandparents'));
    if (/very|active/.test(fam)) s -= 3;
    if (go('e2', 'highest') === 'bachelor' || go('e2', 'highest') === 'master') s += 3;
    if (go('e2', 'highest') === 'phd') s -= 2; // higher degree but rated lower than bsc/msc per spec
    const major = norm(go('e2', 'major'));
    if (containsAny(major, ['computer', 'software', 'engineer', 'social', 'psycho', 'sociolog', 'science', 'physics', 'math', 'biology', 'data'])) s += 2;
    // e3 no effect
    if (g('e4') === 'always' || g('e4') === 'usually') s += 2;

    // skip-fails: any __skipped in section => fail that section at gate
    for (const sec of SECTIONS) {
      for (const q of sec.questions) {
        const v = A[q.id];
        if (v && v.__skipped) fail(sec.id);
      }
    }
    // clamp 0..125
    if (Object.keys(hard).length) s = 0;
    s = Math.max(0, Math.min(125, Math.round(s)));
    const display = Math.min(100, s);
    return { internal: s, display, hard };
  }
  return { scoreAll };
})();
