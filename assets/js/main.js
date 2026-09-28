// ── Site-wide settings (single source for contact details) ───────────
var SITE = {
    phoneDisplay: '+91-9650461818',
    phoneTel:     'tel:+919650461818',
    whatsapp:     'https://wa.me/919650461818'
};

// Blog posts the search can find. Keep in sync with /blog/.
var BLOG_POSTS = [
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
    { go: { call: true },           words: ['contact', 'contact us', 'call', 'call us', 'phone', 'phone number', 'customer care', 'support', 'help', 'help center', 'help centre'] },
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

// Searching "contact" / "help" starts the call straight away.
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
        return textMatches(c.name, query, mode) || c.tests.some(function(t) { return textMatches(t, query, mode); });
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
    var section = document.getElementById('health-packages');
    if (section) {
        showAllTestCards();
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        window.location.href = '/#health-packages';
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

// ── Lab Tests page (/lab-tests/) ─────────────────────────────────────
function initLabTestsPage() {
    var list = document.getElementById('labTestsList');
    if (!list || !window.LAB_TEST_CATEGORIES) return;

    var input    = document.getElementById('labTestSearch');
    var chips    = document.getElementById('labCategoryChips');
    var countEl  = document.getElementById('labTestCount');
    var noResult = document.getElementById('labNoResults');
    var activeCategory = 'all';

    window.LAB_TEST_CATEGORIES.forEach(function(cat, i) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'lab-chip';
        chip.dataset.category = String(i);
        chip.textContent = cat.name;
        chips.appendChild(chip);

        var block = document.createElement('div');
        block.className = 'region-block lab-category';
        block.dataset.category = String(i);
        var heading = document.createElement('h2');
        heading.textContent = cat.name;
        var grid = document.createElement('div');
        grid.className = 'city-link-grid';
        cat.tests.forEach(function(name) {
            // Each test is a direct call link.
            var link = document.createElement('a');
            link.href = SITE.phoneTel;
            link.className = 'city-link-card lab-test-item';
            link.dataset.search = normalizeText(name + ' ' + cat.name);
            link.setAttribute('aria-label', 'Call ' + SITE.phoneDisplay + ' to book ' + name);
            link.innerHTML = '<span class="lab-test-name"></span><span class="lab-test-book">Book &rarr;</span>';
            link.querySelector('.lab-test-name').textContent = name;
            grid.appendChild(link);
        });
        block.appendChild(heading);
        block.appendChild(grid);
        list.appendChild(block);
    });

    function filterBy(q, mode) {
        var total = 0;
        list.querySelectorAll('.lab-category').forEach(function(block) {
            var inCategory = activeCategory === 'all' || block.dataset.category === activeCategory;
            var shown = 0;
            block.querySelectorAll('.lab-test-item').forEach(function(item) {
                var match = inCategory && (q === '' || textMatches(item.dataset.search, q, mode));
                item.hidden = !match;
                if (match) shown++;
            });
            block.hidden = shown === 0;
            total += shown;
        });
        return total;
    }

    // Whole query first; if nothing matches, any single word of it.
    function applyFilter() {
        var q = normalizeText(input.value);
        var total = filterBy(q, 'all');
        if (total === 0 && q !== '' && keyWords(q).length) total = filterBy(q, 'any');
        countEl.textContent = total + (total === 1 ? ' test' : ' tests');
        noResult.hidden = total !== 0;
        return total;
    }

    chips.addEventListener('click', function(e) {
        var chip = e.target.closest('.lab-chip');
        if (!chip) return;
        activeCategory = chip.dataset.category;
        chips.querySelectorAll('.lab-chip').forEach(function(c) {
            c.classList.toggle('active', c === chip);
            c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
        });
        applyFilter();
    });
    input.addEventListener('input', applyFilter);
    input.addEventListener('keypress', function(e) { if (e.key === 'Enter') applyFilter(); });
    document.getElementById('labTestSearchBtn').addEventListener('click', applyFilter);

    var params = new URLSearchParams(window.location.search);
    if (params.get('q')) {
        input.value = params.get('q');
        if (applyFilter()) {
            var first = list.querySelector('.lab-test-item:not([hidden])');
            setTimeout(function() {
                first.scrollIntoView({ behavior: 'smooth', block: 'center' });
                first.classList.add('highlight');
                setTimeout(function() { first.classList.remove('highlight'); }, 1000);
            }, 100);
        }
    } else {
        applyFilter();
    }
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

    initLabTestsPage();
    initMobileMenu();
});
