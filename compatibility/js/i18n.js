// Minimal i18n loader — English only for now, expandable.
// Usage: ?lang=en (default). To add a language, copy locales/en.json to locales/<lang>.json
// and translate values. Keys must stay identical.
const I18N = (() => {
  let dict = {};
  let lang = 'en';
  try {
    const p = new URLSearchParams(location.search);
    const q = (p.get('lang') || 'en').toLowerCase().slice(0, 5);
    if (/^[a-z-]+$/.test(q)) lang = q;
  } catch (e) {}
  async function load() {
    try {
      const res = await fetch(`locales/${lang}.json`);
      if (res.ok) { dict = await res.json(); return; }
    } catch (e) {}
    try {
      const res = await fetch('locales/en.json');
      if (res.ok) dict = await res.json();
    } catch (e) {}
  }
  function t(path, fallback = '') {
    const parts = path.split('.');
    let cur = dict;
    for (const k of parts) { if (cur && k in cur) cur = cur[k]; else return fallback || path; }
    return typeof cur === 'string' ? cur : (fallback || path);
  }
  function getLang() { return lang; }
  return { load, t, getLang };
})();
