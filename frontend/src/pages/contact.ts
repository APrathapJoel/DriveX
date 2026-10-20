import { showToast } from '../toast';

export function renderContactPage(): string {
  return `
    <main class="page-enter">
      <!-- Hero -->
      <section class="info-hero">
        <div class="container">
          <div class="info-hero-badge">
            <span>💬</span> 24/7 Customer Care
          </div>
          <h1 class="info-hero-title">We're Here for Every Kilometer</h1>
          <p class="info-hero-subtitle">
            Have questions about a reservation, interested in a corporate fleet partnership, or need immediate roadside support? Connect with our Coimbatore team.
          </p>
        </div>
      </section>

      <!-- Main Contact Section -->
      <section class="info-section">
        <div class="container">
          <div class="contact-layout">
            <!-- Left: Contact Details & Headquarters -->
            <div>
              <div class="contact-info-card">
                <span class="badge badge-primary" style="margin-bottom:var(--space-3);">Central Headquarters</span>
                <h3 style="font-size:1.35rem; font-weight:700; color:var(--text-primary); margin-bottom:var(--space-4);">
                  DriveR Mobility Private Limited
                </h3>

                <div class="contact-item">
                  <div class="contact-icon">📍</div>
                  <div>
                    <h4 style="font-size:0.95rem; font-weight:600; color:var(--text-primary); margin-bottom:2px;">Headquarters Address</h4>
                    <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.5;">
                      DriveR Mobility Hub, 4th Floor, Tech Park,<br/>
                      Avinashi Road, Peelamedu,<br/>
                      Coimbatore, Tamil Nadu — 641004, India
                    </p>
                  </div>
                </div>

                <div class="contact-item">
                  <div class="contact-icon">👤</div>
                  <div>
                    <h4 style="font-size:0.95rem; font-weight:600; color:var(--text-primary); margin-bottom:2px;">Executive Leadership</h4>
                    <p style="color:var(--text-secondary); font-size:0.9rem;">
                      Founder & CEO: <strong>Prathap Joel</strong>
                    </p>
                  </div>
                </div>

                <div class="contact-item">
                  <div class="contact-icon">📞</div>
                  <div>
                    <h4 style="font-size:0.95rem; font-weight:600; color:var(--text-primary); margin-bottom:2px;">Telephone</h4>
                    <p style="color:var(--text-secondary); font-size:0.9rem;">
                      24/7 Roadside Assistance: <strong style="color:var(--primary-400);">+91 98765 43210</strong><br/>
                      Head Office: <strong>+91 422 2987654</strong>
                    </p>
                  </div>
                </div>

                <div class="contact-item">
                  <div class="contact-icon">✉️</div>
                  <div>
                    <h4 style="font-size:0.95rem; font-weight:600; color:var(--text-primary); margin-bottom:2px;">Email Inquiries</h4>
                    <p style="color:var(--text-secondary); font-size:0.9rem;">
                      Support: <a href="mailto:support@driver.com" style="color:var(--primary-400);">support@driver.com</a><br/>
                      Corporate: <a href="mailto:partnerships@driver.com" style="color:var(--primary-400);">partnerships@driver.com</a>
                    </p>
                  </div>
                </div>

                <div class="contact-item">
                  <div class="contact-icon">⏱️</div>
                  <div>
                    <h4 style="font-size:0.95rem; font-weight:600; color:var(--text-primary); margin-bottom:2px;">Support Hours</h4>
                    <p style="color:var(--text-secondary); font-size:0.9rem;">
                      Roadside Support & Trip Helpline: <strong>24/7 / 365 Days</strong><br/>
                      HQ Office: Mon – Sat, 9:00 AM – 7:00 PM IST
                    </p>
                  </div>
                </div>
              </div>

              <!-- Transit Connectivity Box -->
              <div class="card" style="padding:var(--space-6); border:1px solid var(--border-default); background:var(--bg-tertiary);">
                <h4 style="font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:var(--space-2);">
                  🚗 Hub Accessibility (Coimbatore)
                </h4>
                <ul style="color:var(--text-secondary); font-size:0.875rem; line-height:1.8; padding-left:var(--space-4);">
                  <li>5.2 km from Coimbatore International Airport (CJB)</li>
                  <li>7.1 km from Coimbatore Junction Railway Station (CBE)</li>
                  <li>Free vehicle delivery available to all major hotels and transit points</li>
                </ul>
              </div>
            </div>

            <!-- Right: Interactive Contact Form -->
            <div class="contact-form-card">
              <h3 style="font-size:1.5rem; font-weight:700; color:var(--text-primary); margin-bottom:var(--space-2);">
                Send Us a Message
              </h3>
              <p style="color:var(--text-secondary); font-size:0.95rem; margin-bottom:var(--space-6);">
                Fill out the form below and a representative from our Coimbatore office will respond within 2 hours.
              </p>

              <form id="contact-form">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-4);">
                  <div class="form-group">
                    <label class="form-label" for="contact-name">Your Name *</label>
                    <input type="text" class="form-input" id="contact-name" required placeholder="e.g. Ramesh Kumar"/>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="contact-phone">Phone Number *</label>
                    <input type="tel" class="form-input" id="contact-phone" required placeholder="+91 98765 43210"/>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="contact-email">Email Address *</label>
                  <input type="email" class="form-input" id="contact-email" required placeholder="ramesh@example.com"/>
                </div>

                <div class="form-group">
                  <label class="form-label" for="contact-subject">Inquiry Type *</label>
                  <select class="form-select" id="contact-subject" required>
                    <option value="" disabled selected>Select an inquiry category</option>
                    <option value="booking">Reservation & Booking Support</option>
                    <option value="kyc">KYC & Document Verification</option>
                    <option value="corporate">Corporate & Fleet Rental Partnership</option>
                    <option value="feedback">Feedback or Suggestion</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label" for="contact-message">Message *</label>
                  <textarea class="form-textarea" id="contact-message" rows="5" required placeholder="How can our Coimbatore support desk assist you today?"></textarea>
                </div>

                <button type="submit" class="btn btn-primary btn-lg" id="contact-submit-btn" style="width:100%; margin-top:var(--space-2);">
                  Send Message →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

export function initContactPage() {
  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('contact-submit-btn') as HTMLButtonElement;
    const name = (document.getElementById('contact-name') as HTMLInputElement).value;

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Transmitting Message...';
    }

    setTimeout(() => {
      showToast(`Thank you, ${name}! Your inquiry has been dispatched to our Coimbatore support team.`, 'success');
      (document.getElementById('contact-form') as HTMLFormElement).reset();
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Send Message →';
      }
    }, 700);
  });
}
