export function renderTermsPage(): string {
  return `
    <main class="page-enter">
      <!-- Hero -->
      <section class="info-hero">
        <div class="container">
          <div class="info-hero-badge">
            <span>📜</span> Legal Documentation
          </div>
          <h1 class="info-hero-title">Terms of Service</h1>
          <p class="info-hero-subtitle">
            Please read these rental terms carefully before booking or operating any vehicle on the DriveR platform.
          </p>
          <div style="font-size:0.875rem; color:var(--text-muted); margin-top:var(--space-4);">
            Effective Date: March 1, 2026 · Registered Entity: DriveR Mobility Private Limited (Coimbatore, India)
          </div>
        </div>
      </section>

      <!-- Terms Content Layout -->
      <section class="info-section">
        <div class="container">
          <div class="legal-layout">
            <!-- Sticky Sidebar Nav -->
            <aside class="legal-nav">
              <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; padding:var(--space-2) var(--space-3);">
                Table of Contents
              </span>
              <a href="#section-1" class="legal-nav-link active">1. Overview & Entity</a>
              <a href="#section-2" class="legal-nav-link">2. Driver Eligibility</a>
              <a href="#section-3" class="legal-nav-link">3. Bookings & Security Deposit</a>
              <a href="#section-4" class="legal-nav-link">4. Handover & Return Protocol</a>
              <a href="#section-5" class="legal-nav-link">5. Fuel & Charging Policy</a>
              <a href="#section-6" class="legal-nav-link">6. Prohibited Activities</a>
              <a href="#section-7" class="legal-nav-link">7. Tolls & Traffic Violations</a>
              <a href="#section-8" class="legal-nav-link">8. Insurance & Damages</a>
              <a href="#section-9" class="legal-nav-link">9. Cancellations & Refunds</a>
              <a href="#section-10" class="legal-nav-link">10. Governing Law (Coimbatore)</a>
            </aside>

            <!-- Legal Clauses Body -->
            <div class="legal-content">
              <section id="section-1">
                <h2>1. Overview & Legal Entity</h2>
                <p>
                  These Terms of Service ("Agreement") constitute a legally binding agreement between you ("User", "Renter", or "Customer") and <strong>DriveR Mobility Private Limited</strong>, an automotive mobility enterprise incorporated under the Companies Act with its principal headquarters located at Tech Park, Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu — 641004 ("DriveR", "we", "us", or "our"), founded by <strong>Prathap Joel</strong>.
                </p>
                <p>
                  By accessing the DriveR website, booking a vehicle, or operating any motor vehicle owned or managed by DriveR, you unconditionally agree to abide by and be bound by all terms, policies, and conditions herein.
                </p>
              </section>

              <section id="section-2">
                <h2>2. Driver Eligibility & Document Verification</h2>
                <p>
                  To be eligible to rent and operate a DriveR vehicle, every driver must fulfill the following mandatory criteria:
                </p>
                <ul>
                  <li><strong>Age Requirement:</strong> The primary renter must be at least 21 years of age at the time of reservation. Luxury and sports category vehicles require a minimum age of 24.</li>
                  <li><strong>Valid Driving License:</strong> A valid, unexpired original Driver's License issued by the appropriate Government Transport Authority, held for at least one (1) full year. Learner permits are strictly disallowed.</li>
                  <li><strong>Government Identity Proof:</strong> Mandatory submission of Aadhaar, Passport, or Voter ID matching the name on the driver's license.</li>
                  <li><strong>KYC Verification:</strong> Verification documents must be submitted and approved by DriveR administrators prior to vehicle dispatch.</li>
                </ul>
              </section>

              <section id="section-3">
                <h2>3. Bookings, Pricing & Security Deposits</h2>
                <p>
                  All bookings are subject to vehicle availability and confirmation upon receipt of upfront payment. Rental fees consist of base hourly/daily rates, mandatory insurance cover, applicable Goods and Services Tax (GST), and a refundable security deposit.
                </p>
                <div class="legal-box">
                  <strong>Security Deposit Protocol:</strong> A refundable deposit ranging from ₹2,000 to ₹10,000 (depending on car category) is authorized upon booking. Following the physical return and digital inspection of the vehicle, the deposit will be returned in full within 24 to 48 banking hours, subject to deductions for unpaid tolls, fuel shortfalls, or accidental damage.
                </div>
              </section>

              <section id="section-4">
                <h2>4. Vehicle Handover & Return Protocol</h2>
                <p>
                  Vehicles must be collected and returned at the designated location and scheduled time agreed upon during checkout.
                </p>
                <ul>
                  <li><strong>Inspection at Handover:</strong> Both renter and DriveR representative will perform a 360-degree digital inspection recording existing scratches, tyre condition, and fuel/charge level.</li>
                  <li><strong>Late Returns:</strong> A grace period of 30 minutes is extended. Returns exceeding 30 minutes without prior documented extension will incur standard hourly rates plus a late fee of ₹500 per hour.</li>
                  <li><strong>Condition on Return:</strong> The vehicle must be returned in reasonably clean condition. Excessive dirt, mud, pet hair, or foul odors requiring professional deep detailing will incur a cleaning fee of ₹1,000.</li>
                </ul>
              </section>

              <section id="section-5">
                <h2>5. Fuel & Electric Vehicle Charging Policy</h2>
                <p>
                  DriveR operates on a straightforward <strong>Full-to-Full</strong> fuel policy for internal combustion vehicles. If the car is delivered with 100% fuel, the renter is expected to return it with 100% fuel. If returned with less, the shortfall will be charged at current local pump rates plus a ₹250 refueling convenience fee.
                </p>
                <p>
                  For Electric Vehicles (EVs), the car will be handed over with a minimum of 85% state of charge. Renters are requested to return the EV with at least 20% battery charge to prevent deep discharge of the traction battery.
                </p>
              </section>

              <section id="section-6">
                <h2>6. Prohibited Activities</h2>
                <p>
                  The following operations are expressly prohibited and constitute a material breach of this Agreement, rendering insurance void and leading to immediate vehicle recovery:
                </p>
                <ul>
                  <li>Driving under the influence of alcohol, narcotics, prescription sedatives, or intoxicants.</li>
                  <li>Using the vehicle for motor racing, speed testing, drifting, or commercial ride-hailing/taxi services.</li>
                  <li>Subleasing, lending, or permitting any non-registered individual to operate the vehicle.</li>
                  <li>Transporting hazardous chemicals, contraband, uninspected livestock, or firearms.</li>
                  <li>Off-roading, traversing waterlogged rivers, or driving on unauthorized non-motorable terrain.</li>
                </ul>
              </section>

              <section id="section-7">
                <h2>7. Highway Tolls & Traffic Violations</h2>
                <p>
                  The renter is solely and exclusively responsible for all traffic fines, parking challans, speeding violations, and local municipal penalties incurred during the rental period. DriveR vehicles feature automated FASTag sensors; all toll charges incurred on national and state highways are automatically calculated and deducted from the security deposit with zero markup.
                </p>
              </section>

              <section id="section-8">
                <h2>8. Insurance & Accidental Damage Liability</h2>
                <p>
                  All DriveR vehicles carry comprehensive motor vehicle insurance covering third-party bodily injury and property damage in compliance with the Motor Vehicles Act, 1988. In the event of accidental damage:
                </p>
                <ul>
                  <li>The customer's maximum financial liability is capped at the pre-agreed security deposit, provided the customer was not driving in violation of Section 6 (Prohibited Activities).</li>
                  <li>Customers must report any collision or damage to DriveR within two (2) hours and cooperate in filing a Police First Information Report (FIR) if required for insurance processing.</li>
                </ul>
              </section>

              <section id="section-9">
                <h2>9. Cancellations & Refund Schedules</h2>
                <p>
                  Cancellations initiated more than 24 hours prior to the scheduled start time receive a 100% full refund with zero cancellation fee. Cancellations made between 6 to 24 hours prior to trip start time will receive a 50% refund. Cancellations under 6 hours are non-refundable as the vehicle was reserved and blocked exclusively for your slot.
                </p>
              </section>

              <section id="section-10">
                <h2>10. Governing Law & Jurisdiction</h2>
                <p>
                  This Agreement and any dispute, controversy, or claim arising out of or in connection with it shall be governed by and construed in accordance with the substantive laws of the Republic of India.
                </p>
                <div class="legal-box">
                  <strong>Jurisdiction:</strong> The competent civil courts situated in <strong>Coimbatore, Tamil Nadu, India</strong> shall have exclusive jurisdiction to settle any disputes or legal proceedings arising hereunder.
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

export function initTermsPage() {
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
