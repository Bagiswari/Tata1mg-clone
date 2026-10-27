"""Build /health-packages/ and one page per priced health package.

Prices, test counts and included tests of the priced packages are read from the
package cards on the homepage (index.html), so edit them there. The extra copy for
each priced package (summary, who it's for, preparation, report time) lives in
PACKAGES below. The full Tata 1mg package catalogue shown on /health-packages/
(name, about, tests, report time, included tests; no prices) is
tools/data/health-packages.json. Run from the repo root:

    python tools/build_package_pages.py
"""
import json

from site_parts import (ROOT, SITE, breadcrumb_schema, card, chips_bar, city_links, esc, faq_html, faq_schema,
                        group_section, head, homepage_cards, price_number, search_box, slugify, steps_section, tail,
                        whatsapp_link, write_page)

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


HUB_FAQ = [
    ('Which Tata 1mg blood test package should I choose?',
     'For a first or yearly checkup, the Good Health Gold Package covers the essentials. If you also want vitamin and iron levels, choose Aayushya Health Checkup 3 Plus or the Advanced Preventive Health Checkup. For a full body checkup with heart and inflammation markers, choose the Comprehensive Gold, Platinum or Diamond package. Our health advisors can help you decide when you call.'),
    ('Do I need to fast before a full body checkup?',
     'Yes. Every health checkup package includes fasting tests such as blood sugar or insulin resistance, so fast for 10–12 hours before sample collection. Plain water is allowed. The Fever Package Advanced does not need fasting.'),
    ('Is home sample collection included in the package price?',
     'Yes. Home sample collection is included at no extra charge. You only pay the package price.'),
    ('How soon will I get my health package report?',
     'Most checkup packages are ready within 24–48 hours. Specialised and genetic packages can take from a few days to a few weeks; the report time shown on each package is indicative and can vary by city. Reports are shared by email and WhatsApp.'),
    ('Where are the samples tested?',
     'All samples are processed at NABL, CAP and ISO certified partner labs.'),
]




def read_cards():
    """The priced packages, in homepage order, with their PACKAGES copy."""
    cards = [dict(c, **PACKAGES[c['name']]) for c in homepage_cards() if c['name'] in PACKAGES]
    missing = set(PACKAGES) - {c['name'] for c in cards}
    if missing:
        raise SystemExit('Package cards not found on the homepage: ' + ', '.join(sorted(missing)))
    return cards


def load_catalogue():
    return json.loads((ROOT / 'tools/data/health-packages.json').read_text(encoding='utf-8'))


def package_card(p, card_id):
    return card(dict(name=p['short'], about=p['summary'], tests=p['tests'], price=p['price'], original=p['original'],
                     discount=p['discount'], includes=p['included'], url=f'/health-packages/{p["slug"]}/'),
                card_id=card_id, group='featured', group_name='Health package', icon='📋', noun='package',
                search_extra=p['name'])


def report_summary(p):
    """Short report time for the facts row."""
    return 'Within 24 hours' if p['report'] != EXTENDED_REPORT else '24–48 hours'


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
    included = '\n'.join(f'                        <li>{esc(t)}</li>' for t in p['included'])
    prep = '\n'.join(f'                        <li>{esc(t)}</li>' for t in p['prep'])
    mrp = f'                    <span class="original-price">{p["original"]}</span>\n' if p['original'] else ''
    off = f'                    <span class="discount-badge">{p["discount"]}</span>\n' if p['discount'] else ''
    save = ''
    if p['original']:
        saved = int(price_number(p['original'])) - int(price_number(p['price']))
        save = f'                <p class="pkg-buy__save">You save ₹{saved:,} on MRP</p>\n'
    # the three other packages closest in price
    others = sorted((o for o in cards if o is not p),
                    key=lambda o: abs(int(price_number(o['price'])) - int(price_number(p['price']))))[:3]

    return head(title, description, url, schemas) + f'''    <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span>›</span> <a href="/health-packages/">Health Packages</a><span>›</span> <span class="current">{esc(p["short"])}</span>
    </nav>

    <main>
        <section class="hero cat-hero">
            <div class="hero-content">
                <p class="cat-hero__type">📋 Health package</p>
                <h1>{esc(p["short"])}</h1>
                <p class="intro-copy">{esc(p["summary"])}</p>
            </div>
        </section>

        <section class="pkg-detail">
            <div class="pkg-detail__main">
                <ul class="pkg-facts">
                    <li><span class="pkg-facts__icon" aria-hidden="true">🧪</span><span><span class="pkg-facts__label">Tests included</span><span class="pkg-facts__value">{p["tests"]} tests</span></span></li>
                    <li><span class="pkg-facts__icon" aria-hidden="true">⏱️</span><span><span class="pkg-facts__label">Report time</span><span class="pkg-facts__value">{report_summary(p)}</span></span></li>
                    <li><span class="pkg-facts__icon" aria-hidden="true">🏠</span><span><span class="pkg-facts__label">Sample collection</span><span class="pkg-facts__value">At home, no extra cost</span></span></li>
                    <li><span class="pkg-facts__icon" aria-hidden="true">📄</span><span><span class="pkg-facts__label">Reports</span><span class="pkg-facts__value">Email &amp; WhatsApp</span></span></li>
                </ul>

                <div class="legal-content package-detail">
                    <h2>Tests included</h2>
                    <p class="pkg-muted">{len(p["included"])} test groups · {p["tests"]} tests in total</p>
                    <ul class="cat-includes cat-includes--lg">
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
            </div>

            <aside class="pkg-buy" aria-label="Price and booking">
                <p class="pkg-buy__label">Package price</p>
                <div class="price-section">
                    <span class="current-price">{p["price"]}</span>
{mrp}{off}                </div>
{save}                <a href="{whatsapp_link(p["name"])}" target="_blank" class="cta-btn cta-btn-whatsapp pkg-buy__btn">Book on WhatsApp</a>
                <a href="tel:+919650461818" class="cta-btn cta-btn-call pkg-buy__btn">📞 Call +91-9650461818</a>
                <ul class="pkg-buy__points">
                    <li>✔ Home sample collection included</li>
                    <li>✔ NABL, CAP &amp; ISO certified partner labs</li>
                    <li>✔ Available 24/7 on call and WhatsApp</li>
                </ul>
            </aside>
        </section>

        <section class="cat-section">
            <div class="cat-subhead">
                <h2>Compare Other Packages</h2>
                <a href="/health-packages/" class="cat-subhead__link">View all health packages &rarr;</a>
            </div>
            <div class="cat-grid">
{''.join(package_card(o, 'pk-' + o['slug']) for o in others)}            </div>
        </section>

        <section class="city-coverage">
            <div class="region-block">
                <h2 class="section-title">Book a Tata 1mg Blood Test in Your City</h2>
                <div class="city-link-grid">
{city_links()}
                </div>
            </div>
        </section>
    </main>
''' + tail()


def hub_page(cards):
    url = SITE + '/health-packages/'
    catalogue = load_catalogue()
    priced = {c['name']: c for c in cards}
    listed = {p['name'] for g in catalogue for p in g['packages']}
    total = len(listed) + sum(1 for c in cards if c['name'] not in listed)
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
        faq_schema(HUB_FAQ),
    ]

    groups = ''
    for g in catalogue:
        group_cards = []
        for p in g['packages']:
            item = dict(p)
            c = priced.get(p['name'])
            if c:  # priced package: homepage price and its own page
                item.update(price=c['price'], original=c['original'], discount=c['discount'],
                            url=f'/health-packages/{c["slug"]}/')
            group_cards.append(card(item, card_id='p-' + slugify(p['name']), group=g['id'], group_name=g['name'],
                                    icon=g['icon'], noun='package', search_extra=' '.join(g['keywords'])))
        groups += group_section(g['id'], g['name'], g['icon'], g['keywords'], group_cards, 'packages')

    return head(title, description, url, schemas) + f'''    <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span>›</span> <span class="current">Health Packages</span>
    </nav>

    <main>
        <section class="hero cat-hero--banner">
            <div class="hero-content">
                <h1>Health Packages &amp; Full Body Checkups</h1>
                <p class="intro-copy">Compare Tata 1mg blood test packages and full body checkups for women, men, seniors, diabetes and more.</p>
{search_box('Search a package, e.g. full body, women, diabetes', 'Search health packages',
            ['Full body', 'Women', 'Diabetes', 'Vitamin'])}            </div>
            <div class="hero-image">
                <img src="/tata-banner.png" alt="Tata 1mg Labs, India's trusted diagnostics lab" width="760" height="360">
            </div>
        </section>

        <section class="cat-section" id="all-packages" data-catalogue data-noun="packages">
            <div class="cat-featured" data-featured>
                <div class="cat-subhead">
                    <h2>Most Booked Health Packages</h2>
                    <a href="#grp-{catalogue[0]['id']}" class="cat-subhead__link">Browse all {total} packages &darr;</a>
                </div>
                <div class="cat-grid">
{''.join(package_card(c, 'f-' + c['slug']) for c in cards)}                </div>
            </div>

            <div class="cat-subhead cat-subhead--all">
                <h2>All Health Packages by Category</h2>
            </div>
{chips_bar([(g['id'], g['name'], g['icon']) for g in catalogue], 'Filter packages by category')}            <p class="cat-count" aria-live="polite"></p>
{groups}
            <div class="cat-empty" hidden>
                <p class="cat-empty__icon" aria-hidden="true">🔍</p>
                <p>We couldn't find that package. Call or WhatsApp us and we'll help you choose the right checkup.</p>
                <div class="cta-strip-buttons">
                    <a href="tel:+919650461818" class="cta-btn cta-btn-call">📞 Call +91-9650461818</a>
                    <button type="button" class="cat-reset">Show all packages</button>
                </div>
            </div>
            <p class="cat-note">For packages without a listed price, call us for the current price. Report times are indicative and can vary by city.</p>
        </section>

{steps_section()}
        <section class="faq-section">
            <h2 class="section-title">Frequently Asked Questions</h2>
{faq_html(HUB_FAQ)}
        </section>

        <section class="city-coverage">
            <div class="region-block">
                <h2 class="section-title">Book a Tata 1mg Blood Test in Your City</h2>
                <div class="city-link-grid">
{city_links()}
                </div>
            </div>
        </section>
    </main>
''' + tail('Not sure which package to choose?', 'Call or WhatsApp our health advisors and we will help you pick the right checkup.')


if __name__ == '__main__':
    cards = read_cards()
    write_page('health-packages/index.html', hub_page(cards))
    for p in cards:
        write_page(f'health-packages/{p["slug"]}/index.html', package_page(p, cards))
