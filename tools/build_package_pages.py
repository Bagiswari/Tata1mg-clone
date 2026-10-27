"""Build /health-packages/ and one page per health package.

Prices, test counts and included tests are read from the package cards on the
homepage (index.html), so edit them there. The extra copy for each package
(summary, who it's for, preparation, report time) lives in PACKAGES below.
Run from the repo root, then run tools/sync_partials.py:

    python tools/build_package_pages.py
"""
import html
import json
import pathlib
import re
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent
PARTIALS = ROOT / 'tools' / 'partials'
SITE = 'https://tata1mglabs.com'
WHATSAPP = 'https://wa.me/919650461818'

FASTING = [
    'Fast for 10–12 hours before sample collection. Plain water is allowed.',
    'Book an early-morning slot so the fasting window is easy to manage.',
    'Avoid alcohol and heavy, fatty meals for 24 hours before the test.',
    'Keep taking your regular medicines unless your doctor advises otherwise, and tell the phlebotomist what you take.',
]
ROUTINE_REPORT = 'Reports are usually ready within 24 hours. Routine results such as CBC, lipid profile and thyroid profile are often ready in about 6 hours. Reports are shared by email and WhatsApp.'
EXTENDED_REPORT = 'Reports are usually ready within 24–48 hours, as vitamin and specialised markers take longer to process than routine tests. Reports are shared by email and WhatsApp.'

# Keyed by the package name shown on the homepage card.
PACKAGES = {
    'Good Health Gold Package with Smart Report': {
        'slug': 'good-health-gold-package',
        'short': 'Good Health Gold Package',
        'summary': 'An essential health checkup covering blood sugar, cholesterol, liver, kidney and thyroid function, plus a complete blood count and urine test.',
        'for': 'A good first or yearly checkup for adults who want a reliable baseline of their health at a low price.',
        'prep': FASTING,
        'report': ROUTINE_REPORT,
    },
    'Aayushya Health Checkup 2': {
        'slug': 'aayushya-health-checkup-2',
        'short': 'Aayushya Health Checkup 2',
        'summary': 'Builds on the essentials with a free thyroid panel (FT3, FT4 & TSH), serum calcium and a kidney function test with eGFR.',
        'for': 'Adults who want a slightly broader yearly checkup, including a closer look at thyroid and bone health.',
        'prep': FASTING,
        'report': ROUTINE_REPORT,
    },
    'Aayushya Health Checkup 3 Plus': {
        'slug': 'aayushya-health-checkup-3-plus',
        'short': 'Aayushya Health Checkup 3 Plus',
        'summary': 'Adds Vitamin D, Vitamin B12, iron studies and ESR to the core checkup, so common deficiencies are covered in one visit.',
        'for': 'Anyone who feels tired or low on energy, spends most of the day indoors, or wants vitamin and iron levels checked along with the basics.',
        'prep': FASTING,
        'report': EXTENDED_REPORT,
    },
    'Advanced Preventive Health Checkup': {
        'slug': 'advanced-preventive-health-checkup',
        'short': 'Advanced Preventive Health Checkup',
        'summary': 'A preventive checkup with kidney function and electrolytes, Vitamin D, Vitamin B12 and iron studies alongside the core organ tests.',
        'for': 'Adults over 30 looking for a preventive checkup that also screens for the most common vitamin and mineral deficiencies.',
        'prep': FASTING,
        'report': EXTENDED_REPORT,
    },
    'Comprehensive Gold Full Body Checkup with Smart Report': {
        'slug': 'comprehensive-gold-full-body-checkup',
        'short': 'Comprehensive Gold Full Body Checkup',
        'summary': 'A full body checkup that adds CRP (inflammation), rheumatoid factor, a full vitamin profile (B12, B9 & D) and a urine microalbumin test.',
        'for': 'Adults over 35, people with diabetes or high blood pressure in the family, and anyone with joint pain or signs of inflammation.',
        'prep': FASTING,
        'report': EXTENDED_REPORT,
    },
    'Comprehensive Platinum Full Body Checkup with Smart Report': {
        'slug': 'comprehensive-platinum-full-body-checkup',
        'short': 'Comprehensive Platinum Full Body Checkup',
        'summary': 'Extends the Gold checkup with advanced cardiac risk markers, pancreas enzymes (amylase & lipase), total IgE, free thyroid hormones and phosphorus.',
        'for': 'Adults over 40, people with a family history of heart disease, and anyone who wants allergy and pancreas markers checked as well.',
        'prep': FASTING,
        'report': EXTENDED_REPORT,
    },
    'Comprehensive Diamond Full Body Checkup with Smart Report': {
        'slug': 'comprehensive-diamond-full-body-checkup',
        'short': 'Comprehensive Diamond Full Body Checkup',
        'summary': 'Our most complete full body checkup, with hsCRP, Lipoprotein(a), Apolipoprotein A1 & B, homocysteine, Troponin-I, insulin resistance (HOMA-IR) and cortisol.',
        'for': 'Adults over 45 and anyone with a strong family history of heart disease or diabetes who wants the most detailed screening.',
        'prep': FASTING + ['Morning collection (before 10 am) is preferred, as cortisol levels change through the day.'],
        'report': EXTENDED_REPORT,
    },
    'Fever Package Advanced (includes Dengue, Malaria & Typhoid Tests)': {
        'slug': 'fever-package-advanced',
        'short': 'Fever Package Advanced',
        'summary': 'Checks the common causes of fever in one sample: Dengue NS1 antigen, malaria antigen, typhoid (Typhidot & Widal), CBC, CRP, ESR and liver enzymes.',
        'for': 'Anyone with a fever lasting more than a couple of days, especially during the monsoon, when a doctor wants to rule out dengue, malaria or typhoid.',
        'prep': [
            'No fasting is needed for this package.',
            'Tell the phlebotomist about any medicines you have already taken for the fever, especially antibiotics or anti-malarials.',
            'Keep your doctor\'s prescription handy if you have one.',
        ],
        'report': 'Reports are usually ready within 24 hours and are shared by email and WhatsApp.',
    },
}

CITIES = [('delhi', 'Delhi'), ('gurugram', 'Gurugram'), ('noida', 'Noida'), ('ghaziabad', 'Ghaziabad'),
          ('mumbai', 'Mumbai'), ('navi-mumbai', 'Navi Mumbai'), ('bangalore', 'Bangalore'),
          ('chennai', 'Chennai'), ('kolkata', 'Kolkata'), ('lucknow', 'Lucknow')]

HUB_FAQ = [
    ('Which Tata 1mg blood test package should I choose?',
     'For a first or yearly checkup, the Good Health Gold Package covers the essentials. If you also want vitamin and iron levels, choose Aayushya Health Checkup 3 Plus or the Advanced Preventive Health Checkup. For a full body checkup with heart and inflammation markers, choose the Comprehensive Gold, Platinum or Diamond package. Our health advisors can help you decide when you call.'),
    ('Do I need to fast before a full body checkup?',
     'Yes. Every health checkup package includes fasting tests such as blood sugar or insulin resistance, so fast for 10–12 hours before sample collection. Plain water is allowed. The Fever Package Advanced does not need fasting.'),
    ('Is home sample collection included in the package price?',
     'Yes. Home sample collection is included at no extra charge. You only pay the package price.'),
    ('How soon will I get my health package report?',
     'Reports for packages with routine tests are usually ready within 24 hours. Packages with vitamin and specialised markers usually take 24–48 hours. Reports are shared by email and WhatsApp.'),
    ('Where are the samples tested?',
     'All samples are processed at NABL, CAP and ISO certified partner labs.'),
]


def esc(s):
    return html.escape(s, quote=True)


def price_number(s):
    return re.sub(r'[^0-9]', '', s)


def read_cards():
    page = (ROOT / 'index.html').read_text(encoding='utf-8')
    cards = []
    grid = page[page.index('id="health-packages"'):]
    grid = grid[:grid.index('</section>')]
    for block in grid.split('<div class="test-card"')[1:]:
        name = re.sub(r'<[^>]+>', '', re.search(r'<h4>(.*?)</h4>', block, flags=re.S).group(1)).strip()
        if name not in PACKAGES:
            continue
        def grab(cls):
            m = re.search(r'<span class="' + cls + r'">(.*?)</span>', block)
            return m.group(1).strip() if m else ''
        cards.append(dict(
            PACKAGES[name],
            name=name,
            tests=re.search(r'Contains (\d+) tests?', block).group(1),
            price=grab('current-price'),
            original=grab('original-price'),
            discount=grab('discount-badge'),
            included=[html.unescape(t).strip() for t in re.findall(r'<li>(.*?)</li>', block)],
        ))
    missing = set(PACKAGES) - {c['name'] for c in cards}
    if missing:
        raise SystemExit('Package cards not found on the homepage: ' + ', '.join(sorted(missing)))
    return cards


def head(title, description, url, schemas):
    blocks = ''.join(
        '    <script type="application/ld+json">\n' + json.dumps(s, indent=4, ensure_ascii=False) + '\n    </script>\n'
        for s in schemas)
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{esc(title)}</title>
    <meta name="description" content="{esc(description)}">
    <link rel="canonical" href="{url}" />
    <link rel="icon" type="image/png" href="/tata-logo.png">
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

'''


def breadcrumb_schema(items):
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': u} for i, (n, u) in enumerate(items)],
    }


def tail():
    footer = (PARTIALS / 'footer.html').read_text(encoding='utf-8').rstrip('\n')
    return f'''
    <!-- CTA Strip -->
    <section class="cta-strip">
        <div class="cta-strip-box">
            <h2>Ready to Book Your Health Checkup?</h2>
            <p>Speak to our health advisors or book instantly on WhatsApp.</p>
            <div class="cta-strip-buttons">
                <a href="tel:+919650461818" class="cta-btn cta-btn-call">📞 Call +91-9650461818</a>
                <a href="{WHATSAPP}" target="_blank" class="cta-btn cta-btn-whatsapp">Book on WhatsApp</a>
            </div>
        </div>
    </section>

{footer}

    <!-- Floating Contact Button -->
    <a href="tel:+919650461818" class="floating-contact" title="Contact Us">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
    </a>

    <script src="/assets/js/main.js"></script>

</body>
</html>
'''


def price_html(p, indent):
    pad = ' ' * indent
    out = f'{pad}<span class="current-price">{p["price"]}</span>\n'
    if p['original']:
        out += f'{pad}<span class="original-price">{p["original"]}</span>\n'
    if p['discount']:
        out += f'{pad}<span class="discount-badge">{p["discount"]}</span>\n'
    return out


def city_links(prefix):
    return '\n'.join(
        f'                <a href="/diagnostic-centre-in-{slug}/" class="city-link-card">{prefix} {name}</a>'
        for slug, name in CITIES)


def package_page(p, cards):
    url = f'{SITE}/health-packages/{p["slug"]}/'
    # Keep titles short enough not to be cut off in mobile results.
    for title in (f'{p["short"]} ({p["tests"]} Tests) at {p["price"]} | Tata 1mg',
                  f'{p["short"]} at {p["price"]} | Tata 1mg',
                  f'{p["short"]} at {p["price"]}'):
        if len(title) <= 60:
            break
    description = f'Book the {p["short"]} ({p["tests"]} tests) at {p["price"]} with free home sample collection. See included tests, preparation and report time.'
    schemas = [
        breadcrumb_schema([('Home', SITE + '/'), ('Health Packages', SITE + '/health-packages/'), (p['short'], url)]),
        {
            '@context': 'https://schema.org',
            '@type': 'Product',
            'name': p['short'],
            'description': p['summary'],
            'url': url,
            'brand': {'@type': 'Brand', 'name': 'Tata 1mg Labs'},
            'offers': {
                '@type': 'Offer',
                'price': price_number(p['price']),
                'priceCurrency': 'INR',
                'availability': 'https://schema.org/InStock',
                'url': url,
            },
        },
    ]
    book = WHATSAPP + '?text=' + urllib.parse.quote('Hi, I want to book ' + p['name'])
    included = '\n'.join(f'                    <li>{esc(t)}</li>' for t in p['included'])
    prep = '\n'.join(f'                    <li>{esc(t)}</li>' for t in p['prep'])
    others = '\n'.join(
        f'                <a href="/health-packages/{o["slug"]}/" class="city-link-card">{esc(o["short"])} · {o["price"]}</a>'
        for o in cards if o is not p)

    return head(title, description, url, schemas) + f'''    <header class="header"></header>

    <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span>›</span> <a href="/health-packages/">Health Packages</a><span>›</span> <span class="current">{esc(p["short"])}</span>
    </nav>

    <main>
        <section class="hero">
            <div class="hero-content" style="flex: 0 0 100%; padding: 40px 50px;">
                <h1>{esc(p["short"])}</h1>
                <p class="intro-copy">{esc(p["summary"])}</p>
            </div>
        </section>

        <section class="legal-page">
            <div class="legal-content package-detail">
                <div class="package-summary">
                    <span class="package-tests">⏱️ Contains {p["tests"]} tests</span>
                    <div class="price-section">
{price_html(p, 24)}                    </div>
                    <p>Home sample collection included at no extra cost.</p>
                    <div class="cta-strip-buttons">
                        <a href="{book}" target="_blank" class="cta-btn cta-btn-whatsapp">Book on WhatsApp</a>
                        <a href="tel:+919650461818" class="cta-btn cta-btn-call">📞 Call +91-9650461818</a>
                    </div>
                </div>

                <h2>Tests included</h2>
                <ul>
{included}
                </ul>

                <h2>Who should take this package?</h2>
                <p>{esc(p["for"])} If you have symptoms or an existing condition, check with your doctor which tests you need.</p>

                <h2>Preparation</h2>
                <ul>
{prep}
                </ul>

                <h2>Report time</h2>
                <p>{esc(p["report"])}</p>

                <h2>How home sample collection works</h2>
                <ol>
                    <li>Call <a href="tel:+919650461818">+91-9650461818</a> or message us on WhatsApp to book the {esc(p["short"])}.</li>
                    <li>Pick a time slot. A trained phlebotomist visits your home to collect the sample.</li>
                    <li>Your sample is tested at a NABL, CAP and ISO certified partner lab.</li>
                    <li>You receive your report by email and WhatsApp.</li>
                </ol>
            </div>
        </section>

        <section class="city-coverage">
            <div class="region-block">
                <h2 class="section-title">Book a Tata 1mg Blood Test in Your City</h2>
                <div class="city-link-grid">
{city_links("Tata 1mg Blood Test in")}
                </div>
            </div>
            <div class="region-block">
                <h2 class="section-title">Other Health Packages</h2>
                <div class="city-link-grid">
{others}
                </div>
            </div>
        </section>
    </main>
''' + tail()


def hub_page(cards):
    url = SITE + '/health-packages/'
    title = 'Tata 1mg Blood Test Packages | Full Body Checkup Prices'
    description = 'Compare Tata 1mg blood test packages and full body checkup packages from ₹999. Home sample collection, NABL-certified labs and digital reports.'
    schemas = [
        breadcrumb_schema([('Home', SITE + '/'), ('Health Packages', url)]),
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            'name': 'Tata 1mg Labs Health Packages',
            'itemListElement': [
                {'@type': 'ListItem', 'position': i + 1, 'name': c['short'], 'url': f'{SITE}/health-packages/{c["slug"]}/'}
                for i, c in enumerate(cards)],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': [
                {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in HUB_FAQ],
        },
    ]
    card_html = ''
    for c in cards:
        tooltip = '\n'.join(f'                        <li>{esc(t)}</li>' for t in c['included'])
        card_html += f'''
            <div class="test-card" data-test="{esc(c["short"].lower())}">
                <h4><a href="/health-packages/{c["slug"]}/">{esc(c["name"])}</a></h4>
                <div class="test-info"><span>⏱️ Contains {c["tests"]} tests</span></div>
                <div class="price-section">
{price_html(c, 20)}                </div>
                <a href="/health-packages/{c["slug"]}/" class="package-link">View tests, preparation &amp; report time &rarr;</a>
                <button class="book-btn">BOOK NOW</button>
                <div class="test-tooltip">
                    <h5>Tests Included</h5>
                    <ul>
{tooltip}
                    </ul>
                </div>
            </div>
'''
    faq = '\n'.join(f'''            <details class="faq-item">
                <summary>{esc(q)}</summary>
                <p>{esc(a)}</p>
            </details>''' for q, a in HUB_FAQ)

    return head(title, description, url, schemas) + f'''    <header class="header"></header>

    <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span>›</span> <span class="current">Health Packages</span>
    </nav>

    <main>
        <section class="hero">
            <div class="hero-content" style="flex: 0 0 100%; padding: 40px 50px;">
                <h1>Health Packages &amp; Full Body Checkups</h1>
                <p class="intro-copy">Compare Tata 1mg blood test packages, from an essential yearly checkup to a complete full body checkup package with heart, vitamin and inflammation markers. Every Tata 1mg lab test package includes home sample collection at no extra cost, testing at NABL, CAP and ISO certified partner labs, and digital reports on email and WhatsApp.</p>
            </div>
        </section>

        <section class="popular-tests" id="health-packages">
            <h2 class="section-title">All Health Packages</h2>
            <div class="test-grid" id="testGrid">
{card_html}
            </div>
        </section>

        <section class="faq-section">
            <h2 class="section-title">Frequently Asked Questions</h2>
{faq}
        </section>

        <section class="city-coverage">
            <div class="region-block">
                <h2 class="section-title">Book a Tata 1mg Blood Test in Your City</h2>
                <div class="city-link-grid">
{city_links("Tata 1mg Blood Test in")}
                </div>
            </div>
        </section>
    </main>
''' + tail()


def write(rel, text):
    header = (PARTIALS / 'header.html').read_text(encoding='utf-8').rstrip('\n')
    text = text.replace('    <header class="header"></header>', header, 1)
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding='utf-8', newline='')
    print('wrote', rel)


if __name__ == '__main__':
    cards = read_cards()
    write('health-packages/index.html', hub_page(cards))
    for p in cards:
        write(f'health-packages/{p["slug"]}/index.html', package_page(p, cards))
