import { showToast } from '../toast';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
}

const JOBS: JobOpening[] = [
  {
    id: 'eng-1',
    title: 'Lead Full-Stack Engineer (Node.js & TypeScript)',
    department: 'Engineering',
    location: 'Coimbatore HQ / Hybrid',
    type: 'Full-time',
    experience: '4 - 7 Years',
    description: 'Architect and scale our real-time vehicle booking engine, telemetry ingest pipeline, and microservices.',
  },
  {
    id: 'eng-2',
    title: 'IoT & Fleet Telematics Firmware Engineer',
    department: 'Engineering',
    location: 'Coimbatore Hub',
    type: 'Full-time',
    experience: '3 - 5 Years',
    description: 'Work directly with onboard CAN-bus interfaces, GPS telemetry units, and remote immobilizer sensors.',
  },
  {
    id: 'prod-1',
    title: 'Senior Product Designer (UI/UX)',
    department: 'Product',
    location: 'Remote / Coimbatore',
    type: 'Full-time',
    experience: '3 - 6 Years',
    description: 'Craft intuitive, frictionless reservation journeys for mobile web, native apps, and internal fleet ops consoles.',
  },
  {
    id: 'ops-1',
    title: 'Fleet Operations & Station Lead',
    department: 'Operations',
    location: 'Coimbatore Hub',
    type: 'Full-time',
    experience: '2 - 5 Years',
    description: 'Oversee vehicle turnarounds, 120-point mechanical audits, and coordinate roadside assistance teams.',
  },
  {
    id: 'ops-2',
    title: 'Automotive Quality & Maintenance Specialist',
    department: 'Operations',
    location: 'Coimbatore Hub',
    type: 'Full-time',
    experience: '3+ Years',
    description: 'Lead periodic preventive maintenance, vendor garage auditing, and safety compliance checks.',
  },
  {
    id: 'cs-1',
    title: 'Customer Experience & Trust Specialist',
    department: 'Support',
    location: 'Coimbatore HQ (Rotational)',
    type: 'Full-time',
    experience: '1 - 3 Years',
    description: 'Deliver empathy, fast resolution, and high-touch support for ongoing trips, extensions, and KYC audits.',
  },
  {
    id: 'mkt-1',
    title: 'Growth & Performance Marketing Specialist',
    department: 'Marketing',
    location: 'Remote / Coimbatore',
    type: 'Full-time',
    experience: '2 - 4 Years',
    description: 'Drive user acquisition across South India road-trip corridors and manage seasonal tourism partnerships.',
  },
];

export function renderCareersPage(): string {
  return `
    <main class="page-enter">
      <!-- Hero -->
      <section class="info-hero">
        <div class="container">
          <div class="info-hero-badge">
            <span>🚀</span> We're Expanding Our Team
          </div>
          <h1 class="info-hero-title">Shape the Future of Mobility</h1>
          <p class="info-hero-subtitle">
            Join Founder Prathap Joel and our high-velocity team at our Coimbatore Headquarters and remote hubs across India.
          </p>
        </div>
      </section>

      <!-- Perks & Benefits -->
      <section class="info-section">
        <div class="container">
          <div class="info-section-header">
            <span class="badge badge-primary" style="margin-bottom:var(--space-2);">Life at DriveR</span>
            <h2 class="info-section-title">Built by Drivers, For Drivers</h2>
            <p class="info-section-subtitle">
              We offer comprehensive perks designed to help you do your best work and enjoy life on the road.
            </p>
          </div>

          <div class="perks-grid">
            <div class="perk-card">
              <div class="perk-icon">🏎️</div>
              <div>
                <h4 style="font-weight:700; margin-bottom:4px; color:var(--text-primary);">Annual Rental Credits</h4>
                <p style="color:var(--text-secondary); font-size:0.9rem;">
                  Generous quarterly credits to drive any car in our fleet—from electric SUVs to Porsche convertibles.
                </p>
              </div>
            </div>

            <div class="perk-card">
              <div class="perk-icon">📈</div>
              <div>
                <h4 style="font-weight:700; margin-bottom:4px; color:var(--text-primary);">Equity & Wealth Creation</h4>
                <p style="color:var(--text-secondary); font-size:0.9rem;">
                  Every full-time team member participates in our competitive ESOP program with structured vesting.
                </p>
              </div>
            </div>

            <div class="perk-card">
              <div class="perk-icon">🏥</div>
              <div>
                <h4 style="font-weight:700; margin-bottom:4px; color:var(--text-primary);">Comprehensive Health Cover</h4>
                <p style="color:var(--text-secondary); font-size:0.9rem;">
                  Full medical coverage for you and your immediate family, including mental wellness support.
                </p>
              </div>
            </div>

            <div class="perk-card">
              <div class="perk-icon">🌴</div>
              <div>
                <h4 style="font-weight:700; margin-bottom:4px; color:var(--text-primary);">Flexible Work & Leaves</h4>
                <p style="color:var(--text-secondary); font-size:0.9rem;">
                  Hybrid flexibility between our Coimbatore headquarters and remote setups, plus generous annual leave.
                </p>
              </div>
            </div>

            <div class="perk-card">
              <div class="perk-icon">📚</div>
              <div>
                <h4 style="font-weight:700; margin-bottom:4px; color:var(--text-primary);">Learning Stipend</h4>
                <p style="color:var(--text-secondary); font-size:0.9rem;">
                  ₹50,000 annual budget for books, technical conferences, certifications, and upskilling courses.
                </p>
              </div>
            </div>

            <div class="perk-card">
              <div class="perk-icon">⚡</div>
              <div>
                <h4 style="font-weight:700; margin-bottom:4px; color:var(--text-primary);">Cutting-Edge Tech Stack</h4>
                <p style="color:var(--text-secondary); font-size:0.9rem;">
                  Modern toolchain: TypeScript, Node.js, Cloud Firestore, IoT hardware, and high-performance frontend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Open Positions -->
      <section class="info-section info-section-alt" id="open-roles">
        <div class="container">
          <div class="info-section-header">
            <span class="badge badge-success" style="margin-bottom:var(--space-2);">7 Openings</span>
            <h2 class="info-section-title">Current Opportunities</h2>
            <p class="info-section-subtitle">
              Explore positions across engineering, fleet logistics, design, and growth.
            </p>
          </div>

          <!-- Department Filter -->
          <div class="jobs-filter-bar">
            <button class="filter-chip active" data-dept="all">All Roles</button>
            <button class="filter-chip" data-dept="Engineering">Engineering</button>
            <button class="filter-chip" data-dept="Product">Product & Design</button>
            <button class="filter-chip" data-dept="Operations">Operations & Fleet</button>
            <button class="filter-chip" data-dept="Support">Customer Experience</button>
            <button class="filter-chip" data-dept="Marketing">Marketing</button>
          </div>

          <!-- Job Cards List -->
          <div class="jobs-list" id="jobs-container">
            ${renderJobList(JOBS)}
          </div>
        </div>
      </section>

      <!-- Application Modal Container -->
      <div id="job-modal-container"></div>
    </main>
  `;
}

function renderJobList(jobs: JobOpening[]): string {
  if (jobs.length === 0) {
    return `<div class="empty-state">No open roles found in this department.</div>`;
  }

  return jobs.map(job => `
    <div class="job-card" data-job-id="${job.id}">
      <div>
        <h3 class="job-title">${job.title}</h3>
        <p style="color:var(--text-secondary); font-size:0.925rem; margin-bottom:var(--space-3); max-width:680px;">
          ${job.description}
        </p>
        <div class="job-meta">
          <span class="job-meta-item">📁 ${job.department}</span>
          <span class="job-meta-item">📍 ${job.location}</span>
          <span class="job-meta-item">⏱️ ${job.type}</span>
          <span class="job-meta-item">💼 ${job.experience}</span>
        </div>
      </div>
      <button class="btn btn-primary btn-sm apply-job-btn" data-job-id="${job.id}" style="white-space:nowrap;">
        Apply Now →
      </button>
    </div>
  `).join('');
}

export function initCareersPage() {
  const container = document.getElementById('jobs-container');
  const modalContainer = document.getElementById('job-modal-container');

  // Filter chips click
  document.querySelectorAll('.jobs-filter-bar .filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.jobs-filter-bar .filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const dept = btn.getAttribute('data-dept') || 'all';
      const filtered = dept === 'all' ? JOBS : JOBS.filter(j => j.department.toLowerCase() === dept.toLowerCase());
      if (container) {
        container.innerHTML = renderJobList(filtered);
        attachApplyListeners();
      }
    });
  });

  function attachApplyListeners() {
    document.querySelectorAll('.apply-job-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const jobId = btn.getAttribute('data-job-id');
        const job = JOBS.find(j => j.id === jobId);
        if (job && modalContainer) {
          openApplyModal(job, modalContainer);
        }
      });
    });
  }

  attachApplyListeners();
}

function openApplyModal(job: JobOpening, modalContainer: HTMLElement) {
  modalContainer.innerHTML = `
    <div class="info-modal-backdrop" id="modal-backdrop">
      <div class="info-modal">
        <button class="info-modal-close" id="modal-close">&times;</button>
        <span class="badge badge-primary" style="margin-bottom:var(--space-2);">${job.department}</span>
        <h2 style="font-size:1.5rem; font-weight:700; color:var(--text-primary); margin-bottom:var(--space-1);">
          Apply for ${job.title}
        </h2>
        <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:var(--space-6);">
          Location: ${job.location} · ${job.type}
        </p>

        <form id="apply-job-form">
          <div class="form-group">
            <label class="form-label" for="applicant-name">Full Name *</label>
            <input type="text" class="form-input" id="applicant-name" required placeholder="e.g. Ananya Sundaram"/>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-4);">
            <div class="form-group">
              <label class="form-label" for="applicant-email">Email Address *</label>
              <input type="email" class="form-input" id="applicant-email" required placeholder="you@example.com"/>
            </div>
            <div class="form-group">
              <label class="form-label" for="applicant-phone">Phone Number *</label>
              <input type="tel" class="form-input" id="applicant-phone" required placeholder="+91 98765 43210"/>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="applicant-linkedin">LinkedIn / Portfolio URL *</label>
            <input type="url" class="form-input" id="applicant-linkedin" required placeholder="https://linkedin.com/in/..."/>
          </div>

          <div class="form-group">
            <label class="form-label" for="applicant-notes">Why DriveR? (Cover Note)</label>
            <textarea class="form-textarea" id="applicant-notes" rows="3" placeholder="Tell us about yourself and why you want to join our Coimbatore mobility team..."></textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:var(--space-3); margin-top:var(--space-6);">
            <button type="button" class="btn btn-ghost" id="cancel-modal-btn">Cancel</button>
            <button type="submit" class="btn btn-primary" id="submit-application-btn">
              Submit Application →
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const close = () => {
    modalContainer.innerHTML = '';
  };

  document.getElementById('modal-close')?.addEventListener('click', close);
  document.getElementById('cancel-modal-btn')?.addEventListener('click', close);
  document.getElementById('modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-backdrop')) close();
  });

  document.getElementById('apply-job-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-application-btn') as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    setTimeout(() => {
      showToast(`Application submitted for ${job.title}! Our Coimbatore recruitment team will review your profile.`, 'success');
      close();
    }, 600);
  });
}
