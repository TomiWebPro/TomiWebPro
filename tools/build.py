#!/usr/bin/env python3
"""Build ./site from ./src (stdlib only, deterministic).

Page source = directive comment + content + optional tail region:
  <!-- page {"title": "...", "description": "...", "nav": "projects|home|about|blog|contact|none",
             "header_container": "container-wide", "footer_container": "container",
             "footer_extra": ""|"connections"} -->
  <main ...> ...content... </main>
  <!-- page-tail -->            (optional: scripts/comments after </footer>)
  ...
  <!-- /page-tail -->

Usage:
  python3 tools/build.py            # src/ -> site/ (in place, never moves dirs)
  python3 tools/build.py --check    # rebuild to temp dir, diff -r against site/
"""
import html as htmlmod
import json
import pathlib
import re
import shutil
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'
SITE = ROOT / 'site'
PART = SRC / '_partials'

NAV_KEYS = ('home', 'projects', 'about', 'blog', 'contact')
CARD_CATEGORIES = ('ai', 'systems', 'tools')
DIRECTIVE_RE = re.compile(r'\A<!-- page (\{.*?\}) -->\n', re.DOTALL)
TAIL_RE = re.compile(r'<!-- page-tail -->\n(.*?)\n<!-- /page-tail -->\n?\Z', re.DOTALL)
ID_RE = re.compile(r'id="([^"]+)"')
FOOTER_EXTRA_LINK = '\n        <a href="/public/connection/">Connections</a>'

# Registry cards are generated from each project's own directive ("card" key),
# so adding a project never requires editing the index by hand. Schema:
#   "card": {"title", "tag", "date" ("Nov 2026"), "sort" ("2026-11"),
#            "seq" (tie-break within a month, default 50),
#            "category" ("ai"|"systems"|"tools"), "desc", "tech" ([str]),
#            "origin" ("#wiki-anchor" or null for minor builds)}
CARD_TEMPLATE = """      <!-- {num}. {title} -->
      <a class="card project-item" data-category="{category}" href="/public/{slug}/">
        <div class="card-top">
          <div class="card-meta">
            <span class="card-tag">{tag}</span>
            <span class="card-date">{date}</span>
          </div>
          <div class="card-title">
            <span>{title}</span>
            <span class="card-arrow">→</span>
          </div>
          <p class="card-desc">
            {desc}
          </p>
        </div>
        <div class="card-bottom">
{tech_chips}        </div>
      </a>"""


def esc(s):
    return htmlmod.escape(s, quote=False)


def project_slug(rel):
    # rel like public/<slug>/index.html (single level under public/, not the index itself)
    if len(rel.parts) == 3 and rel.parts[0] == 'public' and rel.parts[2] == 'index.html' \
            and rel.parts[1] != 'connection':
        return rel.parts[1]
    return None


def load_project_cards():
    """Collect + validate registry cards from each project page's directive.

    Adding a project = creating ONE file (src/public/<slug>/index.html) with a
    "card" key. The registry grid, counts, and cross-link checks derive from it.
    """
    about_text = (SRC / 'private/about/index.html').read_text()
    about_ids = set(ID_RE.findall(about_text))
    cards = []
    for page in collect_pages():
        rel = page.relative_to(SRC)
        slug = project_slug(rel)
        if not slug:
            continue
        text = page.read_text()
        m = DIRECTIVE_RE.match(text)
        meta = json.loads(m.group(1))
        card = meta.get('card')
        if not card:
            raise ValueError(
                f'{rel}: missing "card" metadata. Add to the page directive, e.g.\n'
                f'  "card": {{"title": "...", "tag": "...", "date": "Dec 2026", '
                f'"sort": "2026-12", "category": "ai|systems|tools",\n'
                f'           "desc": "...", "tech": ["Python"], '
                f'"origin": "#my-origin-or-null"}}')
        for key in ('title', 'tag', 'date', 'sort', 'category', 'desc', 'tech', 'origin'):
            if key not in card:
                raise ValueError(f'{rel}: card missing key {key!r}')
        if card['category'] not in CARD_CATEGORIES:
            raise ValueError(f"{rel}: bad card category {card['category']!r}")
        if not re.fullmatch(r'\d{4}-\d{2}', card['sort'] or ''):
            raise ValueError(f"{rel}: bad card sort {card['sort']!r} (want YYYY-MM)")
        if not isinstance(card['tech'], list) or not card['tech']:
            raise ValueError(f'{rel}: card "tech" must be a non-empty list')
        card = dict(card, slug=slug)
        card.setdefault('seq', 50)
        origin = card['origin']
        if origin is not None:
            if not origin.startswith('#') or origin[1:] not in about_ids:
                raise ValueError(
                    f'{rel}: card origin {origin!r} has no matching id in '
                    f'src/private/about/index.html — add the wiki section first')
            if f'/private/about/{origin}' not in text:
                raise ValueError(
                    f'{rel}: page must link back to its wiki origin '
                    f'(/private/about/{origin}) via an origin-callout div')
        cards.append(card)
    slugs = [c['slug'] for c in cards]
    if len(set(slugs)) != len(slugs):
        raise ValueError('duplicate project slugs')
    cards.sort(key=lambda c: (c['title'],))
    cards.sort(key=lambda c: (c['seq'],))
    cards.sort(key=lambda c: (c['sort'],), reverse=True)
    return cards


def render_cards(cards):
    out = []
    for num, c in enumerate(cards, 1):
        chips = ''.join(
            f'          <span class="tech-chip">{esc(t)}</span>\n' for t in c['tech'])
        out.append(CARD_TEMPLATE.format(
            num=num, slug=c['slug'], category=c['category'], tag=esc(c['tag']),
            date=esc(c['date']), title=esc(c['title']), desc=esc(c['desc']),
            tech_chips=chips))
    return '\n'.join(out) + '\n'


def expand_listing_tokens(content, cards):
    if '%%' not in content:
        return content
    counts = {'N': len(cards)}
    for cat in CARD_CATEGORIES:
        counts['N_' + cat.upper()] = sum(1 for c in cards if c['category'] == cat)
    content = content.replace('%%N%%', str(counts['N']))
    content = content.replace('%%N_AI%%', str(counts['N_AI']))
    content = content.replace('%%N_SYS%%', str(counts['N_SYSTEMS']))
    content = content.replace('%%N_TOOLS%%', str(counts['N_TOOLS']))
    content = content.replace('<!-- %%PROJECT_CARDS%% -->', render_cards(cards).rstrip('\n'))
    if '%%' in content:
        raise ValueError('unexpanded %% listing token remains')
    return content


def render_page(rel, text, cards):
    m = DIRECTIVE_RE.match(text)
    if not m:
        raise ValueError(f'{rel}: missing <!-- page {{...}} --> directive')
    try:
        meta = json.loads(m.group(1))
    except json.JSONDecodeError as e:
        raise ValueError(f'{rel}: bad directive JSON: {e}')
    for key in ('title', 'description', 'nav', 'header_container',
                'footer_container', 'footer_extra'):
        if key not in meta:
            raise ValueError(f'{rel}: directive missing key {key!r}')
    if meta['nav'] not in (*NAV_KEYS, 'none'):
        raise ValueError(f"{rel}: bad nav={meta['nav']!r}")
    if meta['footer_extra'] not in ('', 'connections'):
        raise ValueError(f"{rel}: bad footer_extra={meta['footer_extra']!r}")

    body = text[m.end():]
    tm = TAIL_RE.search(body)
    tail = tm.group(1) if tm else ''
    if tm:
        body = body[:tm.start()]
    content = '\n' + body.strip('\n') + '\n'
    content = expand_listing_tokens(content, cards)

    top = (PART / 'doc-top.html').read_text()
    header = (PART / 'header.html').read_text().rstrip('\n') + '\n'
    footer = (PART / 'footer.html').read_text().rstrip('\n')
    top = top.replace('{{title}}', meta['title'])
    top = top.replace('{{description}}', meta['description'])
    header = header.replace('{{header-container}}', meta['header_container'])
    for key in NAV_KEYS:
        header = header.replace('{{nav-%s}}' % key,
                                ' aria-current="page"' if meta['nav'] == key else '')
    footer = footer.replace('{{footer-container}}', meta['footer_container'])
    footer = footer.replace('{{footer-extra}}',
                            FOOTER_EXTRA_LINK if meta['footer_extra'] == 'connections' else '')
    for token in ('{{title}}', '{{description}}', '{{header-container}}',
                  '{{footer-container}}', '{{footer-extra}}', '{{nav-'):
        assert token not in top + header + footer, f'{rel}: unexpanded {token}'

    tail_out = '\n' + tail + '\n' if tail else '\n'
    return top + header + content + footer + tail_out + '</body>\n</html>\n'


def collect_pages():
    pages = sorted(SRC.rglob('*.html'))
    pages = [p for p in pages if '_partials' not in p.parts
             and 'compatibility' not in p.parts and 'assets' not in p.parts]
    if not pages:
        raise ValueError('no pages found under src/')
    return pages


SITE_URL = 'https://tomiweb.pro'
# Files produced by the build that have no 1:1 src counterpart (excluded from ORPHAN check).
GENERATED_SITE_FILES = {'sitemap.xml'}


def page_url(rel):
    # public/cognithor/index.html -> https://tomiweb.pro/public/cognithor/
    # index.html -> https://tomiweb.pro/
    parts = rel.parts[:-1]  # drop index.html
    path = '/'.join(parts)
    return f'{SITE_URL}/{path + "/" if path else ""}'


def render_sitemap():
    urls = []
    for page in collect_pages():
        rel = page.relative_to(SRC)
        if rel.name != 'index.html' or rel == pathlib.Path('404.html'):
            continue  # only canonical routes; never list the 404 page
        urls.append(page_url(rel))
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/2.0">']
    for u in sorted(set(urls)):
        lines.append(f'  <url><loc>{u}</loc></url>')
    lines.append('</urlset>')
    return '\n'.join(lines) + '\n'


def build_to(dest, cards):
    for page in collect_pages():
        rel = page.relative_to(SRC)
        out = dest / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(render_page(rel, page.read_text(encoding='utf-8'), cards).encode('utf-8'))
    for d in ('assets', 'compatibility'):
        src_d = SRC / d
        if src_d.exists():
            if (dest / d).exists():
                shutil.rmtree(dest / d)
            shutil.copytree(src_d, dest / d)
    # Root crawler files: robots.txt is editorial policy (verbatim copy),
    # sitemap.xml is regenerated from the page inventory every build.
    robots_src = SRC / 'robots.txt'
    if robots_src.is_file():
        (dest / 'robots.txt').write_bytes(robots_src.read_bytes())
    (dest / 'sitemap.xml').write_bytes(render_sitemap().encode('utf-8'))


def main():
    check = '--check' in sys.argv
    cards = load_project_cards()
    if check:
        status = 0
        for page in collect_pages():
            rel = page.relative_to(SRC)
            want = render_page(rel, page.read_text(), cards).encode()
            have_path = SITE / rel
            if not have_path.is_file():
                print(f'MISSING in ./site: {rel}')
                status = 1
            elif have_path.read_bytes() != want:
                print(f'DRIFT in ./site: {rel}')
                status = 1
        for d in ('assets', 'compatibility'):
            for src_f in sorted((SRC / d).rglob('*')):
                if src_f.is_file():
                    rel = src_f.relative_to(SRC)
                    dst = SITE / rel
                    if not dst.is_file() or dst.read_bytes() != src_f.read_bytes():
                        print(f'DRIFT in ./site: {rel}')
                        status = 1
        # root crawler files: robots.txt is verbatim policy, sitemap.xml is generated
        for name, want in (('robots.txt', (SRC / 'robots.txt').read_bytes()),
                           ('sitemap.xml', render_sitemap().encode())):
            have_path = SITE / name
            if not have_path.is_file():
                print(f'MISSING in ./site: {name}')
                status = 1
            elif have_path.read_bytes() != want:
                print(f'DRIFT in ./site: {name}')
                status = 1
        # files in site/ with no src counterpart (generated files excluded)
        for dst_f in sorted(SITE.rglob('*')):
            rel = dst_f.relative_to(SITE)
            if dst_f.is_file() and rel.name not in GENERATED_SITE_FILES \
                    and not (SRC / rel).exists():
                print(f'ORPHAN in ./site (no src): {rel}')
                status = 1
        print('OK: ./site matches src/ build' if status == 0 else 'CHECK FAILED')
        return status
    build_to(SITE, cards)
    print(f'OK: built {len(collect_pages())} pages src/ -> site/ '
          f'({len(cards)} project cards generated)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
