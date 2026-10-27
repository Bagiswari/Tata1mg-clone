"""Build /lab-tests/ — every Tata 1mg lab test, grouped by category.

Tests come from assets/js/lab-tests-data.js (also used by the site search).
Prices come from the single-test cards on the homepage (index.html).
Run from the repo root:

    python tools/build_lab_tests_page.py
"""
import json
import re

from site_parts import (ROOT, SITE, breadcrumb_schema, card, chips_bar, esc, faq_html, faq_schema, features_section,
                        group_section, head, homepage_cards, search_box, slugify, steps_section, tail, write_page)
from build_package_pages import PACKAGES

# Homepage test card → (official test name in lab-tests-data.js or None, category id)
HOME_TESTS = {
    'CBC (Complete Blood Count)': ('CBC (Complete Blood Count)', 'blood'),
    'Thyroid Profile Total (T3, T4 & TSH)': ('Thyroid Profile Total (T3, T4 & TSH)', 'thyroid'),
    'Lipid Profile': ('Lipid Profile', 'heart'),
    'LFT (Liver Function Test)': ('LFT (Liver Function Test)', 'liver'),
    'HbA1c (Glycosylated Hemoglobin)': ('HbA1c (Glycosylated Hemoglobin)', 'diabetes'),
    'Kidney Function Test (KFT/RFT)': (None, 'kidney'),
    'Vitamin D (25-Hydroxy)': ('Vitamin D (25-Hydroxy)', 'vitamins'),
    'Vitamin B12': ('Vitamin B12', 'vitamins'),
    'FBS (Fasting Blood Sugar)': ('FBS (Fasting Blood Sugar)', 'diabetes'),
    'Urine R/M (Routine & Microscopy)': ('Urine R/M (Urine Routine & Microscopy)', 'urine'),
    'Iron Deficiency Profile': (None, 'blood'),
    'Dengue Test (NS1 Antigen)': ('Dengue Fever NS1 Antigen', 'fever'),
}
# About lines for homepage tests that are not in the official list.
ABOUT = {
    'Kidney Function Test (KFT/RFT)': 'Measures urea, creatinine, uric acid and electrolytes to check how well your kidneys are working.',
    'Iron Deficiency Profile': 'Checks serum iron, iron-binding capacity, transferrin saturation and ferritin to look for iron deficiency.',
}

FAQ = [
    ('How do I book a Tata 1mg lab test at home?',
     'Tap Book Now to call us on +91-9650461818, or message us on WhatsApp with the test name. Pick a time slot and a trained phlebotomist will collect your sample at home.'),
    ('Is there a charge for home sample collection?',
     'No. Home sample collection is included at no extra charge. You only pay for the test.'),
    ('How soon will I get my report?',
     'Routine tests such as CBC, thyroid profile and lipid profile are usually ready within 6–12 hours. Specialised tests can take a few days. The report time on each test is indicative and can vary by city. Reports are shared on email and WhatsApp.'),
    ('Do I need to fast before my test?',
     'Tests such as fasting blood sugar and lipid profile need 10–12 hours of fasting, while CBC, thyroid, HbA1c and Vitamin D do not. See our guide: <a href="/blog/which-blood-tests-need-fasting/">which blood tests need fasting</a>.'),
    ('Where are the samples tested?',
     'All samples are processed at NABL, CAP and ISO certified partner labs.'),
    ('My test is not on this list. Can I still book it?',
     'Yes. Many more tests are available. Call or WhatsApp us with the test name from your prescription and we will help you book it.'),
]


def load_categories():
    text = (ROOT / 'assets/js/lab-tests-data.js').read_text(encoding='utf-8')
    return json.loads(text[text.index('['):text.rindex(']') + 1])


def build():
    cats = load_categories()
    by_id = {c['id']: c for c in cats}
    official = {t['name']: t for c in cats for t in c['tests']}

    priced = {}  # official name → homepage price fields
    featured = []
    for h in homepage_cards():
        if h['name'] not in HOME_TESTS:
            continue
        name, cat_id = HOME_TESTS[h['name']]
        if name and name not in official:
            raise SystemExit(f'{name} is not in lab-tests-data.js')
        fields = dict(price=h['price'], original=h['original'], discount=h['discount'], reports=h['report'], tests=h['tests'])
        if name:
            priced[name] = fields
        about = official[name]['about'] if name else ABOUT[h['name']]
        c = by_id[cat_id]
        featured.append(card(dict(fields, name=h['name'], about=about), card_id='f-' + slugify(h['name']),
                             group=cat_id, group_name=c['name'], icon=c['icon']))
    missing = set(HOME_TESTS) - {h['name'] for h in homepage_cards()}
    if missing:
        raise SystemExit('Homepage test cards not found: ' + ', '.join(sorted(missing)))

    groups = ''
    for c in cats:
        cards = [card(dict(t, **priced.get(t['name'], {})), card_id='t-' + slugify(t['name']), group=c['id'],
                      group_name=c['name'], icon=c['icon'], search_extra=' '.join(c['keywords']))
                 for t in c['tests']]
        groups += group_section(c['id'], c['name'], c['icon'], c['keywords'], cards, 'tests')
    total = sum(len(c['tests']) for c in cats)

    pkg_cards = []
    home = {h['name']: h for h in homepage_cards()}
    for name in ['Good Health Gold Package with Smart Report', 'Comprehensive Gold Full Body Checkup with Smart Report',
                 'Aayushya Health Checkup 3 Plus']:
        p, h = PACKAGES[name], home[name]
        pkg_cards.append(card(dict(name=p['short'], about=p['summary'], tests=h['tests'], price=h['price'],
                                   original=h['original'], discount=h['discount'], includes=h['included'],
                                   url=f'/health-packages/{p["slug"]}/'),
                              card_id='pk-' + p['slug'], group='packages', group_name='Health package', icon='📋', noun='package'))

    url = SITE + '/lab-tests/'
    title = 'Tata 1mg Lab Tests List & Prices | Book Blood Tests at Home'
    description = (f'Browse {total}+ Tata 1mg lab tests by category: blood, thyroid, diabetes, liver, kidney, vitamins and more. '
                   'Book with free home sample collection at NABL-certified labs.')
    schemas = [
        breadcrumb_schema([('Home', SITE + '/'), ('Lab Tests', url)]),
        faq_schema([(q, re.sub(r'<[^>]+>', '', a)) for q, a in FAQ]),
    ]

    page = head(title, description, url, schemas) + f'''    <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span>›</span> <span class="current">Lab Tests</span>
    </nav>

    <main>
        <section class="hero cat-hero cat-hero--banner">
            <div class="hero-content">
                <h1>Book Lab Tests at Home</h1>
                <p class="intro-copy">Search {total}+ Tata 1mg lab tests by name or health concern. See what each test checks and how soon reports are ready, then book on call or WhatsApp.</p>
{search_box('Search a test, e.g. thyroid, CBC, vitamin D, sugar', 'Search lab tests',
            ['Thyroid', 'CBC', 'Vitamin D', 'Sugar', 'Liver', 'Kidney'])}                <ul class="cat-stats">
                    <li><strong>{total}+</strong> lab tests</li>
                    <li><strong>{len(cats)}</strong> categories</li>
                    <li><strong>NABL, CAP &amp; ISO</strong> certified labs</li>
                </ul>
            </div>
            <div class="hero-image">
                <img src="/tata-banner.png" alt="Tata 1mg Labs, India's trusted diagnostics lab" width="760" height="360">
            </div>
        </section>

        <section class="cat-section" id="all-tests" data-catalogue data-noun="tests">
            <div class="cat-featured" data-featured>
                <div class="cat-subhead">
                    <h2>Most Booked Lab Tests</h2>
                    <a href="#grp-{cats[0]['id']}" class="cat-subhead__link">Browse all {total} tests &darr;</a>
                </div>
                <div class="cat-grid">
{''.join(featured)}                </div>
            </div>

            <div class="cat-subhead cat-subhead--all">
                <h2>All Lab Tests by Category</h2>
            </div>
{chips_bar([(c['id'], c['name'], c['icon']) for c in cats], 'Filter tests by category')}            <p class="cat-count" aria-live="polite"></p>
{groups}
            <div class="cat-empty" hidden>
                <p class="cat-empty__icon" aria-hidden="true">🔍</p>
                <p>We couldn't find that test in this list. Many more tests are available, so call or WhatsApp us with the test name from your prescription.</p>
                <div class="cta-strip-buttons">
                    <a href="tel:+919650461818" class="cta-btn cta-btn-call">📞 Call +91-9650461818</a>
                    <button type="button" class="cat-reset">Show all tests</button>
                </div>
            </div>
            <p class="cat-note">Report times are indicative and can vary by city. Call us to confirm price, preparation and availability before booking.</p>
        </section>

        <section class="cat-section cat-section--packages">
            <div class="cat-subhead">
                <h2>Popular Health Packages</h2>
                <a href="/health-packages/" class="cat-subhead__link">View all health packages &rarr;</a>
            </div>
            <div class="cat-grid">
{''.join(pkg_cards)}            </div>
        </section>

{features_section()}
{steps_section()}
        <section class="faq-section">
            <h2 class="section-title">Lab Test Questions</h2>
{faq_html(FAQ)}
        </section>
    </main>
''' + tail("Can't find your test?", 'Our health advisors can help you book any test or health package.')
    write_page('lab-tests/index.html', page)


if __name__ == '__main__':
    build()
