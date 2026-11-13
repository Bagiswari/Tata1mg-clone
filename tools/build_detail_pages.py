"""Build one page per test (/lab-tests/<slug>/) and per package (/health-packages/<slug>/).

Every fact on these pages comes from the official Tata 1mg page of that test or
package (tools/data/details.json, copied word for word from https://www.1mg.com/labs/).
Only tests and packages listed on /lab-tests/ and /health-packages/ get a page, and
only when their official details were found. Priced packages keep their own page
(build_package_pages.py), which shows the same official details.
Also adds every detail page to sitemap.xml. Run from the repo root:

    python tools/build_detail_pages.py
"""
import json
import re

from site_parts import (ROOT, SITE, breadcrumb_schema, card, esc, head, icon, load_details, official_facts_html,
                        official_sections_html, slugify, tail, whatsapp_link, write_page, PHONE_TEL, PHONE_DISPLAY)
from build_lab_tests_page import load_categories
from build_package_pages import PACKAGES, load_catalogue

TODAY = '2026-11-13'


def test_url(name):
    return f'/lab-tests/{slugify(name)}/'


def package_url(name):
    """Priced packages open their own page; every other package its detail page."""
    if name in PACKAGES:
        return f'/health-packages/{PACKAGES[name]["slug"]}/'
    return f'/health-packages/{slugify(name)}/'


def detail_page(kind, item, d, group, more_cards):
    name = item['name']
    url_path = test_url(name) if kind == 'test' else package_url(name)
    url = SITE + url_path
    hub = ('/lab-tests/', 'Lab Tests') if kind == 'test' else ('/health-packages/', 'Health Packages')
    noun = 'test' if kind == 'test' else 'package'
    for title in (f'{name} | Tata 1mg Labs', name):
        if len(title) <= 65:
            break
    description = (f'{name}: what it measures, samples required, preparations and report time. '
                   'Book with home sample collection on call or WhatsApp.')
    schemas = [breadcrumb_schema([('Home', SITE + '/'), (hub[1], SITE + hub[0]), (name, url)])]
    about = f'                <p class="intro-copy">{esc(d["about"])}</p>\n' if d.get('about') else ''
    more = ''
    if more_cards:
        more = f'''        <section class="cat-section">
            <div class="cat-subhead">
                <h2>More in {esc(group["name"])}</h2>
                <a href="{hub[0]}" class="cat-subhead__link">View all {hub[1].lower()} &rarr;</a>
            </div>
            <div class="cat-grid">
{''.join(more_cards)}            </div>
        </section>
'''
    return url_path, head(title, description, url, schemas) + f'''    <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span>›</span> <a href="{hub[0]}">{hub[1]}</a><span>›</span> <span class="current">{esc(name)}</span>
    </nav>

    <main>
        <section class="hero cat-hero">
            <div class="hero-content">
                <p class="cat-hero__type">{icon(group["icon"])}{esc(group["name"])}</p>
                <h1>{esc(name)}</h1>
{about}            </div>
        </section>

        <section class="pkg-detail">
            <div class="pkg-detail__main">
{official_facts_html(d)}
                <div class="legal-content package-detail od">
{official_sections_html(d, name)}                </div>
            </div>

            <aside class="pkg-buy" aria-label="Booking">
                <p class="pkg-buy__label">Book this {noun}</p>
                <a href="{PHONE_TEL}" class="cta-btn cta-btn-call pkg-buy__btn">{icon("phone")}Call {PHONE_DISPLAY}</a>
                <a href="{whatsapp_link(name)}" target="_blank" class="cta-btn cta-btn-whatsapp pkg-buy__btn">Book on WhatsApp</a>
            </aside>
        </section>
{more}    </main>
''' + tail()


def update_sitemap(paths):
    sm = ROOT / 'sitemap.xml'
    text = sm.read_text(encoding='utf-8')
    # drop detail URLs from an earlier run, keep everything else
    text = re.sub(r'  <url>\s*<loc>https://tata1mglabs\.com/(?:lab-tests|health-packages)/[^<]+/</loc>\s*<lastmod>[^<]*</lastmod>\s*'
                  r'<changefreq>monthly</changefreq>\s*<priority>0\.6</priority>\s*</url>\n', '', text)
    have = set(re.findall(r'<loc>([^<]+)</loc>', text))
    add = ''.join(f'''  <url>
    <loc>{SITE}{p}</loc>
    <lastmod>{TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
''' for p in paths if SITE + p not in have)
    sm.write_text(text.replace('</urlset>', add + '</urlset>'), encoding='utf-8', newline='')
    print('sitemap.xml:', len(paths), 'detail pages')


def build():
    details = load_details()
    paths = []

    for c in load_categories():
        with_details = [t for t in c['tests'] if t['name'] in details['tests']]
        for t in with_details:
            others = [o for o in with_details if o is not t][:3]
            cards = [card(dict(o, url=test_url(o['name'])), card_id='m-' + slugify(o['name']), group=c['id'],
                          group_name=c['name'], icon_name=c['icon']) for o in others]
            path, page = detail_page('test', t, details['tests'][t['name']], c, cards)
            write_page(path.strip('/') + '/index.html', page)
            paths.append(path)

    for g in load_catalogue():
        with_details = [p for p in g['packages'] if p['name'] in details['packages']]
        for p in with_details:
            if p['name'] in PACKAGES:
                continue  # priced package: its own page (build_package_pages.py)
            others = [o for o in with_details if o is not p][:3]
            cards = [card(dict(o, url=package_url(o['name'])), card_id='m-' + slugify(o['name']), group=g['id'],
                          group_name=g['name'], icon_name=g['icon'], noun='package') for o in others]
            path, page = detail_page('package', p, details['packages'][p['name']], g, cards)
            write_page(path.strip('/') + '/index.html', page)
            paths.append(path)

    update_sitemap(paths)


if __name__ == '__main__':
    build()
