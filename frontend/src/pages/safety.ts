export function renderSafetyPage(): string {
  return `
    <main class="page-enter">
      <!-- Hero -->
      <section class="info-hero">
        <div class="container">
          <div class="info-hero-badge">
            <span>🛡️</span> Zero-Compromise Security
          </div>
          <h1 class="info-hero-title">Your Safety Drives Everything We Do</h1>
          <p class="info-hero-subtitle">
            From exhaustive 120-point mechanical audits to real-time IoT roadside dispatch, discover how DriveR delivers peace of mind across every mile.
          </p>
        </div>
      </section>

      <!-- The 5-Point Safety Shield -->
      <section class="info-section">
        <div class="container">
          <div class="info-section-header">
            <span class="badge badge-primary" style="margin-bottom:var(--space-2);">The DriveR Standard</span>
            <h2 class="info-section-title">The 5-Point Safety Shield</h2>
            <p class="info-section-subtitle">
              Every vehicle in our fleet is engineered, audited, and monitored to meet stringent safety specifications.
            </p>
          </div>

          <div class="values-grid">
            <div class="value-card">
              <div class="value-icon" style="background:rgba(16,185,129,0.15); color:var(--success);">🔧</div>
              <h3 class="value-title">120-Point Mechanical Audit</h3>
              <p class="value-desc">
                Before any key is handed over, trained mechanics in our Coimbatore service facility inspect brake pad thickness, rotor runout, tyre tread depths, suspension joints, and electrical subsystems.
              </p>
            </div>

            <div class="value-card">
              <div class="value-icon" style="background:rgba(59,130,246,0.15); color:var(--info);">✨</div>
              <h3 class="value-title">Clinical Sanitization</h3>
              <p class="value-desc">
                Our vehicles undergo complete high-temperature steam cleaning, HEPA cabin air filter vacuuming, and antibacterial surface sterilization for steering wheels, infotainment dials, and handles.
              </p>
            </div>

            <div class="value-card">
              <div class="value-icon" style="background:rgba(139,92,246,0.15); color:#8b5cf6;">📡</div>
              <h3 class="value-title">IoT Telematics & Diagnostics</h3>
              <p class="value-desc">
                Certified onboard sensors monitor real-time battery health, tyre pressures, brake wear, and engine trouble codes. If an anomaly occurs, our central desk receives an automated diagnostic alert.
              </p>
            </div>

            <div class="value-card">
              <div class="value-icon" style="background:rgba(249,115,22,0.15); color:var(--accent-500);">🚨</div>
              <h3 class="value-title">24/7 Roadside Assistance</h3>
              <p class="value-desc">
                Flat tyre? Dead battery? Highway snag? We partner with 1,200+ certified recovery units across South India and national highways to reach you in under 45 minutes on average.
              </p>
            </div>

            <div class="value-card">
              <div class="value-icon" style="background:rgba(239,68,68,0.15); color:var(--error);">🆔</div>
              <h3 class="value-title">Verified Community & KYC</h3>
              <p class="value-desc">
                Only verified drivers with valid government licenses and clear records can book on DriveR, safeguarding the integrity of our vehicles and the driving community.
              </p>
            </div>

            <div class="value-card">
              <div class="value-icon" style="background:rgba(99,102,241,0.15); color:var(--primary-400);">🛡️</div>
              <h3 class="value-title">Comprehensive Insurance</h3>
              <p class="value-desc">
                All rentals include bumper-to-bumper insurance with comprehensive third-party liability coverage and optional Zero-Liability Collision Damage Waivers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Emergency Protocol Step-by-Step -->
      <section class="info-section info-section-alt">
        <div class="container">
          <div class="info-section-header">
            <span class="badge badge-warning" style="margin-bottom:var(--space-2);">Emergency Readiness</span>
            <h2 class="info-section-title">What to Do in an Unexpected Emergency</h2>
            <p class="info-section-subtitle">
              Follow these three simple steps if you ever experience a breakdown or highway issue during your rental.
            </p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:var(--space-6); max-width:1000px; margin:0 auto;">
            <div class="card" style="padding:var(--space-8); border:1px solid var(--border-default);">
              <div style="font-size:2rem; margin-bottom:var(--space-3); color:var(--primary-400); font-weight:800;">01</div>
              <h4 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:var(--space-2);">Pull Over to Safety</h4>
              <p style="color:var(--text-secondary); font-size:0.925rem; line-height:1.6;">
                Steer the vehicle to the shoulder or safe lane, turn on hazard warning lights, and place the reflective emergency triangle 30 meters behind the vehicle.
              </p>
            </div>

            <div class="card" style="padding:var(--space-8); border:1px solid var(--border-default);">
              <div style="font-size:2rem; margin-bottom:var(--space-3); color:var(--primary-400); font-weight:800;">02</div>
              <h4 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:var(--space-2);">Call +91 98765 43210</h4>
              <p style="color:var(--text-secondary); font-size:0.925rem; line-height:1.6;">
                Our 24/7 central desk in Coimbatore is on standby. Give our team your booking ID and current location coordinates.
              </p>
            </div>

            <div class="card" style="padding:var(--space-8); border:1px solid var(--border-default);">
              <div style="font-size:2rem; margin-bottom:var(--space-3); color:var(--primary-400); font-weight:800;">03</div>
              <h4 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:var(--space-2);">Dispatch & Resolution</h4>
              <p style="color:var(--text-secondary); font-size:0.925rem; line-height:1.6;">
                We dispatch mobile roadside units for on-spot fixes (jump-starts, punctures) or arrange a replacement car or towing if necessary.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Highway Speed & Telematics Policy -->
      <section class="info-section">
        <div class="container">
          <div class="hq-banner">
            <div>
              <span class="badge badge-neutral" style="margin-bottom:var(--space-2);">Speed Policy</span>
              <h3 style="font-size:1.35rem; font-weight:700; color:var(--text-primary); margin-bottom:var(--space-2);">
                Speed Governance & Safe Highway Travel
              </h3>
              <p style="color:var(--text-secondary); font-size:0.95rem; line-height:1.6; max-width:760px;">
                In compliance with the Ministry of Road Transport & Highways (MoRTH) standards, all DriveR vehicles are electronically governed at 120 km/h for highway safety. Real-time telemetry warns drivers of harsh braking, sharp steering, or excessive acceleration, preserving vehicle longevity and passenger lives.
              </p>
            </div>
            <a href="/terms" data-link class="btn btn-outline" style="white-space:nowrap;">
              View Rental Terms →
            </a>
          </div>
        </div>
      </section>
    </main>
  `;
}

export function initSafetyPage() {
  // Page initialization interactions if needed
}
