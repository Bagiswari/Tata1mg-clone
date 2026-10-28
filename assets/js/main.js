// ── Site-wide settings (single source for contact details) ───────────
var SITE = {
    phoneDisplay: '+91-9650461818',
    phoneTel:     'tel:+919650461818',
    whatsapp:     'https://wa.me/919650461818'
};

// Blog posts the search can find. Keep in sync with /blog/.
var BLOG_POSTS = [
    {
        title: "Full Body Checkup Test List with Names: What Each Test Checks",
        url:   '/blog/full-body-checkup-test-list-with-names/'
    },
    {
        title: "Which Blood Tests Need Fasting? A Simple Guide Before Your Test",
        url:   '/blog/which-blood-tests-need-fasting/'
    },
    {
        title: "SGPT Test Normal Range: What High ALT Levels Mean",
        url:   '/blog/sgpt-test-normal-range/'
    },
    {
        title: "Thyroid Test (T3, T4, TSH) Explained: Normal Range and Results",
        url:   '/blog/thyroid-test-t3-t4-tsh-explained/'
    },
    {
        title: "Vitamin D Test at Home: Normal Range, Price and Who Should Get Tested",
        url:   '/blog/vitamin-d-test-at-home/'
    },
    {
        title: 'Full Body Checkup: What Tests Are Usually Included and Why They Matter',
        url:   '/blog/full-body-checkup-what-tests-are-usually-included-and-why-they-matter/'
    }
];

// City pages the search can find (see /diagnostic-centre/).
var CITY_PAGES = {
    'delhi': 'delhi', 'new delhi': 'delhi', 'gurugram': 'gurugram', 'gurgaon': 'gurugram',
    'noida': 'noida', 'ghaziabad': 'ghaziabad', 'mumbai': 'mumbai', 'navi mumbai': 'navi-mumbai',
    'bangalore': 'bangalore', 'bengaluru': 'bangalore', 'chennai': 'chennai',
    'kolkata': 'kolkata', 'lucknow': 'lucknow'
};

var RADIOLOGY_WORDS = ['radiology', 'x ray', 'xray', 'ultrasound', 'usg', 'sonography', 'ct scan', 'ct', 'mri', 'mri scan', 'scan', 'scans', 'imaging'];

// Whole-query intents → destination. First match wins.
var SEARCH_INTENTS = [
    { go: { call: true },           words: ['call', 'call us', 'phone', 'phone number'] },
    { go: { url: '/contact-us/' },  words: ['contact', 'contact us', 'customer care', 'support', 'help', 'help center', 'help centre', 'enquiry', 'address'] },
    { go: { url: '/radiology/' },   words: RADIOLOGY_WORDS },
    { go: { url: '/blog/' },        words: ['blog', 'blogs', 'article', 'articles', 'health blog'] },
    { go: { url: '/diagnostic-centre/' }, words: ['location', 'locations', 'diagnostic centre', 'diagnostic center', 'centre', 'center', 'lab near me', 'near me', 'cities', 'city'] },
    { go: { packages: true },       words: ['health package', 'health packages', 'package', 'packages', 'health checkup', 'health checkups', 'checkup', 'check up', 'full body checkup', 'full body check up'] },
    { go: { url: '/lab-tests/' },   words: ['lab test', 'lab tests', 'test', 'tests', 'blood test', 'blood tests', 'all tests', 'pathology'] }
];

// Words that don't identify a specific test ("thyroid test price" → "thyroid").
var FILLER_WORDS = ['test', 'tests', 'lab', 'labs', 'price', 'cost', 'book', 'booking', 'online', 'at', 'home', 'for', 'the', 'a', 'of', 'near', 'me', 'in', 'blood'];

function normalizeText(s) {
    return (s || '').toLowerCase().replace(/x-ray/g, 'x ray').replace(/[^a-z0-9]+/g, ' ').trim();
}

// Searching "call" / "phone" starts the call straight away.
function callUs() {
    window.location.href = SITE.phoneTel;
}

// ── "No results" message for the search (the only popup besides the lead form) ──
var noResultsModal = null;
var noResultsReturnFocus = null;

function buildNoResultsModal() {
    var overlay = document.createElement('div');
    overlay.className = 'popup-overlay hidden';
    overlay.id = 'noResultsModal';
    overlay.innerHTML =
        '<div class="popup-modal" role="dialog" aria-modal="true" aria-labelledby="noResultsTitle">' +
            '<button type="button" class="popup-close" aria-label="Close">✕</button>' +
            '<div class="popup-content no-results-modal">' +
                '<h2 id="noResultsTitle">Please contact us for more info</h2>' +
                '<p class="no-results-text"></p>' +
                '<a class="no-results-call" href="' + SITE.phoneTel + '">📞 Call ' + SITE.phoneDisplay + '</a>' +
            '</div>' +
        '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) { if (e.target === overlay) closeNoResultsModal(); });
    overlay.querySelector('.popup-close').addEventListener('click', closeNoResultsModal);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeNoResultsModal();
    });
    return overlay;
}

function openNoResultsModal(query) {
    if (!noResultsModal) noResultsModal = buildNoResultsModal();
    noResultsModal.querySelector('.no-results-text').textContent = 'We couldn’t find “' + query + '” on our website.';
    noResultsReturnFocus = document.activeElement;
    noResultsModal.classList.remove('hidden');
    noResultsModal.querySelector('.no-results-call').focus();
}

function closeNoResultsModal() {
    noResultsModal.classList.add('hidden');
    if (noResultsReturnFocus && noResultsReturnFocus.focus) noResultsReturnFocus.focus();
}

// ── Lab test data (loaded on demand for search) ───────────────────────
function withLabTests(callback) {
    if (window.LAB_TEST_CATEGORIES) return callback(window.LAB_TEST_CATEGORIES);
    var s = document.createElement('script');
    s.src = '/assets/js/lab-tests-data.js';
    s.onload  = function() { callback(window.LAB_TEST_CATEGORIES || []); };
    s.onerror = function() { callback([]); };
    document.head.appendChild(s);
}

// ── Health package data (loaded on demand for search) ─────────────────
function withHealthPackages(callback) {
    if (window.HEALTH_PACKAGE_GROUPS) return callback(window.HEALTH_PACKAGE_GROUPS);
    var s = document.createElement('script');
    s.src = '/assets/js/health-packages-data.js';
    s.onload  = function() { callback(window.HEALTH_PACKAGE_GROUPS || []); };
    s.onerror = function() { callback([]); };
    document.head.appendChild(s);
}

// Card ids on /lab-tests/ and /health-packages/ (same as slugify() in tools/site_parts.py).
function slugify(s) {
    return s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Words ignored when matching single words ("vitamin for kids" → "vitamin").
var STOP_WORDS = FILLER_WORDS.concat(['and', 'with', 'my', 'to', 'is', 'i', 'want', 'need', 'get', 'check', 'please', 'any', 'all', 'you', 'your', 'do', 'how', 'what']);

// True when every word of `query` appears in `text` (1–2 letter words must match whole words).
function containsAllWords(text, query) {
    var hay = ' ' + normalizeText(text) + ' ';
    return query.split(' ').every(function(w) {
        return hay.indexOf(w.length <= 2 ? ' ' + w + ' ' : w) !== -1;
    });
}

// Words of the query (3+ letters, not stop words) used when matching single words.
function keyWords(query) {
    return query.split(' ').filter(function(w) { return w.length >= 3 && STOP_WORDS.indexOf(w) === -1; });
}

// mode 'all': every word of the query matches. mode 'any': at least one key word starts a word in `text`.
function textMatches(text, query, mode) {
    if (mode === 'all') return containsAllWords(text, query);
    var hay = ' ' + normalizeText(text) + ' ';
    return keyWords(query).some(function(w) { return hay.indexOf(' ' + w) !== -1; });
}

function labTestsMatch(categories, query, mode) {
    return categories.some(function(c) {
        return textMatches(c.name, query, mode) || c.tests.some(function(t) { return textMatches(t.name, query, mode); });
    });
}

// Health packages & tests shown on the homepage (the single source for package data).
var homeCardTexts = null;
function withHomeCards(callback) {
    if (homeCardTexts) return callback(homeCardTexts);
    fetch('/').then(function(r) { return r.text(); }).then(function(html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        homeCardTexts = [].map.call(doc.querySelectorAll('#health-packages .test-card'), cardText);
        callback(homeCardTexts);
    }).catch(function() { callback([]); });
}

// ── Search (global so onclick= can find it) ──────────────────────────
function cardText(card) {
    return card.getAttribute('data-test') + ' ' + card.querySelector('h4').textContent;
}

function showAllTestCards() {
    document.querySelectorAll('.test-card').forEach(function(card) {
        card.classList.remove('hidden', 'highlight');
    });
}

// Filters the test/package cards on this page and scrolls to the first match. Returns true if any matched.
// term: the typed text (lowercase); core: the normalized query without filler words; mode: 'all' | 'any'.
function filterTestCards(term, core, mode) {
    var testCards  = document.querySelectorAll('.test-card');
    var foundCount = 0;
    var firstCard  = null;

    testCards.forEach(function(card) {
        card.classList.remove('highlight');
        var text  = cardText(card);
        var match = term === '' || (mode === 'all' && term.length >= 3 && text.toLowerCase().includes(term)) || textMatches(text, core, mode);
        if (match) {
            foundCount++;
            if (!firstCard) firstCard = card;
        }
        card.dataset.match = match ? '1' : '';
    });

    if (foundCount === 0) return false;

    testCards.forEach(function(card) { card.classList.toggle('hidden', !card.dataset.match); });
    if (term !== '') {
        setTimeout(function() {
            firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstCard.classList.add('highlight');
            setTimeout(function() { firstCard.classList.remove('highlight'); }, 1000);
        }, 100);
    }
    return true;
}

function goToHealthPackages() {
    var section = document.getElementById('health-packages') || document.getElementById('all-packages');
    if (section) {
        showAllTestCards();
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        window.location.href = '/health-packages/';
    }
}

function runIntent(go) {
    if (go.call)     return callUs();
    if (go.packages) return goToHealthPackages();
    window.location.href = go.url;
}

function matchIntent(q) {
    for (var i = 0; i < SEARCH_INTENTS.length; i++) {
        var words = SEARCH_INTENTS[i].words;
        for (var j = 0; j < words.length; j++) {
            if (q === words[j] || (q.length >= 4 && words[j].indexOf(q) === 0)) return SEARCH_INTENTS[i].go;
        }
    }
    return null;
}

function matchCity(q) {
    var padded = ' ' + q + ' ';
    var best = null;
    Object.keys(CITY_PAGES).forEach(function(name) {
        if (padded.indexOf(' ' + name + ' ') !== -1 && (!best || name.length > best.length)) best = name;
    });
    return best ? '/diagnostic-centre-in-' + CITY_PAGES[best] + '/' : null;
}

function searchTests() {
    var raw = document.getElementById('searchInput').value.trim();
    var q   = normalizeText(raw);

    if (q === '') { showAllTestCards(); return; }

    // 1. Pages, services and contact ("radiology", "blog", "health package"…)
    var intent = matchIntent(q);
    if (intent) return runIntent(intent);

    // 2. A city ("lab test in delhi")
    var city = matchCity(q);
    if (city) { window.location.href = city; return; }

    var core   = q.split(' ').filter(function(w) { return FILLER_WORDS.indexOf(w) === -1; }).join(' ') || q;
    var onHome = !!document.getElementById('health-packages');

    withLabTests(function(categories) {
        withHomeCards(function(homeCards) {
            // 3. Take the user to where the test or package is shown: first the whole query,
            //    then any single matching word.
            var modes = ['all', 'any'];
            for (var i = 0; i < modes.length; i++) {
                var mode = modes[i];
                if (mode === 'all' && core.length < 2) continue;
                if (mode === 'any' && keyWords(core).length === 0) continue;

                if (filterTestCards(raw.toLowerCase(), core, mode)) return;          // cards on this page
                if (labTestsMatch(categories, core, mode)) {                          // Lab Tests page
                    window.location.href = '/lab-tests/?q=' + encodeURIComponent(core);
                    return;
                }
                if (!onHome && homeCards.some(function(t) { return textMatches(t, core, mode); })) {
                    window.location.href = '/?q=' + encodeURIComponent(core) + '#health-packages';
                    return;
                }

                if (mode === 'all') {
                    // Radiology words and blog titles
                    var radiology = RADIOLOGY_WORDS.some(function(w) { return (' ' + q + ' ').indexOf(' ' + w + ' ') !== -1; });
                    if (radiology) { window.location.href = '/radiology/'; return; }
                    for (var b = 0; b < BLOG_POSTS.length; b++) {
                        if (containsAllWords(BLOG_POSTS[b].title, q)) { window.location.href = BLOG_POSTS[b].url; return; }
                    }
                }
            }

            // 4. Nothing matched
            openNoResultsModal(raw);
        });
    });
}

// ── Lab Tests & Health Packages catalogue (/lab-tests/, /health-packages/) ──
// The cards are static HTML (built by tools/build_lab_tests_page.py and
// tools/build_package_pages.py); this adds the search with live suggestions,
// the category chips and the "View all" buttons.

// Score how well a name matches a partial query: every typed word must start a
// word or appear inside the name (or, failing that, in `extra`). 0 = no match.
function suggestScore(name, extra, q) {
    var words = q.split(' ').filter(Boolean);
    if (!words.length) return 0;
    var n = normalizeText(name);
    var hay = ' ' + n + ' ' + normalizeText(extra);
    var s = 0;
    for (var i = 0; i < words.length; i++) {
        var w = words[i];
        if (n.indexOf(w) === 0) s += 6;
        else if ((' ' + n).indexOf(' ' + w) !== -1) s += 4;
        else if (n.indexOf(w) !== -1) s += 2;
        else if (hay.indexOf(' ' + w) !== -1) s += 1;
        else return 0;
    }
    return s - n.length / 200; // shorter names win ties
}

// Best n suggestions for q. items: { name, extra, boost }. If any names match, only
// name matches are shown; otherwise matches on category words ("sugar" → diabetes tests).
function rankSuggestions(items, q, n) {
    function ranked(withExtra) {
        return items.map(function(i) { var s = suggestScore(i.name, withExtra ? i.extra : '', q); return { i: i, s: s && s + (i.boost || 0) }; })
            .filter(function(x) { return x.s > 0; });
    }
    var hits = ranked(false);
    if (!hits.length) hits = ranked(true);
    return hits.sort(function(a, b) { return b.s - a.s; }).slice(0, n).map(function(x) { return x.i; });
}

// An icon from assets/icons/icons.svg (same markup as icon() in tools/site_parts.py).
function iconEl(name) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'ic');
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS(ns, 'use');
    use.setAttribute('href', '/assets/icons/icons.svg#i-' + name);
    svg.appendChild(use);
    return svg;
}

// Scroll a card into view and highlight it briefly.
function focusCard(el) {
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); // phones: close the keyboard
    setTimeout(function() { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
    el.classList.add('is-focus');
    setTimeout(function() { el.classList.remove('is-focus'); }, 3000);
}

function makeEl(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
}

// Live suggestions under a search box. build(q) returns
//   { sections: [{ label, items: [{ icon, name, meta, pill, href | pick }], chips }],
//     all: { label, pick } }
// Items with href are links; items with pick() are buttons. Arrow keys move through
// the rows, Enter opens the highlighted one, Escape or a click outside closes the list.
function attachSuggest(input, drop, wrap, build) {
    var active = -1;
    function rows() { return [].slice.call(drop.querySelectorAll('.cat-suggest__row')); }
    function close() {
        drop.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        active = -1;
    }
    function row(item, cls) {
        var r = makeEl(item.href ? 'a' : 'button', cls);
        if (item.href) r.href = item.href; else r.type = 'button';
        r.setAttribute('role', 'option');
        if (item.pick) r.addEventListener('click', function() { close(); item.pick(); });
        return r;
    }
    function render() {
        var q = normalizeText(input.value);
        if (q.length < 2) return close();
        var res = build(q);
        if (!res) return close(); // data still loading
        drop.innerHTML = '';
        if (!res.sections.some(function(sec) { return sec.items.length; })) {
            var none = makeEl('div', 'cat-suggest__empty');
            none.appendChild(makeEl('p', '', 'No match for “' + input.value.trim() + '”. Call us and we will help.'));
            var call = makeEl('a', 'cat-btn cat-btn--book');
            call.href = SITE.phoneTel;
            call.appendChild(iconEl('phone'));
            call.appendChild(document.createTextNode('Call'));
            none.appendChild(call);
            drop.appendChild(none);
        }
        res.sections.forEach(function(sec) {
            if (!sec.items.length) return;
            drop.appendChild(makeEl('p', 'cat-suggest__label', sec.label));
            var box = sec.chips ? drop.appendChild(makeEl('div', 'cat-suggest__chips')) : drop;
            sec.items.forEach(function(item) {
                var r = row(item, sec.chips ? 'cat-suggest__row cat-suggest__chip' : 'cat-suggest__row');
                if (sec.chips) {
                    r.appendChild(iconEl(item.icon));
                    r.appendChild(document.createTextNode(item.name));
                } else {
                    r.appendChild(makeEl('span', 'cat-suggest__icon')).appendChild(iconEl(item.icon));
                    var name = makeEl('span', 'cat-suggest__name', item.name);
                    name.appendChild(makeEl('small', '', item.meta || item.pill));
                    r.appendChild(name);
                    r.appendChild(makeEl('span', 'cat-suggest__cat', item.pill));
                }
                box.appendChild(r);
            });
        });
        var all = makeEl('button', 'cat-suggest__all', res.all.label);
        all.type = 'button';
        all.addEventListener('click', function() { close(); res.all.pick(); });
        drop.appendChild(all);
        drop.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        active = -1;
    }

    input.addEventListener('focus', render);
    input.addEventListener('keydown', function(e) {
        var r = rows();
        if (e.key === 'Escape') return close();
        if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !drop.hidden && r.length) {
            e.preventDefault();
            active = (active + (e.key === 'ArrowDown' ? 1 : -1) + r.length) % r.length;
            r.forEach(function(el, i) { el.classList.toggle('is-active', i === active); });
            r[active].scrollIntoView({ block: 'nearest' });
        }
        if (e.key === 'Enter' && active >= 0 && r[active]) {
            e.preventDefault();
            r[active].click();
        }
    });
    document.addEventListener('pointerdown', function(e) {
        if (!wrap.contains(e.target)) close();
    });
    return { render: render, close: close };
}

function initCatalogue() {
    var root = document.querySelector('[data-catalogue]');
    if (!root) return;

    var noun     = root.getAttribute('data-noun');
    var input    = document.getElementById('catSearch');
    var drop     = document.getElementById('catSuggest');
    var form     = input.closest('form');
    var featured = root.querySelector('[data-featured]');
    var countEl  = root.querySelector('.cat-count');
    var empty    = root.querySelector('.cat-empty');
    var chips    = [].slice.call(root.querySelectorAll('.cat-chips .lab-chip'));
    var groups   = [].slice.call(root.querySelectorAll('.cat-group'));
    var cards    = [].slice.call(root.querySelectorAll('.cat-group .cat-card'));
    var activeGroup = 'all';

    var index = cards.map(function(card) {
        var group = card.closest('.cat-group');
        var meta = [].map.call(card.querySelectorAll('.cat-meta li'), function(li) { return li.textContent.trim(); });
        return {
            card: card,
            name: card.querySelector('.cat-card__title').textContent.trim(),
            extra: card.getAttribute('data-search'),
            meta: meta.join(' · '),
            group: group.getAttribute('data-name'),
            icon: group.getAttribute('data-icon'),
            boost: card.classList.contains('cat-card--priced') ? 1 : 0 // priced (most booked) items first on ties
        };
    });
    var groupIndex = groups.map(function(g) {
        return { id: g.getAttribute('data-group'), name: g.getAttribute('data-name'), icon: g.getAttribute('data-icon'), extra: g.getAttribute('data-keywords') };
    });

    // ── Filtering ──
    function filterBy(q, mode) {
        var total = 0;
        groups.forEach(function(group) {
            var inGroup = activeGroup === 'all' || group.getAttribute('data-group') === activeGroup;
            var shown = 0;
            group.querySelectorAll('.cat-card').forEach(function(card) {
                var match = inGroup && (q === '' || textMatches(card.getAttribute('data-search'), q, mode));
                card.hidden = !match;
                if (match) shown++;
            });
            group.hidden = shown === 0;
            total += shown;
        });
        return total;
    }

    // Whole query first; if nothing matches, any single word of it.
    function apply() {
        var q = normalizeText(input.value);
        var total = filterBy(q, 'all');
        if (total === 0 && q !== '' && keyWords(q).length) total = filterBy(q, 'any');
        var filtered = q !== '' || activeGroup !== 'all';
        root.classList.toggle('is-filtered', filtered);
        if (featured) featured.hidden = filtered;
        var label = total + ' ' + (total === 1 ? noun.replace(/s$/, '') : noun);
        countEl.textContent = q ? label + ' matching “' + input.value.trim() + '”' : filtered ? label : '';
        empty.hidden = total !== 0;
        return total;
    }

    function setGroup(id) {
        activeGroup = id;
        chips.forEach(function(c) {
            var on = c.getAttribute('data-group') === id;
            c.classList.toggle('active', on);
            c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }

    function scrollToResults() {
        var first = root.querySelector('.cat-group:not([hidden])') || empty;
        (countEl.textContent ? countEl : first).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function showCard(card) {
        input.value = '';
        setGroup('all');
        apply();
        closeDrop();
        var group = card.closest('.cat-group');
        if (card.classList.contains('is-extra') || card.classList.contains('is-extra-sm')) setOpen(group, true);
        focusCard(card);
    }

    // ── "View all" per group ──
    function setOpen(group, open) {
        group.classList.toggle('is-open', open);
        var btn = group.querySelector('.cat-more');
        if (!btn) return;
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.textContent = open ? 'Show less' : btn.getAttribute('data-more');
    }
    root.addEventListener('click', function(e) {
        var more = e.target.closest('.cat-more');
        if (more) {
            var group = more.closest('.cat-group');
            var open = !group.classList.contains('is-open');
            setOpen(group, open);
            if (!open) group.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (e.target.closest('.cat-reset')) {
            input.value = '';
            setGroup('all');
            apply();
            root.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    chips.forEach(function(chip) {
        chip.addEventListener('click', function() {
            setGroup(chip.getAttribute('data-group'));
            apply();
        });
    });

    // ── Live suggestions ──
    var suggest = attachSuggest(input, drop, input.closest('.cat-search'), function(q) {
        var hits = rankSuggestions(index, q, 6);
        var cats = groupIndex.filter(function(g) { return suggestScore(g.name, g.extra, q) > 0; }).slice(0, 3);
        return {
            sections: [
                { label: noun === 'packages' ? 'Health packages' : 'Lab tests', items: hits.map(function(i) {
                    return { icon: i.icon, name: i.name, meta: i.meta, pill: i.group, pick: function() { showCard(i.card); } };
                }) },
                { label: 'Categories', chips: true, items: cats.map(function(g) {
                    return { icon: g.icon, name: g.name, pick: function() { input.value = ''; setGroup(g.id); apply(); scrollToResults(); } };
                }) }
            ],
            all: { label: 'See all results →', pick: scrollToResults }
        };
    });
    var closeDrop = suggest.close;

    input.addEventListener('input', function() {
        if (input.value.trim()) setGroup('all'); // typing searches every category
        apply();
        suggest.render();
    });
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        closeDrop();
        apply();
        scrollToResults();
    });

    document.querySelectorAll('.cat-popular__chip').forEach(function(chip) {
        chip.addEventListener('click', function() {
            input.value = chip.getAttribute('data-q');
            setGroup('all');
            apply();
            scrollToResults();
        });
    });

    // Opened from the site search (/lab-tests/?q=…) or a category link (?group=…)
    var params = new URLSearchParams(window.location.search);
    if (params.get('group') && groupIndex.some(function(g) { return g.id === params.get('group'); })) setGroup(params.get('group'));
    if (params.get('q')) input.value = params.get('q');
    var linked = params.get('item') && document.getElementById(params.get('item'));
    if (linked && root.contains(linked)) {
        apply();
        setTimeout(function() { showCard(linked); }, 100);
    } else if (apply() && (params.get('q') || params.get('group'))) {
        setTimeout(function() {
            var first = root.querySelector('.cat-group:not([hidden]) .cat-card:not([hidden])');
            if (first && params.get('q')) focusCard(first); else scrollToResults();
        }, 100);
    }
}

// ── Homepage & city page search: live suggestions ─────────────────────
// Suggests lab tests, health packages and their categories; each opens its card on
// /lab-tests/ or /health-packages/ (or the package page). Enter still runs searchTests().
function initHeroSearch() {
    var input = document.getElementById('searchInput');
    var bar = input && input.closest('.search-bar');
    if (!bar) return;

    var wrap = makeEl('div', 'cat-search hero-search');
    bar.parentNode.insertBefore(wrap, bar);
    wrap.appendChild(bar);
    var drop = wrap.appendChild(makeEl('div', 'cat-suggest'));
    drop.id = 'heroSuggest';
    drop.hidden = true;
    drop.setAttribute('role', 'listbox');
    drop.setAttribute('aria-label', 'Suggestions');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-controls', 'heroSuggest');
    input.setAttribute('aria-expanded', 'false');

    var tests = null, packages = null, testCats = [], packageGroups = [];

    // Price and report time from the test cards on this page, so suggestions match them.
    var CARD_NAMES = { 'Urine R/M (Routine & Microscopy)': 'Urine R/M (Urine Routine & Microscopy)',
                       'Dengue Test (NS1 Antigen)': 'Dengue Fever NS1 Antigen' };
    var onPage = {};
    document.querySelectorAll('.test-card').forEach(function(card) {
        var name = card.querySelector('h4').textContent.trim();
        var price = card.querySelector('.current-price');
        var report = [].filter.call(card.querySelectorAll('.test-info span'), function(span) { return /Report in/.test(span.textContent); })[0];
        onPage[CARD_NAMES[name] || name] = { price: price && price.textContent.trim(),
                                             reports: report && report.textContent.replace(/.*Report in\s*/, '').trim() };
    });

    function facts(item) {
        return [item.price, item.tests && item.tests + (item.tests === 1 ? ' test' : ' tests'),
                item.reports && 'Reports in ' + item.reports].filter(Boolean).join(' · ');
    }
    function load() {
        withLabTests(function(cats) {
            testCats = cats;
            tests = [];
            cats.forEach(function(c) {
                var extra = c.name + ' ' + (c.keywords || []).join(' ');
                c.tests.forEach(function(t) {
                    var card = onPage[t.name];
                    if (card) t = { name: t.name, tests: t.tests, price: card.price, reports: card.reports || t.reports };
                    tests.push({ icon: c.icon, name: t.name, meta: facts(t), pill: c.name, extra: extra, boost: card ? 1 : 0,
                                 href: '/lab-tests/?item=t-' + slugify(t.name) });
                });
            });
            suggest.render();
        });
        withHealthPackages(function(groups) {
            packageGroups = groups;
            packages = [];
            groups.forEach(function(g) {
                var extra = g.name + ' ' + (g.keywords || []).join(' ');
                g.packages.forEach(function(p) {
                    packages.push({ icon: g.icon, name: p.name, meta: facts(p), pill: g.name, extra: extra, boost: p.price ? 1 : 0,
                                    href: p.url || '/health-packages/?item=p-' + slugify(p.name) });
                });
            });
            suggest.render();
        });
    }
    function categories(list, q, noun, url) {
        return list.filter(function(c) { return suggestScore(c.name, (c.keywords || []).join(' '), q) > 0; })
            .map(function(c) { return { icon: c.icon, name: c.name + ' ' + noun, href: url + '?group=' + c.id }; });
    }

    var suggest = attachSuggest(input, drop, wrap, function(q) {
        if (!tests || !packages) return null;
        return {
            sections: [
                { label: 'Lab tests', items: rankSuggestions(tests, q, 4) },
                { label: 'Health packages', items: rankSuggestions(packages, q, 4) },
                { label: 'Categories', chips: true,
                  items: categories(testCats, q, 'tests', '/lab-tests/').concat(categories(packageGroups, q, 'packages', '/health-packages/')).slice(0, 4) }
            ],
            all: { label: 'Search all results →', pick: searchTests }
        };
    });
    input.addEventListener('focus', load, { once: true });
    input.addEventListener('input', function() { suggest.render(); });
    // Enter / Search run the full search (searchTests), which may stay on this page
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') suggest.close(); });
    bar.querySelector('button').addEventListener('click', suggest.close);
}

// ── Mobile menu (header, screens up to 1024px) ───────────────────────
function initMobileMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var menu   = document.getElementById('mainNavMenu');
    if (!toggle || !menu) return;

    function setOpen(open) {
        menu.classList.toggle('open', open);
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        setOpen(!menu.classList.contains('open'));
    });
    menu.addEventListener('click', function(e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('click', function(e) {
        if (menu.classList.contains('open') && !e.target.closest('.main-header')) setOpen(false);
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) { setOpen(false); toggle.focus(); }
    });
}

// ── Everything else after DOM is ready ───────────────────────────────
document.addEventListener('DOMContentLoaded', function() {

    // Lead popup
    var overlay = document.getElementById('popupOverlay');
    var closeBtn = document.getElementById('popupClose');
    var form    = document.getElementById('popupForm');

    var searchQuery = new URLSearchParams(window.location.search).get('q');
    var arrivedFromSearch = !!(searchQuery && document.getElementById('health-packages'));

    if (overlay) {
        // Show popup on load, unless this page opts out via <body data-autopopup="false">
        // or the visitor just arrived from a search.
        if (document.body.getAttribute('data-autopopup') !== 'false' && !arrivedFromSearch) {
            overlay.classList.remove('hidden');
        }

        closeBtn.addEventListener('click', function() { overlay.classList.add('hidden'); });
        overlay.addEventListener('click', function() { overlay.classList.add('hidden'); });
        overlay.querySelector('.popup-modal').addEventListener('click', function(e) { e.stopPropagation(); });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var name  = document.getElementById('popupName').value;
            var phone = document.getElementById('popupPhone').value;
            var msg   = encodeURIComponent('Hi, I need assistance in booking a lab test.\nName: ' + name + '\nPhone: ' + phone);
            window.open(SITE.whatsapp + '?text=' + msg, '_blank');
            overlay.classList.add('hidden');
            form.reset();
        });
    }


    // Search — Enter key & auto-clear
    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchTests();
        });
        searchInput.addEventListener('input', function() {
            if (this.value === '') searchTests();
        });
    }

    // Book buttons → WhatsApp
    document.querySelectorAll('.book-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var testName = this.closest('.test-card').querySelector('h4').textContent;
            window.open(SITE.whatsapp + '?text=' + encodeURIComponent('Hi, I want to book ' + testName), '_blank');
        });
    });

    // Homepage opened from a search on another page (/?q=…#health-packages)
    if (arrivedFromSearch) {
        var core = normalizeText(searchQuery);
        searchInput.value = searchQuery;
        if (!filterTestCards(searchQuery.toLowerCase(), core, 'all')) filterTestCards(searchQuery.toLowerCase(), core, 'any');
    }

    // Contact page enquiry form → WhatsApp
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var lines = ['Hi, I have an enquiry.',
                         'Name: ' + document.getElementById('contactName').value,
                         'Phone: ' + document.getElementById('contactPhone').value];
            var city = document.getElementById('contactCity').value;
            var message = document.getElementById('contactMessage').value.trim();
            if (city) lines.push('City: ' + city);
            if (message) lines.push('Message: ' + message);
            window.open(SITE.whatsapp + '?text=' + encodeURIComponent(lines.join('\n')), '_blank');
            contactForm.reset();
        });
    }

    initCatalogue();
    initHeroSearch();
    initMobileMenu();
});
