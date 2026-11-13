"""Shared pieces for the page builders in tools/ (page head, footer, catalogue cards).

Used by build_package_pages.py and build_lab_tests_page.py.
"""
import html
import json
import pathlib
import re
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent
PARTIALS = ROOT / 'tools' / 'partials'
SITE = 'https://tata1mglabs.com'
PHONE_TEL = 'tel:+919650461818'
PHONE_DISPLAY = '+91-9650461818'
WHATSAPP = 'https://wa.me/919650461818'

def esc(s):
    return html.escape(str(s), quote=True)


def slugify(s):
    return re.sub(r'(^-|-$)', '', re.sub(r'[^a-z0-9]+', '-', s.lower().replace('&', ' and ')))


def norm(s):
    """Same normalisation as normalizeText() in assets/js/main.js."""
    return re.sub(r'[^a-z0-9]+', ' ', (s or '').lower().replace('x-ray', 'x ray')).strip()


def price_number(s):
    return re.sub(r'[^0-9]', '', s)


def icon(name, cls='ic'):
    """An icon from assets/icons/icons.svg."""
    return f'<svg class="{cls}" aria-hidden="true"><use href="/assets/icons/icons.svg#i-{name}"/></svg>'


def whatsapp_link(name):
    return WHATSAPP + '?text=' + urllib.parse.quote('Hi, I want to book ' + name)


def ld(obj):
    return '    <script type="application/ld+json">\n' + json.dumps(obj, indent=4, ensure_ascii=False) + '\n    </script>\n'


def breadcrumb_schema(items):
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': u} for i, (n, u) in enumerate(items)],
    }


def faq_schema(faq):
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in faq],
    }


def head(title, description, url, schemas):
    blocks = ''.join(ld(s) for s in schemas)
    header = (PARTIALS / 'header.html').read_text(encoding='utf-8').rstrip('\n')
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{esc(title)}</title>
    <meta name="description" content="{esc(description)}">
    <link rel="canonical" href="{url}" />
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <meta name="robots" content="index, follow, max-snippet: -1, max-image-preview: large, max-video-preview: -1" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/style.css">
    <!-- Google tag -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17905897099"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){{dataLayer.push(arguments);}}
        gtag('js', new Date());
        gtag('config', 'AW-17905897099');
    </script>
{blocks}</head>

<body>

{header}

'''


def tail(cta_title='Ready to Book Your Health Checkup?', cta_text='Speak to our health advisors or book instantly on WhatsApp.', scripts=()):
    footer = (PARTIALS / 'footer.html').read_text(encoding='utf-8').rstrip('\n')
    extra = ''.join(f'    <script src="{s}"></script>\n' for s in scripts)
    return f'''
    <!-- CTA Strip -->
    <section class="cta-strip">
        <div class="cta-strip-box">
            <h2>{esc(cta_title)}</h2>
            <p>{esc(cta_text)}</p>
            <div class="cta-strip-buttons">
                <a href="{PHONE_TEL}" class="cta-btn cta-btn-call">{icon("phone")}Call {PHONE_DISPLAY}</a>
                <a href="{WHATSAPP}" target="_blank" class="cta-btn cta-btn-whatsapp">Book on WhatsApp</a>
            </div>
        </div>
    </section>

{footer}

    <!-- Floating Contact Button -->
    <a href="{PHONE_TEL}" class="floating-contact" title="Contact Us">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
    </a>

{extra}    <script src="/assets/js/main.js"></script>

</body>
</html>
'''


def write_page(rel, text):
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding='utf-8', newline='')
    print('wrote', rel)


# ── Homepage cards (the single source for prices) ───────────────────

def homepage_cards():
    """Every card in the homepage's "Most Booked Health Checkups" grid."""
    page = (ROOT / 'index.html').read_text(encoding='utf-8')
    grid = page[page.index('id="health-packages"'):]
    grid = grid[:grid.index('</section>')]
    cards = []
    for block in grid.split('<div class="test-card"')[1:]:
        def grab(cls):
            m = re.search(r'<span class="' + cls + r'">(.*?)</span>', block)
            return m.group(1).strip() if m else ''
        report = re.search(r'Report in ([^<]+)</span>', block)
        cards.append(dict(
            name=re.sub(r'<[^>]+>', '', re.search(r'<h4>(.*?)</h4>', block, flags=re.S).group(1)).strip(),
            tests=int(re.search(r'Contains (\d+) tests?', block).group(1)),
            price=grab('current-price'),
            original=grab('original-price'),
            discount=grab('discount-badge'),
            report=report.group(1).strip() if report else '',
            included=[html.unescape(t).strip() for t in re.findall(r'<li>(.*?)</li>', block)],
        ))
    return cards


# ── Catalogue cards and groups (styled by .cat-* in style.css, driven by initCatalogue() in main.js) ──

def price_html(p, indent):
    pad = ' ' * indent
    out = f'{pad}<div class="price-section">\n{pad}    <span class="current-price">{p["price"]}</span>\n'
    if p.get('original'):
        out += f'{pad}    <span class="original-price">{p["original"]}</span>\n'
    if p.get('discount'):
        out += f'{pad}    <span class="discount-badge">{p["discount"]}</span>\n'
    return out + f'{pad}</div>\n'


def card(item, *, card_id, group, group_name, icon_name, noun='test', search_extra='', extra_class=''):
    """One test or package card.

    item: name, about, tests, reports, includes (packages), price/original/discount (priced items),
          url (detail page, optional).
    """
    name = item['name']
    title = f'<a href="{item["url"]}">{esc(name)}</a>' if item.get('url') else esc(name)
    meta = []
    if item.get('tests'):
        meta.append(f'<li>{icon("tube")}{item["tests"]} {"test" if item["tests"] == 1 else "tests"}</li>')
    if item.get('reports'):
        meta.append(f'<li>{icon("clock")}Reports in {esc(item["reports"])}</li>')
    includes = item.get('includes') or []
    search = norm(' '.join([name, group_name, search_extra, ' '.join(includes)]))
    classes = ' '.join(filter(None, ['cat-card', noun == 'package' and 'cat-card--pkg', item.get('price') and 'cat-card--priced', extra_class]))

    out = f'''                <article class="{classes}" id="{card_id}" data-group="{group}" data-search="{esc(search)}">
                    <span class="cat-card__type">{icon(icon_name)}{esc(group_name)}</span>
                    <h3 class="cat-card__title">{title}</h3>
'''
    if meta:
        out += '                    <ul class="cat-meta">' + ''.join(meta) + '</ul>\n'
    if item.get('about'):
        out += f'                    <p class="cat-card__desc">{esc(item["about"])}</p>\n'
    if includes:
        chips = lambda items: ''.join(f'<li>{esc(i)}</li>' for i in items)
        out += f'                    <ul class="cat-includes">{chips(includes[:4])}</ul>\n'
        if len(includes) > 4:
            out += (f'                    <details class="cat-includes-more"><summary>View tests included '
                    f'<span>(+{len(includes) - 4} more)</span></summary><ul class="cat-includes">{chips(includes[4:])}</ul></details>\n')
    out += '                    <div class="cat-card__bottom">\n'
    if item.get('price'):
        out += price_html(item, 24)
    if item.get('url'):
        out += f'                        <a href="{item["url"]}" class="cat-card__details">View details &rarr;</a>\n'
    out += f'''                        <div class="cat-card__actions">
                            <a href="{PHONE_TEL}" class="cat-btn cat-btn--book" aria-label="Call {PHONE_DISPLAY} to book {esc(name)}">{icon("phone")}Book Now</a>
                            <a href="{whatsapp_link(name)}" target="_blank" class="cat-btn cat-btn--wa" aria-label="Book {esc(name)} on WhatsApp">WhatsApp</a>
                        </div>
                    </div>
                </article>
'''
    return out


def group_section(group_id, name, icon_name, keywords, cards_html, noun_plural):
    """One category: heading + every card in it (no collapsing)."""
    count = len(cards_html)
    return f'''        <section class="cat-group" id="grp-{group_id}" data-group="{group_id}" data-name="{esc(name)}" data-icon="{icon_name}" data-keywords="{esc(' '.join(keywords))}" aria-labelledby="grp-{group_id}-title">
            <div class="cat-group__head">
                <span class="cat-group__icon">{icon(icon_name)}</span>
                <h2 id="grp-{group_id}-title">{esc(name)}</h2>
                <span class="cat-group__count">{count} {noun_plural}</span>
            </div>
            <div class="cat-grid" id="grp-{group_id}-list">
{''.join(cards_html)}            </div>
        </section>
'''


def chips_bar(groups, label):
    chips = [f'<button type="button" class="lab-chip active" data-group="all" aria-pressed="true">All</button>']
    chips += [f'<button type="button" class="lab-chip" data-group="{gid}" aria-pressed="false">{icon(icon_name)}{esc(name)}</button>'
              for gid, name, icon_name in groups]
    return ('        <div class="cat-bar">\n'
            f'            <div class="cat-chips" role="group" aria-label="{esc(label)}">\n'
            + ''.join(f'                {c}\n' for c in chips) +
            '            </div>\n        </div>\n')


def search_box(placeholder, label, popular):
    pop = ''.join(f'<button type="button" class="cat-popular__chip" data-q="{esc(q)}">{esc(q)}</button>' for q in popular)
    return f'''                <div class="cat-search">
                    <form class="search-bar cat-search__form" role="search">
                        <label for="catSearch" class="visually-hidden">{esc(label)}</label>
                        <input type="search" id="catSearch" placeholder="{esc(placeholder)}" autocomplete="off" enterkeyhint="search"
                               role="combobox" aria-expanded="false" aria-controls="catSuggest" aria-autocomplete="list">
                        <button type="submit">Search</button>
                    </form>
                    <div class="cat-suggest" id="catSuggest" role="listbox" aria-label="Suggestions" hidden></div>
                </div>
                <div class="cat-popular"><span>Popular:</span>{pop}</div>
'''


def faq_html(faq, indent=8):
    pad = ' ' * indent
    return '\n'.join(f'''{pad}<details class="faq-item">
{pad}    <summary>{esc(q)}</summary>
{pad}    <p>{a}</p>
{pad}</details>''' for q, a in faq)


STEPS = [
    ('phone', 'Book your test', 'Call or WhatsApp us with the test or package you need.'),
    ('calendar', 'Pick a time slot', 'Choose a time that suits you, including early mornings for fasting tests.'),
    ('home', 'Sample collected at home', 'A trained phlebotomist collects your sample at your doorstep.'),
    ('report', 'Get your report', 'Tested at certified partner labs; reports reach you on email and WhatsApp.'),
]


def steps_section(title='How Home Sample Collection Works'):
    items = ''.join(f'''            <li class="cat-step">
                <span class="cat-step__num">{i + 1:02d}</span>
                <span class="cat-step__icon">{icon(name)}</span>
                <h3>{esc(t)}</h3>
                <p>{esc(d)}</p>
            </li>
''' for i, (name, t, d) in enumerate(STEPS))
    return f'''    <section class="cat-steps-section">
        <h2 class="section-title">{esc(title)}</h2>
        <ol class="cat-steps">
{items}        </ol>
    </section>
'''


def features_section():
    """The homepage's "Why Choose Us?" block."""
    page = (ROOT / 'index.html').read_text(encoding='utf-8')
    start = page.index('    <section class="features">')
    return page[start:page.index('</section>', start) + len('</section>')] + '\n'


# ── Official Tata 1mg details (tools/data/details.json) ─────────────
# Copied word for word from each test's / package's official page on
# https://www.1mg.com/labs/ (default city Gurgaon). Only fields on that page exist.

def load_details():
    path = ROOT / 'tools/data/details.json'
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else {'tests': {}, 'packages': {}}


def official_facts_html(d, indent=16):
    pad = ' ' * indent
    for_who = re.sub(r'^For\s+', '', d.get('for', ''), flags=re.I)
    facts = [
        ('tube', 'Contains', d.get('contains')),
        ('clock', 'Earliest reports in', d.get('reports')),
        ('urine' if d.get('sample', '').lower() == 'urine' else 'blood', 'Samples required', d.get('sample')),
        ('l-users', 'For', for_who[:1].upper() + for_who[1:] if for_who else ''),
    ]
    items = ''.join(f'{pad}    <li><span class="pkg-facts__icon">{icon(i)}</span><span><span class="pkg-facts__label">{esc(l)}</span>'
                    f'<span class="pkg-facts__value">{esc(v)}</span></span></li>\n' for i, l, v in facts if v)
    return f'{pad}<ul class="pkg-facts">\n{items}{pad}</ul>\n' if items else ''


def _list(items, pad):
    out = ''
    for it in items:
        sub = f'<span class="od-sub">{esc(it["text"])}</span>' if it.get('text') else ''
        out += f'{pad}    <li>{esc(it["title"])}{sub}</li>\n'
    return f'{pad}<ul class="od-list">\n{out}{pad}</ul>\n'


def official_sections_html(d, name, indent=16):
    """Also known as, what it measures, samples, preparations, why it is booked."""
    pad = ' ' * indent
    out = ''
    if d.get('aka'):
        chips = ''.join(f'<li>{esc(a)}</li>' for a in d['aka'])
        out += f'{pad}<h2>Also known as</h2>\n{pad}<ul class="od-chips">{chips}</ul>\n'
    if d.get('measures'):
        out += f'{pad}<h2>What does {esc(name)} measure?</h2>\n'
        if d.get('measuresCount'):
            out += f'{pad}<p class="pkg-muted">{esc(d["measuresCount"])}</p>\n'
        rows = ''
        for m in d['measures']:
            if m.get('items'):
                sub = ''.join(f'<li>{esc(s)}</li>' for s in m['items'])
                rows += f'{pad}    <li class="has-items"><strong>{esc(m["name"])}</strong><ul>{sub}</ul></li>\n'
            else:
                rows += f'{pad}    <li><strong>{esc(m["name"])}</strong></li>\n'
        out += f'{pad}<ul class="od-measures">\n{rows}{pad}</ul>\n'
    if d.get('sampleInfo'):
        out += f'{pad}<h2>Samples required</h2>\n' + _list(d['sampleInfo'], pad)
    if d.get('prepInfo'):
        out += f'{pad}<h2>Preparations</h2>\n' + _list(d['prepInfo'], pad)
    if d.get('why'):
        out += f'{pad}<h2>{esc(d.get("whyTitle") or "Why is this test booked?")}</h2>\n'
        group = []
        def flush():
            return _list(group, pad) if group else ''
        for it in d['why']:
            if re.match(r'^[A-Z]\.\s', it['title']) and not it.get('text'):
                out += flush(); group = []
                out += f'{pad}<h3>{esc(re.sub(r"^[A-Z]\.\s*", "", it["title"]))}</h3>\n'
            else:
                group.append(it)
        out += flush()
    return out
