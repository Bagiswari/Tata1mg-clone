"""Copy the shared header and footer into every page of the site.

The site is plain static HTML, so the header/footer markup lives in every page.
Edit tools/partials/header.html or footer.html, then run from the repo root:

    python tools/sync_partials.py

It also keeps every phone link on the one contact number.
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PARTIALS = ROOT / 'tools' / 'partials'

HEADER = (PARTIALS / 'header.html').read_text(encoding='utf-8').rstrip('\n')
FOOTER = (PARTIALS / 'footer.html').read_text(encoding='utf-8').rstrip('\n')

# Old phone markup → the one number used across the site.
PHONE_FIXES = [
    ('href="tel:9650461818"', 'href="tel:+919650461818"'),
    ('📞 Call 9650461818<', '📞 Call +91-9650461818<'),
]


def sync(path):
    html = path.read_text(encoding='utf-8')
    new = re.sub(r'[ \t]*<header class="header">.*?</header>', lambda m: HEADER, html, count=1, flags=re.S)
    new = re.sub(r'[ \t]*<footer class="footer">.*?</footer>', lambda m: FOOTER, new, count=1, flags=re.S)
    for old, fixed in PHONE_FIXES:
        new = new.replace(old, fixed)
    # Every phone link dials directly (no contact popup).
    new = re.sub(r' data-contact="[a-z]+"', '', new)
    # The inline "no results" message is replaced by the contact modal.
    new = re.sub(r'\s*<div class="no-results" id="noResults">.*?</div>', '', new, count=1, flags=re.S)
    if new != html:
        path.write_text(new, encoding='utf-8', newline='')
        return True
    return False


if __name__ == '__main__':
    pages = [p for p in ROOT.rglob('*.html') if 'tools' not in p.relative_to(ROOT).parts]
    for page in sorted(pages):
        print(('updated  ' if sync(page) else 'unchanged') + ' ' + str(page.relative_to(ROOT)))
