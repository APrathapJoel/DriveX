export function renderAboutPage(): string {
  return `
    <main class="page-enter">
      <!-- Hero -->
      <section class="info-hero">
        <div class="container">
          <div class="info-hero-badge">
            <span>✨</span> Built for Modern Explorers
          </div>
          <h1 class="info-hero-title">Driving the Future of Mobility</h1>
          <p class="info-hero-subtitle">
            DriveR was born out of a simple passion: to make premium, dependable, and self-driven car rentals accessible to every journey across India.
          </p>
        </div>
      </section>

      <!-- Founder Spotlight -->
      <section class="info-section">
        <div class="container">
          <div class="info-section-header">
            <span class="badge badge-primary" style="margin-bottom:var(--space-2);">Leadership</span>
            <h2 class="info-section-title">The Vision Behind DriveR</h2>
            <p class="info-section-subtitle">
              Pioneering transparency, digital-first fleet management, and exceptional customer delight from South India to the nation.
            </p>
          </div>

          <div class="founder-card">
            <div class="founder-avatar-box">
              <div class="founder-avatar">PJ</div>
              <h3 class="founder-name">Prathap Joel</h3>
              <span class="founder-title-badge">Founder & CEO</span>
              <p style="color:var(--text-muted); font-size:0.875rem; margin-top:var(--space-2);">
                Automotive Technologist & Mobility Entrepreneur
              </p>
            </div>
            <div>
              <p class="founder-bio">
                <strong>Prathap Joel</strong> founded DriveR with a decisive vision: to eliminate the friction, hidden fees, and uncertainty historically associated with vehicle rentals in India. Leveraging modern cloud telemetry, instantaneous KYC verification, and a hand-curated fleet of pristine vehicles, he engineered DriveR to deliver a showroom-level experience with every key exchange.
              </p>
              <div class="founder-quote">
                "Our mission is not merely to rent vehicles; it is to empower people with absolute freedom on the open road. Whether it is an everyday commute, a family celebration, or an expedition into the hills, you deserve a vehicle that inspires confidence."
              </div>
              <p class="founder-bio">
                Under Prathap's leadership, DriveR has expanded from its foundational roots in Coimbatore to major hubs across India, maintaining an obsession with mechanical perfection, customer safety, and sustainable electric mobility.
              </p>
            </div>
          </div>

          <!-- Headquarters Spotlight -->
          <div class="hq-banner">
            <div style="display:flex; align-items:center; gap:var(--space-5);">
              <div style="width:64px;height:64px;border-radius:var(--radius-lg);background:rgba(99,102,241,0.15);display:flex;align-items:center;justify-content:center;font-size:2rem;flex-shrink:0;">
                🏢
              </div>
              <div>
                <h3 style="font-size:1.25rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">
                  Headquartered in Coimbatore, Tamil Nadu
                </h3>
                <p style="color:var(--text-secondary); font-size:0.95rem; line-height:1.5;">
                  Known as the industrial and engineering capital of South India, Coimbatore is home to DriveR's central fleet telemetry command, software engineering labs, and operations headquarters.
                </p>
              </div>
            </div>
            <a href="/contact" data-link class="btn btn-outline" style="white-space:nowrap;">
              Visit Our Hub →
            </a>
          </div>
        </div>
      </section>

      <!-- Key Stats -->
      <section class="info-section info-section-alt">
        <div class="container">
          <div class="info-section-header">
            <h2 class="info-section-title">DriveR by the Numbers</h2>
            <p class="info-section-subtitle">
              Milestones that reflect our unwavering dedication to quality and reliability.
            </p>
          </div>

          <div class="about-stats-grid">
            <div class="about-stat-card">
              <div class="about-stat-value">50K+</div>
              <div class="about-stat-label">Successful Trips</div>
            </div>
            <div class="about-stat-card">
              <div class="about-stat-value">500+</div>
              <div class="about-stat-label">Fleet Vehicles</div>
            </div>
            <div class="about-stat-card">
              <div class="about-stat-value">15+</div>
              <div class="about-stat-label">Cities Connected</div>
            </div>
            <div class="about-stat-card">
              <div class="about-stat-value">4.9/5</div>
              <div class="about-stat-label">Customer Satisfaction</div>
            </div>
            <div class="about-stat-card">
              <div class="about-stat-value">24/7</div>
              <div class="about-stat-label">Roadside Support</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Core Values -->
      <section class="info-section">
        <div class="container">
          <div class="info-section-header">
            <span class="badge badge-neutral" style="margin-bottom:var(--space-2);">Our Pillars</span>
            <h2 class="info-section-title">What Guides Every Decision</h2>
            <p class="info-section-subtitle">
              Principles woven into every booking, vehicle handoff, and line of code we write.
            </p>
          </div>

          <div class="values-grid">
            <div class="value-card">
              <div class="value-icon">🛡️</div>
              <h3 class="value-title">Zero-Compromise Safety</h3>
              <p class="value-desc">
                Every vehicle undergoes a 120-point mechanical evaluation before every booking. Brakes, tyres, fluids, and safety restraints are rigorously tested.
              </p>
            </div>
            <div class="value-card">
              <div class="value-icon">💎</div>
              <h3 class="value-title">Transparent & Honest</h3>
              <p class="value-desc">
                No hidden fuel recalculations, surprise maintenance fees, or opaque damage charges. What you see during booking is exactly what you pay.
              </p>
            </div>
            <div class="value-card">
              <div class="value-icon">⚡</div>
              <h3 class="value-title">Sustainable EV Mobility</h3>
              <p class="value-desc">
                Actively accelerating India's transition to clean energy by rapidly scaling our zero-emission electric vehicle fleet across urban centers.
              </p>
            </div>
            <div class="value-card">
              <div class="value-icon">📱</div>
              <h3 class="value-title">Seamless Digital Booking</h3>
              <p class="value-desc">
                Book in under 2 minutes with paperless digital KYC, keyless unlock options, and live booking updates directly on your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Journey Timeline -->
      <section class="info-section info-section-alt">
        <div class="container">
          <div class="info-section-header">
            <h2 class="info-section-title">Our Growth Journey</h2>
            <p class="info-section-subtitle">
              From an ambitious idea in Coimbatore to one of India's fastest-growing car rental platforms.
            </p>
          </div>

          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-year">2022</div>
              <h4 class="timeline-title">The Foundation in Coimbatore</h4>
              <p class="timeline-desc">
                Founder Prathap Joel establishes DriveR Mobility in Coimbatore with an initial boutique fleet of 15 premium vehicles and an in-house digital booking engine.
              </p>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-year">2023</div>
              <h4 class="timeline-title">South India Expansion</h4>
              <p class="timeline-desc">
                Expanded operations across Tamil Nadu and Karnataka, establishing dedicated fleet maintenance hubs and 24/7 highway roadside assistance networks.
              </p>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-year">2024</div>
              <h4 class="timeline-title">Electric Fleet & Luxury Integration</h4>
              <p class="timeline-desc">
                Introduced high-end luxury icons (Porsche, BMW, Audi) alongside smart EVs (Tata Nexon EV, MG ZS EV) with comprehensive smart telematics.
              </p>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-year">2025 - Present</div>
              <h4 class="timeline-title">Pan-India Smart Mobility</h4>
              <p class="timeline-desc">
                Surpassed 50,000 completed journeys, launching instantaneous KYC approval algorithms and AI-powered dynamic pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="info-section" style="text-align:center;">
        <div class="container">
          <div class="card" style="padding:var(--space-12); max-width:800px; margin:0 auto; background:linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(249,115,22,0.1) 100%); border:1px solid rgba(99,102,241,0.3);">
            <h2 style="font-size:2rem; font-weight:800; color:var(--text-primary); margin-bottom:var(--space-3);">
              Experience DriveR for Yourself
            </h2>
            <p style="color:var(--text-secondary); font-size:1.05rem; margin-bottom:var(--space-6);">
              Discover the joy of pure driving freedom with Coimbatore's favorite vehicle rental platform.
            </p>
            <div style="display:flex; justify-content:center; gap:var(--space-4); flex-wrap:wrap;">
              <a href="/vehicles" data-link class="btn btn-primary btn-lg">Browse Our Fleet →</a>
              <a href="/contact" data-link class="btn btn-outline btn-lg">Contact Us</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

export function initAboutPage() {
  // Page initialization interactions if needed
}
