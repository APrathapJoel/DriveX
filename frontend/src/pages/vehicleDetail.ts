import { api } from '../api';
import { auth } from '../auth';
import { router } from '../router';
import { showToast } from '../toast';
import { renderStars, formatPrice, generateVehicleGradient, getCategoryIcon, capitalize, formatDate } from '../utils';

interface Vehicle {
  _id: string;
  brand: string;
  model: string;
  category: string;
  registrationNumber: string;
  year: number;
  fuelType: string;
  transmission: string;
  seats: number;
  pricePerHour: number;
  pricePerDay: number;
  location: string;
  description: string;
  features: string[];
  images: string[];
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
}

interface Review {
  _id: string;
  user: { name: string; avatar?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

interface PricingEstimate {
  baseAmount: number;
  serviceFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  rentalDays: number;
  rentalHours: number;
}

export function renderVehicleDetailPage(): string {
  return `
    <main class="page-enter" style="padding-top: calc(var(--header-height) + var(--space-8));">
      <div class="container">
        <div id="vehicle-detail-content">
          <div class="page-loader">
            <div class="spinner spinner-lg"></div>
          </div>
        </div>
      </div>
    </main>
  `;
}

export async function initVehicleDetailPage(id: string) {
  const container = document.getElementById('vehicle-detail-content');
  if (!container) return;

  try {
    const [vehicleRes, reviewsRes] = await Promise.all([
      api.get<{ success: boolean; data: Vehicle }>(`/vehicles/${id}`),
      api.get<{ success: boolean; data: Review[] }>(`/vehicles/${id}/reviews`),
    ]);

    const v = vehicleRes.data;
    const reviews = reviewsRes.data;
    const gradient = generateVehicleGradient(v.brand, v.category);

    container.innerHTML = `
      <a href="/vehicles" data-link class="back-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Vehicles
      </a>

      <div class="vehicle-detail-layout">
        <!-- Left Column: Images & Info -->
        <div class="vehicle-detail-main">
          <div class="vehicle-detail-image" style="background:${gradient};">
            <span class="vehicle-detail-emoji">${getCategoryIcon(v.category)}</span>
            <div class="vehicle-detail-image-overlay">
              <span class="badge badge-primary">${capitalize(v.category)}</span>
              ${v.isAvailable ? '<span class="badge badge-success">Available</span>' : '<span class="badge badge-error">Unavailable</span>'}
            </div>
          </div>

          <div class="vehicle-detail-info">
            <div class="vehicle-detail-title-row">
              <div>
                <h1 class="vehicle-detail-name">${v.brand} ${v.model}</h1>
                <p class="vehicle-detail-year">${v.year} · ${v.registrationNumber}</p>
              </div>
              <div class="vehicle-detail-rating">
                ${renderStars(v.rating, 16)}
                <span>${v.rating} (${v.reviewCount} reviews)</span>
              </div>
            </div>

            <p class="vehicle-detail-description">${v.description}</p>

            <div class="vehicle-detail-specs-grid">
              <div class="spec-item">
                <span class="spec-icon">⛽</span>
                <span class="spec-label">Fuel</span>
                <span class="spec-value">${capitalize(v.fuelType)}</span>
              </div>
              <div class="spec-item">
                <span class="spec-icon">⚙️</span>
                <span class="spec-label">Transmission</span>
                <span class="spec-value">${capitalize(v.transmission)}</span>
              </div>
              <div class="spec-item">
                <span class="spec-icon">💺</span>
                <span class="spec-label">Seats</span>
                <span class="spec-value">${v.seats}</span>
              </div>
              <div class="spec-item">
                <span class="spec-icon">📍</span>
                <span class="spec-label">Location</span>
                <span class="spec-value">${v.location}</span>
              </div>
            </div>

            ${v.features.length > 0 ? `
              <div class="vehicle-features">
                <h3>Features</h3>
                <div class="features-grid">
                  ${v.features.map(f => `<span class="feature-tag">✓ ${f}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Reviews Section -->
          <div class="vehicle-reviews" id="vehicle-reviews">
            <h3>Reviews (${reviews.length})</h3>
            ${reviews.length === 0 ? `
              <p class="no-reviews">No reviews yet. Be the first to review!</p>
            ` : reviews.map(r => `
              <div class="review-card">
                <div class="review-header">
                  <div class="review-avatar">${r.user.name.charAt(0)}</div>
                  <div>
                    <span class="review-name">${r.user.name}</span>
                    <span class="review-date">${formatDate(r.createdAt)}</span>
                  </div>
                  <div class="review-rating">${renderStars(r.rating, 12)}</div>
                </div>
                <p class="review-comment">${r.comment}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right Column: Booking Card -->
        <div class="vehicle-detail-sidebar">
          <div class="booking-card card">
            <div class="booking-card-price">
              <span class="booking-price-amount">${formatPrice(v.pricePerDay)}</span>
              <span class="booking-price-unit">/day</span>
            </div>
            <p class="booking-price-hourly">${formatPrice(v.pricePerHour)}/hour</p>

            <div class="booking-form">
              <div class="form-group">
                <label class="form-label">Pickup Date</label>
                <input type="datetime-local" class="form-input" id="booking-start" min="${getMinDate()}" value="${getDefaultStartDate()}"/>
              </div>
              <div class="form-group">
                <label class="form-label">Return Date</label>
                <input type="datetime-local" class="form-input" id="booking-end" min="${getDefaultStartDate()}" value="${getDefaultEndDate()}"/>
              </div>
              <div class="form-group">
                <label class="form-label">Pickup Location</label>
                <input type="text" class="form-input" id="booking-location" value="${v.location}" placeholder="Pickup location"/>
              </div>
            </div>

            <div class="booking-estimate" id="booking-estimate" style="display:none;">
              <div class="estimate-row">
                <span>Base amount</span>
                <span id="est-base">-</span>
              </div>
              <div class="estimate-row">
                <span>Service fee (5%)</span>
                <span id="est-fee">-</span>
              </div>
              <div class="estimate-row">
                <span>Tax (18% GST)</span>
                <span id="est-tax">-</span>
              </div>
              <div class="estimate-row estimate-total">
                <span>Total</span>
                <span id="est-total">-</span>
              </div>
              <div class="estimate-duration" id="est-duration"></div>
            </div>

            <button class="btn btn-accent btn-lg" id="estimate-btn" style="width:100%;" data-vehicle-id="${v._id}">
              Get Price Estimate
            </button>
            <button class="btn btn-primary btn-lg" id="book-btn" style="width:100%; display:none;" data-vehicle-id="${v._id}">
              Book Now
            </button>

            <p class="booking-note">Free cancellation up to 24h before pickup</p>
          </div>
        </div>
      </div>
    `;

    initBookingForm(v._id);
  } catch {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">😕</div>
        <h3 class="empty-state-title">Vehicle not found</h3>
        <p class="empty-state-text">The vehicle you're looking for doesn't exist or has been removed.</p>
        <a href="/vehicles" data-link class="btn btn-primary" style="margin-top:var(--space-4);">Browse Vehicles</a>
      </div>
    `;
  }
}

function getMinDate(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function getDefaultStartDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset());
  return tomorrow.toISOString().slice(0, 16);
}

function getDefaultEndDate(): string {
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);
  dayAfter.setHours(10, 0, 0, 0);
  dayAfter.setMinutes(dayAfter.getMinutes() - dayAfter.getTimezoneOffset());
  return dayAfter.toISOString().slice(0, 16);
}

function initBookingForm(vehicleId: string) {
  const startInput = document.getElementById('booking-start') as HTMLInputElement;
  const endInput = document.getElementById('booking-end') as HTMLInputElement;
  const estimateBtn = document.getElementById('estimate-btn')!;
  const bookBtn = document.getElementById('book-btn')!;
  const estimateSection = document.getElementById('booking-estimate')!;

  // Auto-set end date when start changes
  startInput?.addEventListener('change', () => {
    if (startInput.value) {
      const start = new Date(startInput.value);
      start.setDate(start.getDate() + 1);
      const offset = start.getTimezoneOffset();
      start.setMinutes(start.getMinutes() - offset);
      endInput.min = startInput.value;
      if (!endInput.value || new Date(endInput.value) <= new Date(startInput.value)) {
        endInput.value = start.toISOString().slice(0, 16);
      }
    }
  });

  estimateBtn.addEventListener('click', async () => {
    if (!startInput.value || !endInput.value) {
      showToast('Please select pickup and return dates', 'warning');
      return;
    }

    if (new Date(endInput.value) <= new Date(startInput.value)) {
      showToast('Return date must be after pickup date', 'warning');
      return;
    }

    estimateBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;"></div>';
    estimateBtn.setAttribute('disabled', 'true');

    try {
      const res = await api.post<{ success: boolean; data: { pricing: PricingEstimate } }>('/bookings/estimate', {
        vehicleId,
        startDate: new Date(startInput.value).toISOString(),
        endDate: new Date(endInput.value).toISOString(),
      });

      const p = res.data.pricing;
      document.getElementById('est-base')!.textContent = formatPrice(p.baseAmount);
      document.getElementById('est-fee')!.textContent = formatPrice(p.serviceFee);
      document.getElementById('est-tax')!.textContent = formatPrice(p.tax);
      document.getElementById('est-total')!.textContent = formatPrice(p.totalAmount);
      document.getElementById('est-duration')!.textContent =
        `${p.rentalDays > 0 ? p.rentalDays + ' day' + (p.rentalDays > 1 ? 's' : '') : ''}${p.rentalHours > 0 ? ' ' + p.rentalHours + ' hr' + (p.rentalHours > 1 ? 's' : '') : ''}`;

      estimateSection.style.display = 'block';
      estimateBtn.style.display = 'none';
      bookBtn.style.display = 'flex';
    } catch (err: any) {
      showToast(err.message || 'Failed to get estimate', 'error');
    } finally {
      estimateBtn.innerHTML = 'Get Price Estimate';
      estimateBtn.removeAttribute('disabled');
    }
  });

  bookBtn.addEventListener('click', async () => {
    if (!auth.isLoggedIn()) {
      showToast('Please log in to book a vehicle', 'warning');
      router.navigate('/login');
      return;
    }

    const locationInput = document.getElementById('booking-location') as HTMLInputElement;

    bookBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-top-color:white;"></div>';
    bookBtn.setAttribute('disabled', 'true');

    try {
      await api.post('/bookings', {
        vehicleId,
        startDate: new Date(startInput.value).toISOString(),
        endDate: new Date(endInput.value).toISOString(),
        pickupLocation: locationInput?.value || undefined,
      });

      showToast('Booking created successfully! 🎉', 'success');
      router.navigate('/dashboard/bookings');
    } catch (err: any) {
      showToast(err.message || 'Booking failed', 'error');
    } finally {
      bookBtn.innerHTML = 'Book Now';
      bookBtn.removeAttribute('disabled');
    }
  });
}
