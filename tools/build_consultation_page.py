"""Build /doctor-consultation/ — online doctor consultation on call or video, built around the
patient's lab test report (from Tata 1mg Labs or any other lab).
Run from the repo root:

    python tools/build_consultation_page.py
"""
from site_parts import (PHONE_DISPLAY, PHONE_TEL, SITE, WHATSAPP, breadcrumb_schema, esc, faq_html, faq_schema,
                        head, icon, tail, write_page)

URL = SITE + '/doctor-consultation/'
FEE = 299  # per consultation, phone or video call

# What the doctor covers in a consultation: (icon, title, text)
COVERS = [
    ('report', 'Parameter-wise report analysis',
     'Every value in your report is explained one by one: what it measures, whether it is normal, borderline or out of range, and what it means for you.'),
    ('search', 'Causes and connections',
     'The doctor looks at your results together, not in isolation, to explain the likely reasons behind abnormal values and how they relate to each other.'),
    ('shield', "Do's and don'ts for each parameter",
     'Clear, practical steps for every value that needs attention: what to do, what to avoid and what to watch for.'),
    ('diet', 'Diet guidance',
     'What to eat more of, what to cut down and simple meal changes that suit your results, your routine and your food habits.'),
    ('lifestyle', 'Lifestyle guidance',
     'Advice on activity, sleep, stress, weight, alcohol and smoking, tailored to what your report shows.'),
    ('prescription', 'Treatment and prescription',
     'If treatment is needed, the doctor explains the options and gives a prescription with medicines, where medically appropriate.'),
    ('referral', 'Referral to a specialist',
     'If your results need a specialist, such as an endocrinologist, cardiologist or nephrologist, you are told which one and why.'),
    ('calendar', 'Follow-up and re-test plan',
     'Which tests to repeat, when to repeat them and what improvement to look for, so you can track your progress.'),
    ('chat', 'Unhurried, detailed discussion',
     'Time to ask every question you have about your health and your report, without feeling rushed.'),
]

# Report options: (icon, title, text, link, link text)
REPORTS = [
    ('package', 'Tested with Tata 1mg Labs?',
     'Book a consultation after your test and share the report you receive on email or WhatsApp.',
     '/health-packages/', 'View health packages'),
    ('upload', 'Have a report from another lab?',
     "Reports from any lab work. Send a clear photo or PDF of your report on WhatsApp and we'll arrange your consultation.",
     WHATSAPP + '?text=' + 'Hi%2C%20I%20want%20a%20doctor%20consultation%20for%20my%20lab%20report.', 'Share your report'),
    ('tube', 'No tests yet?',
     'Book your lab test or health package with home sample collection first, then consult the doctor about your results.',
     '/lab-tests/', 'Browse lab tests'),
]

STEPS = [
    ('phone', 'Book your consultation', 'Call, WhatsApp or fill in the form below with your preferred date and time.'),
    ('upload', 'Share your report', 'Send your lab test report on WhatsApp, from Tata 1mg Labs or any other lab.'),
    ('video', 'Consult on call or video', 'The doctor goes through your report parameter by parameter and answers your questions.'),
    ('prescription', 'Get your care plan', 'Receive your advice, diet and lifestyle plan, prescription and any specialist referral.'),
]

FAQ = [
    ('Can I consult a doctor without doing my lab test with Tata 1mg Labs?',
     'Yes. Reports from any lab are accepted. Send a clear photo or PDF of your report on WhatsApp and the doctor will review it during your consultation.'),
    ('How do I share my lab report with the doctor?',
     'Send your report on WhatsApp to +91-9650461818 after booking. If you tested with Tata 1mg Labs, you can share the report you received on email or WhatsApp.'),
    ('Is the consultation on a phone call or a video call?',
     'You can choose either. A video call is useful if you want to show your report or symptoms; an audio call works well if you just want to discuss your results.'),
    ('Will I get a prescription?',
     'If the doctor finds that treatment is needed, you will receive a prescription with medicines, where medically appropriate and permitted for online consultations.'),
    ('Will the doctor refer me to a specialist?',
     'Yes, if your results need specialist care, the doctor will tell you which specialist to see and why.'),
    ('How much does a consultation cost?',
     f'The consultation fee is ₹{FEE} per consultation, for a phone call or a video call. Call or WhatsApp us on +91-9650461818 to book a slot.'),
    ('Is this service for emergencies?',
     'No. Online consultations are not for medical emergencies. In an emergency, call 112 or go to the nearest hospital immediately.'),
]


def build():
    schemas = [
        breadcrumb_schema([('Home', SITE + '/'), ('Doctor Consultation', URL)]),
        {
            '@context': 'https://schema.org',
            '@type': 'Service',
            'name': 'Online Doctor Consultation for Lab Test Reports',
            'serviceType': 'Online doctor consultation',
            'url': URL,
            'description': 'Doctor consultation on phone or video call with parameter-wise lab report analysis, '
                           'diet and lifestyle guidance, prescription and specialist referral. Reports from any lab accepted.',
            'provider': {'@type': 'MedicalBusiness', 'name': 'Tata 1mg Labs', 'url': SITE + '/', 'telephone': '+919650461818'},
            'areaServed': {'@type': 'Country', 'name': 'India'},
            'availableChannel': {'@type': 'ServiceChannel', 'servicePhone': '+919650461818'},
            'offers': {'@type': 'Offer', 'price': str(FEE), 'priceCurrency': 'INR', 'url': URL,
                       'availability': 'https://schema.org/InStock'},
        },
        faq_schema(FAQ),
    ]
    covers = ''.join(f'''            <div class="dc-card">
                <span class="dc-card__icon">{icon(i)}</span>
                <h3>{esc(t)}</h3>
                <p>{esc(d)}</p>
            </div>
''' for i, t, d in COVERS)
    reports = ''.join(f'''            <div class="dc-report">
                <span class="dc-card__icon">{icon(i)}</span>
                <h3>{esc(t)}</h3>
                <p>{esc(d)}</p>
                <a href="{l}"{' target="_blank"' if l.startswith('http') else ''} class="dc-report__link">{esc(lt)} &rarr;</a>
            </div>
''' for i, t, d, l, lt in REPORTS)
    steps = ''.join(f'''            <li class="cat-step">
                <span class="cat-step__num">{n + 1:02d}</span>
                <span class="cat-step__icon">{icon(i)}</span>
                <h3>{esc(t)}</h3>
                <p>{esc(d)}</p>
            </li>
''' for n, (i, t, d) in enumerate(STEPS))
    hero_points = ''.join(f'<li>{icon(i)}<span>{esc(t)}</span></li>' for i, t, _ in COVERS[:6])

    page = head('Online Doctor Consultation for Lab Reports | Tata 1mg Labs',
                f'Consult a doctor on call or video about your lab test report for ₹{FEE}. Parameter-wise analysis, diet and '
                'lifestyle advice, prescription and specialist referral. Reports from any lab accepted.',
                URL, schemas) + f'''    <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a><span>›</span> <span class="current">Doctor Consultation</span>
    </nav>

    <main>
        <section class="hero dc-hero">
            <div class="hero-content">
                <p class="cat-hero__type">{icon("doctor")}Doctor consultation</p>
                <h1>Online Doctor Consultation for Your Lab Reports</h1>
                <p class="intro-copy">Talk to a doctor on a phone or video call about your lab test results. Get a parameter-by-parameter explanation of your report, diet and lifestyle guidance, a prescription if you need one and a referral to a specialist when required. Reports from Tata 1mg Labs or any other lab are welcome.</p>
                <div class="dc-hero__actions">
                    <a href="#book-consultation" class="cta-btn dc-btn-book">{icon("calendar")}Book a Consultation</a>
                    <a href="{PHONE_TEL}" class="cta-btn cta-btn-call">{icon("phone")}Call {PHONE_DISPLAY}</a>
                    <a href="{WHATSAPP}?text=Hi%2C%20I%20want%20to%20book%20a%20doctor%20consultation." target="_blank" class="cta-btn cta-btn-whatsapp">WhatsApp Us</a>
                </div>
            </div>
            <div class="dc-hero__panel">
                <div class="dc-hero__card">
                    <div class="dc-hero__price">
                        <span class="dc-hero__price-value">₹{FEE}</span>
                        <span class="dc-hero__price-note">per consultation</span>
                    </div>
                    <p class="dc-hero__card-label">In your consultation</p>
                    <ul class="dc-hero__list">{hero_points}</ul>
                    <div class="dc-hero__modes">
                        <span>{icon("phone")}Phone call</span>
                        <span>{icon("video")}Video call</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="dc-section">
            <h2 class="section-title">Consult With Any Lab Report</h2>
            <div class="dc-reports">
{reports}            </div>
        </section>

        <section class="dc-section">
            <h2 class="section-title">What the Doctor Covers</h2>
            <p class="dc-lead">Not a quick look at your report, but a thorough discussion of every result and what to do next.</p>
            <div class="dc-grid">
{covers}            </div>
        </section>

        <section class="cat-steps-section">
            <h2 class="section-title">How It Works</h2>
            <ol class="cat-steps">
{steps}            </ol>
        </section>

        <section class="legal-page dc-book" id="book-consultation">
            <div class="contact-grid">
                <div class="legal-content">
                    <h2>Book your consultation</h2>
                    <p>Fill in your details and we'll continue on WhatsApp to confirm your slot. You can share your lab report in the same chat.</p>
                    <p class="dc-fee">Consultation fee: <strong>₹{FEE}</strong> per consultation</p>
                    <ul class="dc-checks">
                        <li>Phone or video call, at a time that suits you</li>
                        <li>Reports from Tata 1mg Labs or any other lab</li>
                        <li>Parameter-wise analysis, diet and lifestyle guidance</li>
                        <li>Prescription and specialist referral when needed</li>
                    </ul>
                    <p class="contact-number"><a href="{PHONE_TEL}">{PHONE_DISPLAY}</a></p>
                    <p class="contact-sub">Call or WhatsApp us, available 24/7.</p>
                </div>

                <div class="legal-content">
                    <h2>Consultation request</h2>
                    <form class="popup-form contact-form" id="consultForm">
                        <label class="visually-hidden" for="consultName">Patient name</label>
                        <input type="text" class="popup-input" id="consultName" placeholder="Patient name*" required>
                        <label class="visually-hidden" for="consultPhone">Phone number</label>
                        <input type="tel" class="popup-input" id="consultPhone" placeholder="Phone No.*" required pattern="[0-9]{{10}}">
                        <label class="visually-hidden" for="consultMode">Consultation type</label>
                        <select class="popup-input" id="consultMode" required>
                            <option value="">Phone or video call?*</option>
                            <option>Phone call</option>
                            <option>Video call</option>
                        </select>
                        <label class="visually-hidden" for="consultReport">Lab report</label>
                        <select class="popup-input" id="consultReport" required>
                            <option value="">Your lab report*</option>
                            <option>Tata 1mg Labs report</option>
                            <option>Report from another lab</option>
                            <option>No report yet, I want to book a test first</option>
                        </select>
                        <label class="visually-hidden" for="consultDate">Preferred date</label>
                        <input type="date" class="popup-input" id="consultDate" aria-label="Preferred date">
                        <label class="visually-hidden" for="consultTime">Preferred time</label>
                        <select class="popup-input" id="consultTime">
                            <option value="">Preferred time</option>
                            <option>Morning (8 am – 12 pm)</option>
                            <option>Afternoon (12 pm – 4 pm)</option>
                            <option>Evening (4 pm – 8 pm)</option>
                            <option>Night (after 8 pm)</option>
                        </select>
                        <label class="visually-hidden" for="consultMessage">Your concern</label>
                        <textarea class="popup-input" id="consultMessage" rows="3" placeholder="Your health concern or questions about the report"></textarea>
                        <button type="submit" class="popup-submit">Request Consultation</button>
                    </form>
                </div>
            </div>
        </section>

        <section class="faq-section">
            <h2 class="section-title">Doctor Consultation Questions</h2>
{faq_html(FAQ)}
        </section>

    </main>
''' + tail('Have your lab report ready?', 'Book an online consultation and get your results explained by a doctor.')
    write_page('doctor-consultation/index.html', page)


if __name__ == '__main__':
    build()
