interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Booking',
    question: 'How do I book a vehicle on DriveR?',
    answer: 'Booking on DriveR takes under two minutes. Simply browse our fleet, pick your preferred vehicle, select your start and end dates/times, review the transparent pricing breakdown, and confirm your reservation. You can complete payment instantly via your dashboard.',
  },
  {
    id: 'faq-2',
    category: 'KYC',
    question: 'What documents are required for identity verification?',
    answer: 'To ensure platform safety, we require two documents: 1) A valid, unexpired original Driver\'s License (minimum 1 year of driving validity), and 2) A government ID proof (Aadhaar, Passport, or Voter ID). You can upload these directly from your User Dashboard under Profile.',
  },
  {
    id: 'faq-3',
    category: 'KYC',
    question: 'How long does KYC document verification take?',
    answer: 'Our Coimbatore verification team processes documents round-the-clock. Most submissions are verified within 15 to 30 minutes. Once verified, your status changes to "VERIFIED" permanently and you are immediately eligible to rent.',
  },
  {
    id: 'faq-4',
    category: 'Payments',
    question: 'Is a security deposit required and when is it refunded?',
    answer: 'Yes, a refundable security deposit (typically ₹2,000 to ₹5,000 depending on vehicle category) is held during the trip. Upon successful vehicle return and our 5-minute digital check, the full deposit is refunded to your original payment method within 24 to 48 banking hours.',
  },
  {
    id: 'faq-5',
    category: 'Payments',
    question: 'What payment modes are accepted on DriveR?',
    answer: 'We support all major Indian payment gateways: UPI (Google Pay, PhonePe, Paytm), Credit Cards (Visa, Mastercard, RuPay, Amex), Debit Cards, and Net Banking across all major banks.',
  },
  {
    id: 'faq-6',
    category: 'Handover',
    question: 'Where can I pick up and drop off the car?',
    answer: 'You have two options: 1) Pick up directly from our central DriveR Hubs (such as our Coimbatore hub on Avinashi Road), or 2) Choose Doorstep Delivery, where our concierge delivers the vehicle right to your home, office, or airport terminal.',
  },
  {
    id: 'faq-7',
    category: 'Handover',
    question: 'Is fuel included in the rental price?',
    answer: 'All DriveR rentals follow a simple Fuel Full-to-Full policy. The car is handed over to you with a full tank of fuel (or 90%+ charge for EVs), and you return it with the same level. If returned with less fuel, local market pump rates plus a minimal service fee apply.',
  },
  {
    id: 'faq-8',
    category: 'Safety',
    question: 'What should I do in case of an accident or unexpected breakdown?',
    answer: 'Your safety is our priority. Immediately move the car to safety and turn on hazard flashers. Call our dedicated 24/7 Roadside Assistance helpline at +91 98765 43210 or tap SOS in your dashboard. Our central team in Coimbatore will dispatch towing, a replacement vehicle, or emergency assistance right to your location.',
  },
  {
    id: 'faq-9',
    category: 'Cancellations',
    question: 'What is the DriveR cancellation policy?',
    answer: 'Free cancellation with a 100% full refund is provided if cancelled at least 24 hours prior to scheduled trip start time. Cancellations made between 6 to 24 hours receive a 50% refund. Cancellations within 6 hours of start time are non-refundable.',
  },
  {
    id: 'faq-10',
    category: 'Booking',
    question: 'Can I extend my ongoing rental trip?',
    answer: 'Yes! As long as the vehicle is not booked by another customer immediately following your slot, you can extend your trip directly from your User Dashboard under "My Bookings" with prorated hourly rates.',
  },
  {
    id: 'faq-11',
    category: 'Safety',
    question: 'Are DriveR vehicles equipped with GPS and speed limiters?',
    answer: 'Yes. In compliance with government transport guidelines, all vehicles carry certified IoT GPS telematics and speed advisory monitors to protect passengers and the vehicle.',
  },
  {
    id: 'faq-12',
    category: 'Payments',
    question: 'Are FASTag highway tolls included in the rental?',
    answer: 'All vehicles come fitted with an active DriveR FASTag. You can breeze through all NHAI highway toll plazas without stopping. The exact toll charges incurred are automatically deducted from your security deposit with zero markup.',
  },
];

export function renderHelpPage(): string {
  return `
    <main class="page-enter">
      <!-- Hero -->
      <section class="info-hero">
        <div class="container">
          <div class="info-hero-badge">
            <span>💡</span> Help Center & FAQs
          </div>
          <h1 class="info-hero-title">How Can We Help You?</h1>
          <p class="info-hero-subtitle">
            Find fast answers to common questions about reservations, document verification, payments, and highway assistance.
          </p>

          <!-- Live Search Bar -->
          <div class="faq-search-box">
            <span class="faq-search-icon">🔍</span>
            <input type="text" class="faq-search-input" id="faq-search-input" placeholder="Search keywords (e.g., deposit, documents, fuel, cancel, refund)..."/>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="info-section">
        <div class="container">
          <!-- Category Tabs -->
          <div class="faq-categories">
            <button class="filter-chip active" data-faq-cat="all">All Topics</button>
            <button class="filter-chip" data-faq-cat="Booking">Bookings</button>
            <button class="filter-chip" data-faq-cat="KYC">KYC & Documents</button>
            <button class="filter-chip" data-faq-cat="Payments">Payments & Deposit</button>
            <button class="filter-chip" data-faq-cat="Handover">Pickups & Returns</button>
            <button class="filter-chip" data-faq-cat="Safety">Safety & Roadside</button>
            <button class="filter-chip" data-faq-cat="Cancellations">Cancellations</button>
          </div>

          <!-- FAQ Accordion List -->
          <div class="faq-accordion" id="faq-list-container">
            ${renderFaqItems(FAQS)}
          </div>

          <!-- Still Have Questions Card -->
          <div class="card" style="margin-top:var(--space-16); padding:var(--space-10); text-align:center; max-width:860px; margin-left:auto; margin-right:auto; background:linear-gradient(135deg, rgba(26,26,37,0.9) 0%, rgba(18,18,26,0.9) 100%); border:1px solid rgba(99,102,241,0.25);">
            <div style="font-size:2.5rem; margin-bottom:var(--space-2);">🤝</div>
            <h3 style="font-size:1.5rem; font-weight:700; color:var(--text-primary); margin-bottom:var(--space-2);">
              Still Need Assistance?
            </h3>
            <p style="color:var(--text-secondary); font-size:1rem; margin-bottom:var(--space-6); max-width:540px; margin-left:auto; margin-right:auto;">
              Our customer success team at Coimbatore Headquarters is available 24/7 to resolve any query or emergency.
            </p>
            <div style="display:flex; justify-content:center; gap:var(--space-4); flex-wrap:wrap;">
              <a href="/contact" data-link class="btn btn-primary">Contact Support Desk →</a>
              <a href="tel:+919876543210" class="btn btn-outline">📞 Call 24/7 Helpline</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderFaqItems(items: FaqItem[]): string {
  if (items.length === 0) {
    return `
      <div class="empty-state" style="padding:var(--space-12) 0;">
        <div style="font-size:2rem; margin-bottom:var(--space-2);">🔍</div>
        <p style="color:var(--text-secondary); font-size:1.1rem;">No matching questions found.</p>
        <p style="color:var(--text-muted); font-size:0.9rem;">Try different search terms or browse all categories.</p>
      </div>
    `;
  }

  return items.map(item => `
    <div class="faq-item" data-faq-id="${item.id}">
      <button class="faq-question">
        <span>${item.question}</span>
        <span class="faq-toggle-icon">+</span>
      </button>
      <div class="faq-answer">
        <p>${item.answer}</p>
      </div>
    </div>
  `).join('');
}

export function initHelpPage() {
  const container = document.getElementById('faq-list-container');
  const searchInput = document.getElementById('faq-search-input') as HTMLInputElement;
  let activeCat = 'all';

  function filterFaqs() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const filtered = FAQS.filter(item => {
      const matchCat = activeCat === 'all' || item.category.toLowerCase() === activeCat.toLowerCase();
      const matchQuery = !query || item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    if (container) {
      container.innerHTML = renderFaqItems(filtered);
      attachAccordionEvents();
    }
  }

  function attachAccordionEvents() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const btn = item.querySelector('.faq-question');
      btn?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others
        document.querySelectorAll('.faq-item').forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  // Category filter
  document.querySelectorAll('.faq-categories .filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.faq-categories .filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.getAttribute('data-faq-cat') || 'all';
      filterFaqs();
    });
  });

  // Search input
  searchInput?.addEventListener('input', () => {
    filterFaqs();
  });

  attachAccordionEvents();
}
