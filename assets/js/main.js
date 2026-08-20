// ── Search (global so onclick= can find it) ──────────────────────────
function searchTests() {
    var searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    var testCards  = document.querySelectorAll('.test-card');
    var noResults  = document.getElementById('noResults');
    var foundCount = 0;
    var firstCard  = null;

    testCards.forEach(function(card) {
        card.classList.remove('highlight');
        var match = searchTerm === '' || card.getAttribute('data-test').toLowerCase().includes(searchTerm);
        if (match) {
            card.classList.remove('hidden');
            foundCount++;
            if (!firstCard) firstCard = card;
        } else {
            card.classList.add('hidden');
        }
    });

    noResults.classList.toggle('show', foundCount === 0 && searchTerm !== '');

    if (firstCard && searchTerm !== '') {
        setTimeout(function() {
            firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstCard.classList.add('highlight');
            setTimeout(function() { firstCard.classList.remove('highlight'); }, 1000);
        }, 100);
    }
}

// ── Everything else after DOM is ready ───────────────────────────────
document.addEventListener('DOMContentLoaded', function() {

    // Popup
    var overlay = document.getElementById('popupOverlay');
    var closeBtn = document.getElementById('popupClose');
    var form    = document.getElementById('popupForm');

    // Show popup on load, unless this page opts out via <body data-autopopup="false">
    if (document.body.getAttribute('data-autopopup') !== 'false') {
        overlay.classList.remove('hidden');
    }

    closeBtn.addEventListener('click', function() { overlay.classList.add('hidden'); });
    overlay.addEventListener('click', function() { overlay.classList.add('hidden'); });
    document.querySelector('.popup-modal').addEventListener('click', function(e) { e.stopPropagation(); });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var name  = document.getElementById('popupName').value;
        var phone = document.getElementById('popupPhone').value;
        var msg   = encodeURIComponent('Hi, I need assistance in booking a lab test.\nName: ' + name + '\nPhone: ' + phone);
        window.open('https://wa.me/919650461818?text=' + msg, '_blank');
        overlay.classList.add('hidden');
        form.reset();
    });

    // Search — Enter key & auto-clear
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchTests();
    });
    document.getElementById('searchInput').addEventListener('input', function() {
        if (this.value === '') searchTests();
    });

    // Book buttons → WhatsApp
    document.querySelectorAll('.book-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var testName = this.closest('.test-card').querySelector('h4').textContent;
            window.open('https://wa.me/919650461818?text=' + encodeURIComponent('Hi, I want to book ' + testName), '_blank');
        });
    });

});
