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
    { go: { contact: 'contact' },   words: ['contact', 'contact us', 'call', 'call us', 'phone', 'phone number', 'customer care', 'support', 'help', 'help center', 'help centre'] },
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

// ── Contact modal (Contact Us / Help Center links and search with no results) ──
var CONTACT_TOPICS = {
    contact:   { title: 'Contact Us',            text: 'Speak to our health advisors to book a test or get help with a booking.', wa: 'Hi, I need help with booking a lab test.' },
    help:      { title: 'Help Center',           text: 'Need help? Speak to our health advisors for assistance with tests, bookings and reports.', wa: 'Hi, I need help.' },
    noresults: { title: 'Please contact us for more info', text: '', wa: 'Hi, I was looking for information on your website.' }
};

var contactModal = null;
var contactModalReturnFocus = null;

function buildContactModal() {
    var overlay = document.createElement('div');
    overlay.className = 'popup-overlay hidden';
    overlay.id = 'contactModal';
    overlay.innerHTML =
        '<div class="popup-modal" role="dialog" aria-modal="true" aria-labelledby="contactModalTitle">' +
            '<button type="button" class="popup-close" aria-label="Close">✕</button>' +
            '<div class="popup-content contact-modal">' +
                '<h2 id="contactModalTitle"></h2>' +
                '<p class="contact-modal-text"></p>' +
                '<a class="contact-modal-call" href="' + SITE.phoneTel + '">📞 Call ' + SITE.phoneDisplay + '</a>' +
                '<a class="contact-modal-whatsapp" target="_blank" rel="noopener">Chat on WhatsApp</a>' +
            '</div>' +
        '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) { if (e.target === overlay) closeContactModal(); });
    overlay.querySelector('.popup-close').addEventListener('click', closeContactModal);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeContactModal();
    });
    return overlay;
}

// topic: key of CONTACT_TOPICS. opts: { title, text, wa } overrides.
function openContactModal(topic, opts) {
    if (!contactModal) contactModal = buildContactModal();
    var t = Object.assign({}, CONTACT_TOPICS[topic] || CONTACT_TOPICS.contact, opts || {});
    contactModal.querySelector('#contactModalTitle').textContent = t.title;
    var text = contactModal.querySelector('.contact-modal-text');
    text.textContent = t.text;
    text.hidden = !t.text;
    contactModal.querySelector('.contact-modal-whatsapp').href = SITE.whatsapp + '?text=' + encodeURIComponent(t.wa);
    contactModalReturnFocus = document.activeElement;
    contactModal.classList.remove('hidden');
    contactModal.querySelector('.contact-modal-call').focus();
}

function closeContactModal() {
    if (!contactModal) return;
    contactModal.classList.add('hidden');
    if (contactModalReturnFocus && contactModalReturnFocus.focus) contactModalReturnFocus.focus();
}

// Lab tests are booked by phone: start the call straight away.
function callUs() {
    window.location.href = SITE.phoneTel;
}

// Touch devices can dial directly; elsewhere show the number in a modal.
function isTouchDevice() {
    return window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
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

// True when every word of `query` appears in `text` (1–2 letter words must match whole words).
function containsAllWords(text, query) {
    var hay = ' ' + normalizeText(text) + ' ';
    return query.split(' ').every(function(w) {
        return hay.indexOf(w.length <= 2 ? ' ' + w + ' ' : w) !== -1;
    });
}

// 'test' if the query names a lab test, 'category' if it names a category, else null.
function findLabTest(categories, query) {
    var result = null;
    for (var i = 0; i < categories.length; i++) {
        var c = categories[i];
        for (var j = 0; j < c.tests.length; j++) {
            if (containsAllWords(c.tests[j], query)) return 'test';
        }
        if (containsAllWords(c.name, query)) result = 'category';
    }
    return result;
}

// ── Search (global so onclick= can find it) ──────────────────────────
function showAllTestCards() {
    document.querySelectorAll('.test-card').forEach(function(card) {
        card.classList.remove('hidden', 'highlight');
    });
}

// Filters the test/package cards on this page. Returns true if any matched.
// term: the typed text (lowercase); core: the normalized query without filler words.
function filterTestCards(term, core) {
    var testCards  = document.querySelectorAll('.test-card');
    var foundCount = 0;
    var firstCard  = null;

    testCards.forEach(function(card) {
        card.classList.remove('highlight');
        var text  = card.getAttribute('data-test') + ' ' + card.querySelector('h4').textContent;
        var match = term === '' || text.toLowerCase().includes(term) || containsAllWords(text, core);
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
    if (go.contact)  return openContactModal(go.contact);
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

    var core = q.split(' ').filter(function(w) { return FILLER_WORDS.indexOf(w) === -1; }).join(' ') || q;
    withLabTests(function(categories) {
        // 3. An individual lab test → call us; a test category → the filtered Lab Tests page
        var labMatch = core.length >= 2 ? findLabTest(categories, core) : null;
        if (labMatch === 'test') return callUs();
        if (labMatch === 'category') { window.location.href = '/lab-tests/?q=' + encodeURIComponent(core); return; }

        // 4. Packages shown on this page (existing behaviour), radiology words, blog posts
        if (filterTestCards(raw.toLowerCase(), core)) return;

        var radiology = RADIOLOGY_WORDS.some(function(w) { return (' ' + q + ' ').indexOf(' ' + w + ' ') !== -1; });
        if (radiology) { window.location.href = '/radiology/'; return; }

        for (var i = 0; i < BLOG_POSTS.length; i++) {
            if (containsAllWords(BLOG_POSTS[i].title, q)) { window.location.href = BLOG_POSTS[i].url; return; }
        }

        // 5. Nothing matched
        openContactModal('noresults', { text: 'We couldn’t find “' + raw + '” on our website.' });
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

    function applyFilter() {
        var q = normalizeText(input.value);
        var total = 0;
        list.querySelectorAll('.lab-category').forEach(function(block) {
            var inCategory = activeCategory === 'all' || block.dataset.category === activeCategory;
            var shown = 0;
            block.querySelectorAll('.lab-test-item').forEach(function(item) {
                var match = inCategory && (q === '' || containsAllWords(item.dataset.search, q));
                item.hidden = !match;
                if (match) shown++;
            });
            block.hidden = shown === 0;
            total += shown;
        });
        countEl.textContent = total + (total === 1 ? ' test' : ' tests');
        noResult.hidden = total !== 0;
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
        applyFilter();
        list.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        applyFilter();
    }
}

// ── Everything else after DOM is ready ───────────────────────────────
document.addEventListener('DOMContentLoaded', function() {

    // Lead popup
    var overlay = document.getElementById('popupOverlay');
    var closeBtn = document.getElementById('popupClose');
    var form    = document.getElementById('popupForm');

    if (overlay) {
        // Show popup on load, unless this page opts out via <body data-autopopup="false">
        if (document.body.getAttribute('data-autopopup') !== 'false') {
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

    // Contact links: <a href="tel:…" data-contact="topic">. Touch devices dial the
    // number directly for "contact"; everything else opens the contact modal.
    document.addEventListener('click', function(e) {
        var link = e.target.closest('[data-contact]');
        if (!link) return;
        var topic = link.getAttribute('data-contact');
        if (topic === 'contact' && isTouchDevice()) return;
        e.preventDefault();
        openContactModal(topic);
    });

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

    initLabTestsPage();
});
