#!/usr/bin/env python3
"""Verify built ./site: internal links resolve, guardrails hold. Stdlib only.

  python3 tools/check-links.py
Checks:
  - every href="/.../" resolves to a built index.html (or asset file)
  - no visible "Public"/"Private" UI text
  - no external CDN <script>/<link> or font URLs
  - @media print rule present in main.css
Exit != 0 on any failure.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / 'site'

HREF_RE = re.compile(r'href="(/[^"]*?)"')
STRIP_RE = re.compile(r'<(?:pre|code)[^>]*>.*?</(?:pre|code)>', re.DOTALL)
VISIBLE_RE = re.compile(r'>([^<>]*\bPublic\b[^<>]*|[^<>]*\bPrivate\b[^<>]*)<')
CDN_RE = re.compile(r'<(?:script|link)[^>]*(?:cdn\.|unpkg|jsdelivr|googleapis|gstatic|cloudflare\.com/[^>]*\.js)', re.I)
WS_URL_RE = re.compile(r'(?:cdn\.|unpkg|jsdelivr|fonts\.googleapis|fonts\.gstatic)', re.I)


def main():
    errors = []
    pages = sorted(SITE.rglob('*.html'))
    if not pages:
        errors.append('no html files under site/')

    for page in pages:
        rel = page.relative_to(SITE)
        text = page.read_text()
        if 'compatibility' in page.parts:
            continue  # standalone legacy app, out of scope
        text = STRIP_RE.sub('', text)
        for m in HREF_RE.finditer(text):
            h = m.group(1).split('#')[0]
            if not h or h.startswith(('http:', 'https:', 'mailto:')):
                continue
            if h.startswith('/assets/'):
                target = SITE / h.lstrip('/')
            elif h.endswith('/'):
                target = SITE / h.lstrip('/') / 'index.html'
            else:
                target = SITE / h.lstrip('/')
            if not target.exists():
                errors.append(f'{rel}: broken link {h}')
        for m in VISIBLE_RE.finditer(text):
            errors.append(f'{rel}: visible Public/Private text: {m.group(1).strip()[:60]}')
        if CDN_RE.search(text):
            errors.append(f'{rel}: external CDN script/link found')

    css = SITE / 'assets/css/main.css'
    if not css.exists():
        errors.append('site/assets/css/main.css missing')
    else:
        css_text = css.read_text()
        if '@media print' not in css_text:
            errors.append('main.css: @media print rule missing')
        if WS_URL_RE.search(css_text):
            errors.append('main.css: external URL found')

    if errors:
        print(f'FAIL ({len(errors)}):')
        for e in errors[:30]:
            print('  ' + e)
        return 1
    print(f'OK: {len(pages)} files, links + guardrails pass')
    return 0


if __name__ == '__main__':
    sys.exit(main())
