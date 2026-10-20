export function renderPrivacyPage(): string {
  return `
    <main class="page-enter">
      <!-- Hero -->
      <section class="info-hero">
        <div class="container">
          <div class="info-hero-badge">
            <span>🔒</span> Privacy & Data Governance
          </div>
          <h1 class="info-hero-title">Privacy Policy</h1>
          <p class="info-hero-subtitle">
            How DriveR collects, safeguards, and handles your personal information and KYC verification records.
          </p>
          <div style="font-size:0.875rem; color:var(--text-muted); margin-top:var(--space-4);">
            Effective Date: March 1, 2026 · Compliant with the Digital Personal Data Protection (DPDP) Act
          </div>
        </div>
      </section>

      <!-- Privacy Content Layout -->
      <section class="info-section">
        <div class="container">
          <div class="legal-layout">
            <!-- Sticky Sidebar Nav -->
            <aside class="legal-nav">
              <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; padding:var(--space-2) var(--space-3);">
                Table of Contents
              </span>
              <a href="#privacy-1" class="legal-nav-link active">1. Overview</a>
              <a href="#privacy-2" class="legal-nav-link">2. Data We Collect</a>
              <a href="#privacy-3" class="legal-nav-link">3. KYC Document Security</a>
              <a href="#privacy-4" class="legal-nav-link">4. Telematics & GPS Data</a>
              <a href="#privacy-5" class="legal-nav-link">5. Data Sharing & Disclosures</a>
              <a href="#privacy-6" class="legal-nav-link">6. Your Rights (DPDP Act)</a>
              <a href="#privacy-7" class="legal-nav-link">7. Data Retention</a>
              <a href="#privacy-8" class="legal-nav-link">8. Grievance Officer (Coimbatore)</a>
            </aside>

            <!-- Legal Clauses Body -->
            <div class="legal-content">
              <section id="privacy-1">
                <h2>1. Overview & Commitment to Privacy</h2>
                <p>
                  At <strong>DriveR Mobility Private Limited</strong> ("DriveR", "we", "our", or "us"), founded by <strong>Prathap Joel</strong> with headquarters in Coimbatore, Tamil Nadu, we take the confidentiality of your personal and identity data with utmost seriousness.
                </p>
                <p>
                  This Privacy Policy delineates the specific categories of data we collect through our online platform, how it is stored securely, the restricted purposes for which it is utilized, and your legal rights under applicable Indian privacy legislation, including the Information Technology Act and the Digital Personal Data Protection (DPDP) Act.
                </p>
              </section>

              <section id="privacy-2">
                <h2>2. Categories of Information We Collect</h2>
                <p>
                  In order to provide secure self-drive vehicle rental services, we collect the following categories of information:
                </p>
                <ul>
                  <li><strong>Personal Identification Data:</strong> Full name, telephone number, residential address, date of birth, and email address.</li>
                  <li><strong>Government & KYC Documents:</strong> High-resolution digital photographs or scans of your valid Driving License, Aadhaar card, Passport, or Voter ID required for legal driver validation.</li>
                  <li><strong>Payment & Financial Data:</strong> Transaction references, UPI transaction IDs, and card tokens processed through PCI-DSS Level 1 certified banking gateways. We never store raw debit/credit card CVV or PIN numbers on our servers.</li>
                  <li><strong>Technical & Session Data:</strong> IP address, device fingerprints, browser version, and usage analytics when accessing the DriveR platform.</li>
                </ul>
              </section>

              <section id="privacy-3">
                <h2>3. Security & Storage of KYC Verification Documents</h2>
                <div class="legal-box">
                  <strong>Zero Commercial Sale Policy:</strong> DriveR will never sell, monetize, lease, or distribute your identity documents or personal contact details to advertisers or third-party marketing brokers.
                </div>
                <p>
                  Identity verification documents uploaded via your account are stored in secure cloud storage environments protected by <strong>AES-256 bit encryption at rest</strong> and TLS 1.3 encryption in transit. Access to KYC documents is strictly restricted via role-based authentication to vetted compliance administrators at our central headquarters in Coimbatore solely to verify driver eligibility.
                </p>
              </section>

              <section id="privacy-4">
                <h2>4. Vehicle Telematics, GPS & Driving Telemetry</h2>
                <p>
                  For passenger safety, emergency assistance, and fleet security, DriveR vehicles feature telematics hardware. This hardware records:
                </p>
                <ul>
                  <li>Vehicle real-time geographical coordinates (GPS location) during active trips.</li>
                  <li>Critical telemetry including speed, odometer mileage, battery state-of-charge (EVs), fuel levels, and collision/airbag trigger events.</li>
                </ul>
                <p>
                  This telemetry is utilized strictly for route safety, emergency dispatch during accidents, automated FASTag toll settlements, and vehicle theft prevention. We do not track personal habits or maintain perpetual post-trip movement dossiers.
                </p>
              </section>

              <section id="privacy-5">
                <h2>5. Data Sharing & Legal Disclosures</h2>
                <p>
                  We only disclose personal data under the following defined circumstances:
                </p>
                <ul>
                  <li><strong>Emergency Responders & Roadside Partners:</strong> Sharing your live location and vehicle status with recovery teams, emergency ambulances, or towing services upon an active breakdown or SOS trigger.</li>
                  <li><strong>Insurance Providers:</strong> Sharing accident documentation and driver verification records to process insurance claims in the event of vehicular collision.</li>
                  <li><strong>Law Enforcement & Statutory Mandates:</strong> Disclosing trip logs or driver details when formally subpoenaed by judicial or police authorities investigating hit-and-run incidents or criminal offenses.</li>
                </ul>
              </section>

              <section id="privacy-6">
                <h2>6. Your Rights under the DPDP Act</h2>
                <p>
                  As a data principal, you possess enforceable rights regarding your personal information:
                </p>
                <ul>
                  <li><strong>Right to Access:</strong> You can request a summary of the personal information and documents held by DriveR.</li>
                  <li><strong>Right to Correction & Erasure:</strong> You may update outdated contact details or request the deletion of your account and archived documents once active trip obligations and statutory limitation periods conclude.</li>
                  <li><strong>Right to Grievance Redressal:</strong> Direct access to our designated Grievance Officer in Coimbatore for prompt resolution of privacy concerns.</li>
                </ul>
              </section>

              <section id="privacy-7">
                <h2>7. Data Retention Schedule</h2>
                <p>
                  We retain personal customer data for the duration of your active account relationship. Statutory tax invoices, rental contracts, and trip logs are retained for seven (7) years in accordance with Indian commercial tax and motor vehicle regulatory guidelines, after which they are securely purged or irreversibly anonymized.
                </p>
              </section>

              <section id="privacy-8">
                <h2>8. Data Protection & Grievance Officer</h2>
                <p>
                  For questions, requests to exercise your rights, or formal privacy inquiries, please contact our Grievance Officer:
                </p>
                <div class="legal-box">
                  <strong>Data Protection & Grievance Officer:</strong><br/>
                  DriveR Mobility Private Limited<br/>
                  Tech Park, Avinashi Road, Peelamedu,<br/>
                  Coimbatore, Tamil Nadu — 641004, India<br/>
                  Email: <a href="mailto:privacy@driver.com" style="color:var(--primary-400);">privacy@driver.com</a> · Support Desk: <a href="mailto:support@driver.com" style="color:var(--primary-400);">support@driver.com</a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

export function initPrivacyPage() {
  // Smooth scroll for legal nav links
  document.querySelectorAll('.legal-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          document.querySelectorAll('.legal-nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });
}
