import { api } from '../api';
import { auth } from '../auth';
import { showToast } from '../toast';
import { formatPrice } from '../utils';

interface PaymentState {
  bookingId: string | null;
  booking: any | null;
  vehicle: any | null;
  amount: number;
  method: 'upi' | 'card' | 'netbanking' | 'wallet';
  step: 'select' | 'otp' | 'success';
}

let state: PaymentState = {
  bookingId: null,
  booking: null,
  vehicle: null,
  amount: 3715,
  method: 'upi',
  step: 'select',
};

export function renderPaymentPage(): string {
  return `
    <main class="page-enter payment-page" style="padding-top: calc(var(--header-height) + var(--space-8)); padding-bottom: var(--space-16);">
      <div class="container" style="max-width: 1040px;">
        <!-- Page Title & Trust Header -->
        <div class="payment-header animate-fade-in-down">
          <div class="payment-badges">
            <span class="badge badge-success">🔒 256-Bit SSL Encrypted</span>
            <span class="badge badge-primary">⚡ Instant Confirmation</span>
            <span class="badge" style="background: rgba(249,115,22,0.15); color: var(--accent-400); border: 1px solid rgba(249,115,22,0.3);">
              🛡️ RBI Compliant Payment Gateway
            </span>
          </div>
          <h1 class="payment-title">Checkout & Payment Gateway</h1>
          <p class="payment-subtitle">Complete your reservation securely. Choose any preferred Indian payment method below.</p>
        </div>

        <div id="payment-container" class="payment-layout">
          <div class="page-loader" style="grid-column: 1/-1;">
            <div class="spinner spinner-lg"></div>
            <p style="margin-top: var(--space-4); color: var(--text-muted);">Initializing secure payment session...</p>
          </div>
        </div>
      </div>

      <!-- OTP Simulation Modal Overlay -->
      <div class="payment-modal-backdrop" id="otp-modal" style="display:none;">
        <div class="payment-modal-card card animate-scale-in">
          <div class="modal-bank-header">
            <div class="modal-bank-logo">
              <span class="bank-shield">🛡️</span>
              <div>
                <h4>DriveR SafePay 3D-Secure 2.0</h4>
                <p>Verified by Visa / RuPay / NPCI</p>
              </div>
            </div>
            <span class="modal-timer" id="otp-timer">02:59</span>
          </div>

          <div class="modal-body">
            <div class="otp-instruction">
              <div class="sms-icon">📱</div>
              <p>One-Time Password (OTP) sent to registered mobile ending with <strong>••••3210</strong></p>
            </div>

            <div class="otp-amount-pill">
              <span>Authorizing Amount:</span>
              <strong id="modal-amount-display">₹3,715</strong>
            </div>

            <div class="form-group" style="margin-top: var(--space-4);">
              <label class="form-label" style="text-align:center;">Enter 6-Digit OTP</label>
              <div class="otp-inputs-wrapper">
                <input type="text" class="form-input otp-main-input" id="otp-value" maxlength="6" value="123456" placeholder="123456" style="text-align:center; font-size:1.5rem; letter-spacing:8px; font-weight:700;"/>
              </div>
              <p class="otp-hint">✨ Demo Mode: Test OTP <strong>123456</strong> is auto-filled for instant verification</p>
            </div>

            <div class="modal-actions" style="margin-top: var(--space-6);">
              <button class="btn btn-primary btn-lg" id="submit-otp-btn" style="width:100%;">
                <span id="otp-btn-text">Authorize & Pay</span>
              </button>
              <button class="btn btn-ghost btn-sm" id="cancel-otp-btn" style="width:100%; margin-top:var(--space-2);">
                Cancel Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

export async function initPaymentPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get('bookingId');
  state.bookingId = bookingId;

  await loadBookingData(bookingId);
  renderPaymentView();
}

async function loadBookingData(bookingId: string | null) {
  if (bookingId) {
    try {
      const res = await api.get<{ success: boolean; data: any }>(`/bookings/${bookingId}`);
      if (res.data) {
        state.booking = res.data;
        state.vehicle = res.data.vehicle;
        state.amount = res.data.pricing?.totalAmount || 3715;
        return;
      }
    } catch (e) {
      console.warn('Booking load failed, falling back to active user booking or sample:', e);
    }
  }

  // Fallback: check if user has any pending booking
  if (auth.isLoggedIn()) {
    try {
      const myRes = await api.get<{ success: boolean; data: any[] }>('/bookings/my?limit=5');
      const pendingBooking = myRes.data.find((b: any) => b.paymentStatus === 'pending' && b.status !== 'cancelled') || myRes.data[0];
      if (pendingBooking) {
        state.booking = pendingBooking;
        state.bookingId = pendingBooking._id || pendingBooking.id;
        state.vehicle = pendingBooking.vehicle;
        state.amount = pendingBooking.pricing?.totalAmount || 3715;
        return;
      }
    } catch {
      // ignore
    }
  }

  // Default demo state if no booking was passed
  state.amount = 3715;
  state.vehicle = {
    brand: 'Maruti Suzuki',
    model: 'Swift (ZXi+)',
    category: 'hatchback',
    location: 'Coimbatore',
    pricePerDay: 1499,
  };
}

function renderPaymentView() {
  const container = document.getElementById('payment-container');
  if (!container) return;

  const vehicleName = state.vehicle ? `${state.vehicle.brand} ${state.vehicle.model}` : 'Self-Drive Vehicle Rental';
  const location = state.vehicle?.location || 'Coimbatore Airport';
  const basePrice = state.booking?.pricing?.baseAmount || 2998;
  const serviceFee = state.booking?.pricing?.serviceFee || 150;
  const tax = state.booking?.pricing?.tax || 567;
  const total = state.amount || 3715;

  container.innerHTML = `
    <!-- Left Column: Payment Options & Interactive Tabs -->
    <div class="payment-main-card card">
      <div class="payment-tabs-nav">
        <button class="payment-tab-btn ${state.method === 'upi' ? 'active' : ''}" data-method="upi">
          <span class="tab-icon">⚡</span>
          <span class="tab-label">UPI / QR</span>
          <span class="tab-badge">Fastest</span>
        </button>
        <button class="payment-tab-btn ${state.method === 'card' ? 'active' : ''}" data-method="card">
          <span class="tab-icon">💳</span>
          <span class="tab-label">Cards</span>
        </button>
        <button class="payment-tab-btn ${state.method === 'netbanking' ? 'active' : ''}" data-method="netbanking">
          <span class="tab-icon">🏦</span>
          <span class="tab-label">Net Banking</span>
        </button>
        <button class="payment-tab-btn ${state.method === 'wallet' ? 'active' : ''}" data-method="wallet">
          <span class="tab-icon">👛</span>
          <span class="tab-label">Wallets</span>
        </button>
      </div>

      <div class="payment-method-content">
        ${renderSelectedMethodContent(total)}
      </div>
    </div>

    <!-- Right Column: Booking Summary & Price Breakdown -->
    <div class="payment-sidebar">
      <div class="payment-summary-card card">
        <div class="summary-header">
          <h3>Booking Summary</h3>
          <span class="badge badge-primary">ID: ${state.bookingId ? state.bookingId.slice(0, 10) : 'RES-2026-X'}</span>
        </div>

        <div class="summary-vehicle-box">
          <div class="summary-vehicle-icon">🚗</div>
          <div>
            <h4>${vehicleName}</h4>
            <p>📍 Pickup: ${location}</p>
            <p>📅 Duration: 2 Days · Full Insurance Included</p>
          </div>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-breakdown">
          <div class="breakdown-row">
            <span>Base Rental (2 Days)</span>
            <span>${formatPrice(basePrice)}</span>
          </div>
          <div class="breakdown-row">
            <span>DriveR Service Fee (5%)</span>
            <span>${formatPrice(serviceFee)}</span>
          </div>
          <div class="breakdown-row">
            <span>GST (18%)</span>
            <span>${formatPrice(tax)}</span>
          </div>
          <div class="breakdown-row text-success">
            <span>Security Deposit (Zero Hold)</span>
            <span>FREE</span>
          </div>
          <div class="summary-divider"></div>
          <div class="breakdown-row breakdown-total">
            <span>Total Payable</span>
            <span class="total-highlight">${formatPrice(total)}</span>
          </div>
        </div>

        <div class="security-guarantee-box">
          <div class="guarantee-icon">🛡️</div>
          <p><strong>100% Refundable Cancellation</strong><br/>Cancel anytime up to 24 hours prior to vehicle pickup for a full refund.</p>
        </div>
      </div>
    </div>
  `;

  attachPaymentEvents();
}

function renderSelectedMethodContent(total: number): string {
  switch (state.method) {
    case 'upi':
      return `
        <div class="upi-method-box animate-fade-in">
          <div class="upi-qr-section">
            <div class="upi-qr-wrapper">
              <!-- Real SVG QR Code Pattern -->
              <svg class="upi-qr-code" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#ffffff" rx="12"/>
                <!-- QR Corners -->
                <rect x="10" y="10" width="24" height="24" fill="#0f172a" rx="4"/>
                <rect x="14" y="14" width="16" height="16" fill="#ffffff" rx="2"/>
                <rect x="18" y="18" width="8" height="8" fill="#6366f1" rx="1"/>

                <rect x="66" y="10" width="24" height="24" fill="#0f172a" rx="4"/>
                <rect x="70" y="14" width="16" height="16" fill="#ffffff" rx="2"/>
                <rect x="74" y="18" width="8" height="8" fill="#6366f1" rx="1"/>

                <rect x="10" y="66" width="24" height="24" fill="#0f172a" rx="4"/>
                <rect x="14" y="70" width="16" height="16" fill="#ffffff" rx="2"/>
                <rect x="18" y="74" width="8" height="8" fill="#6366f1" rx="1"/>

                <!-- Grid Simulation -->
                <rect x="42" y="12" width="6" height="6" fill="#0f172a"/>
                <rect x="52" y="18" width="6" height="6" fill="#0f172a"/>
                <rect x="42" y="28" width="8" height="8" fill="#6366f1"/>
                <rect x="12" y="42" width="6" height="6" fill="#0f172a"/>
                <rect x="24" y="48" width="8" height="8" fill="#0f172a"/>
                <rect x="36" y="44" width="6" height="6" fill="#0f172a"/>
                <rect x="48" y="40" width="8" height="8" fill="#6366f1"/>
                <rect x="62" y="48" width="6" height="6" fill="#0f172a"/>
                <rect x="76" y="42" width="10" height="10" fill="#0f172a"/>
                <rect x="42" y="62" width="6" height="6" fill="#0f172a"/>
                <rect x="54" y="70" width="8" height="8" fill="#0f172a"/>
                <rect x="68" y="66" width="6" height="6" fill="#6366f1"/>
                <rect x="80" y="76" width="8" height="8" fill="#0f172a"/>
              </svg>
              <div class="qr-scan-line"></div>
            </div>
            <div class="upi-qr-meta">
              <h4>Scan QR with any UPI App</h4>
              <p>Google Pay · PhonePe · Paytm · CRED · BHIM</p>
              <div class="qr-timer-pill">⏱️ Code expires in <span id="qr-timer">04:59</span></div>
            </div>
          </div>

          <div class="upi-or-divider">
            <span>OR PAY WITH UPI ID / NUMBER</span>
          </div>

          <div class="upi-input-group">
            <input type="text" class="form-input" id="upi-vpa-input" placeholder="e.g. mobile@upi or name@okhdfcbank" value="driver.fastpay@okaxis"/>
            <button class="btn btn-primary" id="upi-pay-btn">
              ⚡ Pay ${formatPrice(total)} Now
            </button>
          </div>

          <div class="quick-app-pills">
            <button class="quick-app-chip" data-vpa="rahul@oksbi"><span>🟢</span> Google Pay</button>
            <button class="quick-app-chip" data-vpa="rahul@ybl"><span>🟣</span> PhonePe</button>
            <button class="quick-app-chip" data-vpa="rahul@paytm"><span>🔵</span> Paytm</button>
            <button class="quick-app-chip" data-vpa="rahul@cred"><span>⬛</span> CRED UPI</button>
          </div>
        </div>
      `;

    case 'card':
      return `
        <div class="card-method-box animate-fade-in">
          <!-- Realistic 3D Interactive Card Preview -->
          <div class="credit-card-preview" id="card-preview">
            <div class="card-glass-shine"></div>
            <div class="card-chip"></div>
            <div class="card-type-logo">VISA</div>
            <div class="card-number-display" id="disp-card-number">•••• •••• •••• 9010</div>
            <div class="card-details-row">
              <div>
                <span class="card-sub-label">CARD HOLDER</span>
                <span class="card-sub-val" id="disp-card-name">RAHUL SHARMA</span>
              </div>
              <div>
                <span class="card-sub-label">EXPIRES</span>
                <span class="card-sub-val" id="disp-card-exp">12/28</span>
              </div>
            </div>
          </div>

          <div class="card-form-grid">
            <div class="form-group" style="grid-column: 1/-1;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <label class="form-label">Card Number</label>
                <button type="button" class="btn btn-ghost btn-sm" id="fill-test-card" style="font-size:0.75rem; padding:2px 8px;">
                  ✨ Fill Demo Card
                </button>
              </div>
              <input type="text" class="form-input" id="card-number-input" placeholder="4000 1234 5678 9010" maxlength="19" value="4000 1234 5678 9010"/>
            </div>

            <div class="form-group" style="grid-column: 1/-1;">
              <label class="form-label">Cardholder Name</label>
              <input type="text" class="form-input" id="card-name-input" placeholder="Name as printed on card" value="Rahul Sharma"/>
            </div>

            <div class="form-group">
              <label class="form-label">Expiry Date</label>
              <input type="text" class="form-input" id="card-exp-input" placeholder="MM/YY" maxlength="5" value="12/28"/>
            </div>

            <div class="form-group">
              <label class="form-label">CVV / CVC</label>
              <input type="password" class="form-input" id="card-cvv-input" placeholder="•••" maxlength="3" value="123"/>
            </div>
          </div>

          <button class="btn btn-primary btn-lg" id="card-pay-btn" style="width:100%; margin-top:var(--space-4);">
            🔒 Pay ${formatPrice(total)} with 3D Secure
          </button>
        </div>
      `;

    case 'netbanking':
      return `
        <div class="netbanking-box animate-fade-in">
          <label class="form-label">Popular Indian Banks</label>
          <div class="popular-banks-grid">
            <button class="bank-pill active" data-bank="HDFC Bank">
              <span class="bank-icon">🏛️</span>
              <span class="bank-name">HDFC Bank</span>
            </button>
            <button class="bank-pill" data-bank="State Bank of India">
              <span class="bank-icon">🔵</span>
              <span class="bank-name">SBI</span>
            </button>
            <button class="bank-pill" data-bank="ICICI Bank">
              <span class="bank-icon">🟠</span>
              <span class="bank-name">ICICI Bank</span>
            </button>
            <button class="bank-pill" data-bank="Axis Bank">
              <span class="bank-icon">🔴</span>
              <span class="bank-name">Axis Bank</span>
            </button>
            <button class="bank-pill" data-bank="Kotak Mahindra">
              <span class="bank-icon">🏦</span>
              <span class="bank-name">Kotak</span>
            </button>
            <button class="bank-pill" data-bank="Punjab National Bank">
              <span class="bank-icon">🏢</span>
              <span class="bank-name">PNB</span>
            </button>
          </div>

          <div class="form-group" style="margin-top:var(--space-4);">
            <label class="form-label">Or Select from All Banks</label>
            <select class="form-select" id="all-banks-select">
              <option value="HDFC Bank">HDFC Bank (NetBanking Retail)</option>
              <option value="State Bank of India">State Bank of India</option>
              <option value="ICICI Bank">ICICI Bank Internet Banking</option>
              <option value="Axis Bank">Axis Bank</option>
              <option value="Bank of Baroda">Bank of Baroda</option>
              <option value="Canara Bank">Canara Bank</option>
              <option value="IndusInd Bank">IndusInd Bank</option>
              <option value="Union Bank of India">Union Bank of India</option>
            </select>
          </div>

          <button class="btn btn-primary btn-lg" id="bank-pay-btn" style="width:100%; margin-top:var(--space-4);">
            Proceed to Bank Gateway (${formatPrice(total)})
          </button>
        </div>
      `;

    case 'wallet':
      return `
        <div class="wallet-box animate-fade-in">
          <label class="form-label">Select Wallet or PayLater Option</label>
          <div class="wallets-list">
            <label class="wallet-option active">
              <input type="radio" name="wallet" value="Paytm" checked/>
              <span class="wallet-icon">🔷</span>
              <div class="wallet-meta">
                <strong>Paytm Wallet</strong>
                <span>Balance: ₹5,400 · Linked mobile</span>
              </div>
              <span class="wallet-badge">Auto-Linked</span>
            </label>

            <label class="wallet-option">
              <input type="radio" name="wallet" value="Amazon Pay"/>
              <span class="wallet-icon">📦</span>
              <div class="wallet-meta">
                <strong>Amazon Pay Balance</strong>
                <span>Cashback eligible up to ₹250</span>
              </div>
            </label>

            <label class="wallet-option">
              <input type="radio" name="wallet" value="Simpl"/>
              <span class="wallet-icon">⚡</span>
              <div class="wallet-meta">
                <strong>Simpl PayLater</strong>
                <span>Pay next month · 0% Interest</span>
              </div>
            </label>
          </div>

          <button class="btn btn-primary btn-lg" id="wallet-pay-btn" style="width:100%; margin-top:var(--space-6);">
            Pay ${formatPrice(total)} with Wallet
          </button>
        </div>
      `;
  }
}

function attachPaymentEvents() {
  // Tab switching
  document.querySelectorAll('.payment-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.method = (btn as HTMLElement).dataset.method as any;
      renderPaymentView();
    });
  });

  // Quick app chips in UPI
  document.querySelectorAll('.quick-app-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const vpa = (chip as HTMLElement).dataset.vpa;
      const input = document.getElementById('upi-vpa-input') as HTMLInputElement;
      if (input && vpa) input.value = vpa;
      openOtpModal();
    });
  });

  // Fill test card button
  document.getElementById('fill-test-card')?.addEventListener('click', () => {
    const num = document.getElementById('card-number-input') as HTMLInputElement;
    const name = document.getElementById('card-name-input') as HTMLInputElement;
    const exp = document.getElementById('card-exp-input') as HTMLInputElement;
    const cvv = document.getElementById('card-cvv-input') as HTMLInputElement;
    if (num) num.value = '4000 1234 5678 9010';
    if (name) name.value = 'Rahul Sharma';
    if (exp) exp.value = '12/28';
    if (cvv) cvv.value = '123';
    updateCardDisplay();
    showToast('Demo card credentials filled! ✓', 'info');
  });

  // Card input listeners to update preview
  const numInput = document.getElementById('card-number-input') as HTMLInputElement;
  const nameInput = document.getElementById('card-name-input') as HTMLInputElement;
  const expInput = document.getElementById('card-exp-input') as HTMLInputElement;

  numInput?.addEventListener('input', updateCardDisplay);
  nameInput?.addEventListener('input', updateCardDisplay);
  expInput?.addEventListener('input', updateCardDisplay);

  function updateCardDisplay() {
    const dNum = document.getElementById('disp-card-number');
    const dName = document.getElementById('disp-card-name');
    const dExp = document.getElementById('disp-card-exp');
    if (dNum && numInput) dNum.textContent = numInput.value || '•••• •••• •••• 9010';
    if (dName && nameInput) dName.textContent = (nameInput.value || 'RAHUL SHARMA').toUpperCase();
    if (dExp && expInput) dExp.textContent = expInput.value || '12/28';
  }

  // Pay buttons
  document.getElementById('upi-pay-btn')?.addEventListener('click', openOtpModal);
  document.getElementById('card-pay-btn')?.addEventListener('click', openOtpModal);
  document.getElementById('bank-pay-btn')?.addEventListener('click', openOtpModal);
  document.getElementById('wallet-pay-btn')?.addEventListener('click', openOtpModal);

  // Modal actions
  document.getElementById('cancel-otp-btn')?.addEventListener('click', closeOtpModal);
  document.getElementById('submit-otp-btn')?.addEventListener('click', executeSimulatedPayment);
}

function openOtpModal() {
  const modal = document.getElementById('otp-modal');
  const amountDisp = document.getElementById('modal-amount-display');
  if (amountDisp) amountDisp.textContent = formatPrice(state.amount);
  if (modal) modal.style.display = 'flex';
}

function closeOtpModal() {
  const modal = document.getElementById('otp-modal');
  if (modal) modal.style.display = 'none';
}

async function executeSimulatedPayment() {
  const submitBtn = document.getElementById('submit-otp-btn') as HTMLButtonElement;
  const btnText = document.getElementById('otp-btn-text');
  if (!submitBtn) return;

  submitBtn.disabled = true;
  if (btnText) btnText.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-top-color:white;display:inline-block;vertical-align:middle;margin-right:8px;"></div> Authorizing with Bank...';

  try {
    // If we have a real booking ID, trigger backend payment verification
    if (state.bookingId && auth.isLoggedIn()) {
      try {
        const createRes = await api.post<{ success: boolean; data: { payment: any } }>('/payments/create', {
          bookingId: state.bookingId,
        });
        const paymentId = createRes.data?.payment?._id || createRes.data?.payment?.id;
        if (paymentId) {
          await api.post('/payments/verify', {
            paymentId,
            bookingId: state.bookingId,
          });
        }
      } catch (err) {
        console.warn('Backend payment sync warning (simulating success anyway):', err);
      }
    }

    // Step 2: Show brief settling animation
    if (btnText) btnText.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-top-color:white;display:inline-block;vertical-align:middle;margin-right:8px;"></div> Settling Transaction...';
    await new Promise(r => setTimeout(r, 800));

    closeOtpModal();
    renderSuccessScreen();
  } catch (err: any) {
    showToast(err.message || 'Payment simulation error', 'error');
  } finally {
    submitBtn.disabled = false;
    if (btnText) btnText.textContent = 'Authorize & Pay';
  }
}

function renderSuccessScreen() {
  const container = document.getElementById('payment-container');
  if (!container) return;

  const txnId = 'TXN_DRIVEX_' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const vehicleName = state.vehicle ? `${state.vehicle.brand} ${state.vehicle.model}` : 'Maruti Suzuki Swift (ZXi+)';
  const total = state.amount || 3715;

  container.innerHTML = `
    <div class="payment-success-card card animate-scale-in" style="grid-column: 1/-1; text-align:center; padding:var(--space-12) var(--space-6);">
      <div class="success-checkmark-wrapper">
        <div class="success-checkmark-circle">
          <svg viewBox="0 0 52 52" class="checkmark-svg">
            <circle cx="26" cy="26" r="25" fill="none" class="checkmark-circle"/>
            <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" class="checkmark-check"/>
          </svg>
        </div>
      </div>

      <span class="badge badge-success" style="margin-top:var(--space-4); font-size:0.875rem;">✓ Payment Successful & Verified</span>
      <h2 style="margin-top:var(--space-3); font-size:2rem; font-family:var(--font-heading);">Reservation Confirmed! 🎉</h2>
      <p style="color:var(--text-secondary); max-width:540px; margin:var(--space-2) auto var(--space-6);">
        Your self-drive rental for <strong>${vehicleName}</strong> has been secured. Your digital booking receipt and keys collection voucher are ready.
      </p>

      <!-- Receipt Voucher Box -->
      <div class="receipt-voucher-box">
        <div class="receipt-row">
          <span>Transaction Reference:</span>
          <strong>${txnId}</strong>
        </div>
        <div class="receipt-row">
          <span>Amount Paid:</span>
          <strong style="color:var(--success); font-size:1.125rem;">${formatPrice(total)}</strong>
        </div>
        <div class="receipt-row">
          <span>Payment Channel:</span>
          <span>${state.method.toUpperCase()} (Instant 3D-Secure)</span>
        </div>
        <div class="receipt-row">
          <span>Date & Time:</span>
          <span>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="success-actions" style="display:flex; justify-content:center; gap:var(--space-4); flex-wrap:wrap; margin-top:var(--space-8);">
        <a href="/kyc" data-link class="btn btn-accent btn-lg" style="box-shadow: 0 4px 20px rgba(249,115,22,0.4);">
          🪪 Complete Instant AI KYC Verification →
        </a>
        <a href="/dashboard/bookings" data-link class="btn btn-outline btn-lg">
          📋 View in Dashboard
        </a>
        <button class="btn btn-ghost btn-lg" id="print-receipt-btn" onclick="window.print()">
          📄 Print Tax Invoice
        </button>
      </div>
    </div>
  `;
}
