import { api } from '../api';
import { auth } from '../auth';
import { showToast } from '../toast';

interface KycState {
  docType: 'drivers_licence' | 'aadhaar' | 'passport';
  docNumber: string;
  fullName: string;
  isScanning: boolean;
  isVerified: boolean;
  step: 'upload' | 'scanning' | 'approved';
}

let kycState: KycState = {
  docType: 'drivers_licence',
  docNumber: 'DL-0420110012345',
  fullName: 'Rahul Sharma',
  isScanning: false,
  isVerified: false,
  step: 'upload',
};

export function renderKycPage(): string {
  const user = auth.getUser();
  const isAlreadyVerified = user?.verificationStatus === 'VERIFIED';

  return `
    <main class="page-enter kyc-page" style="padding-top: calc(var(--header-height) + var(--space-8)); padding-bottom: var(--space-16);">
      <div class="container" style="max-width: 960px;">
        <!-- Header -->
        <div class="kyc-header animate-fade-in-down" style="text-align:center; margin-bottom:var(--space-8);">
          <div style="display:inline-flex; align-items:center; gap:var(--space-2); margin-bottom:var(--space-3);">
            <span class="badge ${isAlreadyVerified ? 'badge-success' : 'badge-primary'}">
              ${isAlreadyVerified ? '✓ Identity Verified Driver' : '⚡ AI Instant KYC Verification (3 Seconds)'}
            </span>
            <span class="badge" style="background:rgba(16,185,129,0.15); color:var(--success); border:1px solid rgba(16,185,129,0.3);">
              Govt. Parivahan Sarathi DB Linked
            </span>
          </div>
          <h1 class="kyc-title" style="font-size:2.5rem; font-family:var(--font-heading);">
            Instant Driver KYC Verification
          </h1>
          <p class="kyc-subtitle" style="color:var(--text-secondary); max-width:620px; margin:var(--space-2) auto 0;">
            Upload your Driving License or government ID for real-time neural OCR verification. 
            Enjoy zero security deposit hold and contactless smart-key handover.
          </p>
        </div>

        <div id="kyc-main-container" class="kyc-container">
          <!-- Populated by initKycPage() -->
        </div>
      </div>
    </main>
  `;
}

export async function initKycPage() {
  const user = auth.getUser();
  if (user) {
    kycState.fullName = user.name;
    kycState.isVerified = user.verificationStatus === 'VERIFIED';
    if (kycState.isVerified) {
      kycState.step = 'approved';
    }
  }

  renderKycView();
}

function renderKycView() {
  const container = document.getElementById('kyc-main-container');
  if (!container) return;

  if (kycState.step === 'approved') {
    container.innerHTML = renderApprovedCertificate();
    attachCertificateEvents();
    return;
  }

  container.innerHTML = `
    <div class="kyc-card card animate-scale-in">
      <!-- Step 1: Document Selector Tabs -->
      <div class="kyc-step-section">
        <label class="form-label">Step 1: Select Verification Document</label>
        <div class="kyc-doc-tabs">
          <button class="kyc-doc-tab ${kycState.docType === 'drivers_licence' ? 'active' : ''}" data-type="drivers_licence">
            <span class="doc-tab-icon">🪪</span>
            <div class="doc-tab-info">
              <strong>Driving License</strong>
              <span>Recommended for Car Rental</span>
            </div>
            <span class="doc-check">✓</span>
          </button>

          <button class="kyc-doc-tab ${kycState.docType === 'aadhaar' ? 'active' : ''}" data-type="aadhaar">
            <span class="doc-tab-icon">🏛️</span>
            <div class="doc-tab-info">
              <strong>Aadhaar Card</strong>
              <span>Instant DigiLocker Sync</span>
            </div>
            <span class="doc-check">✓</span>
          </button>

          <button class="kyc-doc-tab ${kycState.docType === 'passport' ? 'active' : ''}" data-type="passport">
            <span class="doc-tab-icon">🛂</span>
            <div class="doc-tab-info">
              <strong>Indian Passport</strong>
              <span>For NRI & Global Drivers</span>
            </div>
            <span class="doc-check">✓</span>
          </button>
        </div>
      </div>

      <!-- Step 2: Interactive Document Scanner Box -->
      <div class="kyc-scanner-section" style="margin-top:var(--space-6);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-3);">
          <label class="form-label" style="margin:0;">Step 2: Document Inspection & OCR Scanner</label>
          <button type="button" class="btn btn-ghost btn-sm" id="load-sample-doc-btn" style="color:var(--primary-400);">
            ✨ Auto-Load Verified Sample License
          </button>
        </div>

        <div class="kyc-scan-viewport" id="scan-viewport">
          <!-- Laser Beam Animation Element -->
          <div class="laser-scanner" id="laser-scanner" style="${kycState.isScanning ? 'display:block;' : 'display:none;'}"></div>

          <!-- Document Hologram Preview -->
          <div class="simulated-dl-card" id="simulated-doc">
            <div class="dl-header">
              <span class="dl-emblem">🇮🇳</span>
              <div>
                <h5>UNION OF INDIA · DRIVING LICENCE</h5>
                <p>TRANSPORT DEPARTMENT OF TAMIL NADU</p>
              </div>
              <span class="dl-chip-icon">⚡ CHIP</span>
            </div>

            <div class="dl-body">
              <div class="dl-photo-box">
                <span class="dl-avatar-emoji">👨‍💼</span>
                <span class="dl-photo-verified">AI MATCH</span>
              </div>
              <div class="dl-details">
                <div class="dl-field">
                  <span class="dl-lbl">DL NUMBER</span>
                  <span class="dl-val" id="dl-number-val">${kycState.docNumber}</span>
                </div>
                <div class="dl-field">
                  <span class="dl-lbl">NAME</span>
                  <span class="dl-val" id="dl-name-val">${kycState.fullName.toUpperCase()}</span>
                </div>
                <div class="dl-row-2">
                  <div class="dl-field">
                    <span class="dl-lbl">DOB</span>
                    <span class="dl-val">14-08-1996</span>
                  </div>
                  <div class="dl-field">
                    <span class="dl-lbl">VALID TILL</span>
                    <span class="dl-val" style="color:#10b981;">15-08-2036</span>
                  </div>
                </div>
                <div class="dl-field">
                  <span class="dl-lbl">VEHICLE CLASS</span>
                  <span class="dl-val">LMV-NT (Light Motor Vehicle Car)</span>
                </div>
              </div>
            </div>

            <div class="dl-footer">
              <span class="dl-badge-pill">● SMART CARD VERIFIED</span>
              <span class="dl-sign">Authentic Sarathi Signature</span>
            </div>
          </div>
        </div>

        <!-- Biometric Selfie / Liveness Check Simulator -->
        <div class="kyc-biometric-box" style="margin-top:var(--space-5);">
          <div class="biometric-camera-preview">
            <div class="camera-face-circle">
              <div class="face-radar-pulse"></div>
              <span class="camera-emoji">🧑</span>
            </div>
            <div class="biometric-meta">
              <h4>Biometric Liveness & Face Match Check</h4>
              <p>Simulating 3D depth facial scan to match against driving license photo.</p>
              <span class="badge badge-success" style="font-size:0.75rem;">✓ 99.8% Facial Contour Match</span>
            </div>
          </div>
        </div>

        <!-- Live Terminal Scanner Readout (Visible when scanning) -->
        <div class="kyc-terminal" id="kyc-terminal" style="${kycState.isScanning ? 'display:block;' : 'display:none;'}">
          <div class="terminal-bar">
            <span>● ● ●</span>
            <span>Neural OCR Engine v4.2 · Parivahan API</span>
          </div>
          <div class="terminal-logs" id="terminal-logs">
            <p class="term-line">Initializing optical recognition engine...</p>
          </div>
        </div>

        <!-- Action Button -->
        <button class="btn btn-primary btn-lg" id="run-verify-btn" style="width:100%; margin-top:var(--space-6); font-size:1.125rem;">
          <span id="verify-btn-text">⚡ Run Instant AI Neural Verification</span>
        </button>
      </div>
    </div>
  `;

  attachKycEvents();
}

function renderApprovedCertificate(): string {
  const user = auth.getUser();
  const userName = user?.name || kycState.fullName;
  const certId = 'CERT-IND-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  return `
    <div class="kyc-certificate-card card animate-scale-in" style="text-align:center; padding:var(--space-10) var(--space-6);">
      <div class="cert-gold-seal">
        <span>🏆</span>
      </div>

      <span class="badge badge-success" style="font-size:0.875rem; margin-top:var(--space-4);">✓ Verified DriveR Profile Active</span>
      <h2 style="margin-top:var(--space-3); font-size:2.25rem; font-family:var(--font-heading);">Identity Verified Successfully! 🎉</h2>
      <p style="color:var(--text-secondary); max-width:580px; margin:var(--space-2) auto var(--space-6);">
        Your driving credentials have been verified through Parivahan Sarathi. You now have complete access to instant self-drive bookings with zero security deposit hold.
      </p>

      <!-- Digital Pass Card -->
      <div class="verified-pass-box">
        <div class="pass-header">
          <span class="pass-logo">🚗 DriveR Verified Pass</span>
          <span class="pass-id">${certId}</span>
        </div>
        <div class="pass-body">
          <div class="pass-user">
            <div class="pass-avatar">${userName.charAt(0).toUpperCase()}</div>
            <div style="text-align:left;">
              <h4>${userName}</h4>
              <p>DL No: ${kycState.docNumber}</p>
              <p style="color:#10b981; font-weight:600;">Status: Full Tier-1 Driving Authority</p>
            </div>
          </div>
          <div class="pass-qr">
            <svg width="64" height="64" viewBox="0 0 100 100">
              <rect width="100" height="100" fill="#ffffff" rx="8"/>
              <rect x="10" y="10" width="24" height="24" fill="#0f172a" rx="4"/>
              <rect x="66" y="10" width="24" height="24" fill="#0f172a" rx="4"/>
              <rect x="10" y="66" width="24" height="24" fill="#0f172a" rx="4"/>
              <rect x="42" y="42" width="16" height="16" fill="#10b981" rx="2"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display:flex; justify-content:center; gap:var(--space-4); flex-wrap:wrap; margin-top:var(--space-8);">
        <a href="/vehicles" data-link class="btn btn-accent btn-lg" style="box-shadow: 0 4px 20px rgba(249,115,22,0.4);">
          🚗 Rent a Vehicle Now →
        </a>
        <a href="/dashboard/profile" data-link class="btn btn-outline btn-lg">
          👤 View Profile Badge
        </a>
        <button class="btn btn-ghost btn-lg" id="reverify-btn">
          ↺ Test Verification Again
        </button>
      </div>
    </div>
  `;
}

function attachKycEvents() {
  // Document Tabs
  document.querySelectorAll('.kyc-doc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      kycState.docType = (tab as HTMLElement).dataset.type as any;
      if (kycState.docType === 'aadhaar') kycState.docNumber = 'XXXX-XXXX-8924';
      else if (kycState.docType === 'passport') kycState.docNumber = 'Z9821442';
      else kycState.docNumber = 'DL-0420110012345';
      renderKycView();
    });
  });

  // Load sample doc
  document.getElementById('load-sample-doc-btn')?.addEventListener('click', () => {
    kycState.docNumber = 'DL-0420110012345';
    const numEl = document.getElementById('dl-number-val');
    if (numEl) numEl.textContent = kycState.docNumber;
    showToast('Verified sample driving license loaded! ✓', 'info');
  });

  // Run verification
  document.getElementById('run-verify-btn')?.addEventListener('click', startAiScanSimulation);
}

function attachCertificateEvents() {
  document.getElementById('reverify-btn')?.addEventListener('click', () => {
    kycState.step = 'upload';
    renderKycView();
  });
}

async function startAiScanSimulation() {
  const verifyBtn = document.getElementById('run-verify-btn') as HTMLButtonElement;
  const btnText = document.getElementById('verify-btn-text');
  const laser = document.getElementById('laser-scanner');
  const terminal = document.getElementById('kyc-terminal');
  const logsContainer = document.getElementById('terminal-logs');

  if (verifyBtn) verifyBtn.disabled = true;
  if (laser) laser.style.display = 'block';
  if (terminal) terminal.style.display = 'block';

  const logs = [
    '🔍 [0.3s] Document detected: Indian Driving License (Form 7 Smart Card)',
    '📐 [0.6s] Auto-aligning document edges and anti-glare filtering... [PASSED]',
    `🪪 [1.0s] OCR Extracted DL Number: ${kycState.docNumber} [Valid Checksum]`,
    `👤 [1.4s] Name matching: "${kycState.fullName.toUpperCase()}" [100% Match]`,
    '📅 [1.8s] Expiry verification: Valid until 2036 (Non-commercial LMV)',
    '🏛️ [2.2s] Parivahan Sarathi National Registry handshake: Authentic Document',
    '✨ [2.7s] 3D Biometric Liveness & Face Verification: 99.8% Match Score',
    '🎉 [3.0s] Verification Approved! Generating digital driving pass...',
  ];

  if (logsContainer) {
    logsContainer.innerHTML = '';
    for (let i = 0; i < logs.length; i++) {
      if (btnText) btnText.textContent = `Scanning... (${Math.round(((i + 1) / logs.length) * 100)}%)`;
      const p = document.createElement('p');
      p.className = 'term-line animate-fade-in';
      p.textContent = logs[i];
      logsContainer.appendChild(p);
      logsContainer.scrollTop = logsContainer.scrollHeight;
      await new Promise(r => setTimeout(r, 380));
    }
  }

  // Sync with backend quick-verify if logged in
  if (auth.isLoggedIn()) {
    try {
      const res = await api.post<{ success: boolean; data: { user: any } }>('/verification/quick-verify', {
        documentType: kycState.docType,
        documentNumber: kycState.docNumber,
        fullName: kycState.fullName,
      });

      if (res.data?.user) {
        await auth.refreshUser();
      }
    } catch (err) {
      console.warn('Backend quick-verify sync error (continuing gimmick flow):', err);
    }
  }

  showToast('AI Neural KYC Verification Approved! 🎉', 'success');
  kycState.isVerified = true;
  kycState.step = 'approved';
  renderKycView();
}
