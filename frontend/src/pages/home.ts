import { api } from '../api';
import { renderStars, formatPrice, generateVehicleGradient, getCategoryIcon, capitalize } from '../utils';

interface Vehicle {
  _id: string;
  brand: string;
  model: string;
  category: string;
  pricePerDay: number;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  images: string[];
  fuelType: string;
  transmission: string;
  seats: number;
  location: string;
}

export function renderHomePage(): string {
  return `
    <main class="page-enter">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-bg-effects">
          <div class="hero-orb hero-orb-1"></div>
          <div class="hero-orb hero-orb-2"></div>
          <div class="hero-orb hero-orb-3"></div>
          <div class="hero-grid-overlay"></div>
        </div>
        <div class="container hero-content">
          <div class="hero-badge animate-fade-in-down">
            <span class="badge badge-primary">🚀 India's Premium Car Rental</span>
          </div>
          <h1 class="hero-title animate-fade-in-up delay-1">
            Drive Your Dream<br/>
            <span class="hero-gradient-text">Car Today</span>
          </h1>
          <p class="hero-subtitle animate-fade-in-up delay-2">
            From city hatchbacks to luxury supercars — rent the perfect ride for every journey. 
            Verified owners, transparent pricing, zero hidden fees.
          </p>
          <div class="hero-cta animate-fade-in-up delay-3">
            <a href="/vehicles" data-link class="btn btn-accent btn-lg">
              Browse Vehicles
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="/register" data-link class="btn btn-outline btn-lg">
              Create Account
            </a>
          </div>
          <div class="hero-stats animate-fade-in-up delay-4">
            <div class="hero-stat">
              <span class="hero-stat-value">500+</span>
              <span class="hero-stat-label">Vehicles</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="hero-stat-value">12</span>
              <span class="hero-stat-label">Cities</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="hero-stat-value">10K+</span>
              <span class="hero-stat-label">Happy Riders</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="hero-stat-value">4.8</span>
              <span class="hero-stat-label">Avg Rating</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="categories-section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Categories</span>
            <h2 class="section-title">Find Your Perfect Ride</h2>
            <p class="section-subtitle">From budget-friendly hatchbacks to track-ready sports cars</p>
          </div>
          <div class="categories-grid" id="categories-grid">
            ${renderCategories()}
          </div>
        </div>
      </section>

      <!-- Featured Vehicles -->
      <section class="featured-section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Featured</span>
            <h2 class="section-title">Top Rated Vehicles</h2>
            <p class="section-subtitle">Our most popular rides chosen by thousands of happy customers</p>
          </div>
          <div class="vehicles-grid" id="featured-vehicles">
            <div class="page-loader">
              <div class="spinner spinner-lg"></div>
            </div>
          </div>
          <div class="section-cta">
            <a href="/vehicles" data-link class="btn btn-outline btn-lg">
              View All Vehicles
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="how-section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">How It Works</span>
            <h2 class="section-title">Rent in 3 Easy Steps</h2>
          </div>
          <div class="steps-grid">
            <div class="step-card">
              <div class="step-number">01</div>
              <div class="step-icon">🔍</div>
              <h3>Search & Select</h3>
              <p>Browse our curated fleet, filter by category, location, and budget to find your ideal vehicle.</p>
            </div>
            <div class="step-connector">
              <svg width="40" height="2"><line x1="0" y1="1" x2="40" y2="1" stroke="var(--primary-500)" stroke-width="2" stroke-dasharray="4 4"/></svg>
            </div>
            <div class="step-card">
              <div class="step-number">02</div>
              <div class="step-icon">📅</div>
              <h3>Book & Pay</h3>
              <p>Choose your dates, get an instant price quote, and securely book with transparent pricing.</p>
            </div>
            <div class="step-connector">
              <svg width="40" height="2"><line x1="0" y1="1" x2="40" y2="1" stroke="var(--primary-500)" stroke-width="2" stroke-dasharray="4 4"/></svg>
            </div>
            <div class="step-card">
              <div class="step-number">03</div>
              <div class="step-icon">🚗</div>
              <h3>Drive & Enjoy</h3>
              <p>Pick up your vehicle and hit the road. Our 24/7 support has you covered throughout your journey.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-card">
            <div class="cta-bg-effects">
              <div class="cta-orb cta-orb-1"></div>
              <div class="cta-orb cta-orb-2"></div>
            </div>
            <h2>Ready to Hit the Road?</h2>
            <p>Join thousands of happy riders. Your dream car is just a click away.</p>
            <div class="cta-actions">
              <a href="/vehicles" data-link class="btn btn-accent btn-lg">Browse Vehicles</a>
              <a href="/register" data-link class="btn btn-outline btn-lg" style="border-color:rgba(255,255,255,0.2);color:white;">Get Started Free</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderCategories(): string {
  const categories = [
    { id: 'hatchback', icon: '🚗', label: 'Hatchback', desc: 'City-friendly & fuel efficient' },
    { id: 'sedan', icon: '🚙', label: 'Sedan', desc: 'Comfort meets elegance' },
    { id: 'suv', icon: '🚘', label: 'SUV', desc: 'Power & adventure' },
    { id: 'luxury', icon: '✨', label: 'Luxury', desc: 'Premium experience' },
    { id: 'sports', icon: '🏁', label: 'Sports', desc: 'Pure performance' },
    { id: 'electric', icon: '⚡', label: 'Electric', desc: 'Go green, go fast' },
    { id: 'convertible', icon: '🏎️', label: 'Convertible', desc: 'Open-top thrills' },
    { id: 'coupe', icon: '🏎️', label: 'Coupe', desc: 'Muscle & aerodynamic style' },
    { id: 'muv', icon: '🚐', label: 'MUV', desc: 'Space for everyone' },
  ];

  return categories.map(cat => `
    <a href="/vehicles?category=${cat.id}" data-link class="category-card">
      <span class="category-icon">${cat.icon}</span>
      <span class="category-label">${cat.label}</span>
      <span class="category-desc">${cat.desc}</span>
    </a>
  `).join('');
}

export function renderVehicleCard(v: Vehicle): string {
  const gradient = generateVehicleGradient(v.brand, v.category);
  return `
    <a href="/vehicles/${v._id}" data-link class="vehicle-card card">
      <div class="vehicle-card-image" style="background:${gradient};">
        <span class="vehicle-card-category">${getCategoryIcon(v.category)} ${capitalize(v.category)}</span>
        <span class="vehicle-card-emoji">${getCategoryIcon(v.category)}</span>
      </div>
      <div class="vehicle-card-body">
        <div class="vehicle-card-header">
          <h3 class="vehicle-card-title">${v.brand} ${v.model}</h3>
          <div class="vehicle-card-rating">
            ${renderStars(v.rating, 12)}
            <span class="vehicle-card-rating-text">${v.rating} (${v.reviewCount})</span>
          </div>
        </div>
        <div class="vehicle-card-specs">
          <span class="vehicle-spec">⛽ ${capitalize(v.fuelType)}</span>
          <span class="vehicle-spec">⚙️ ${capitalize(v.transmission)}</span>
          <span class="vehicle-spec">💺 ${v.seats} seats</span>
          <span class="vehicle-spec">📍 ${v.location}</span>
        </div>
        <div class="vehicle-card-footer">
          <div class="vehicle-card-price">
            <span class="price-amount">${formatPrice(v.pricePerDay)}</span>
            <span class="price-unit">/day</span>
          </div>
          <span class="btn btn-primary btn-sm">View Details</span>
        </div>
      </div>
    </a>
  `;
}

export async function initHomePage() {
  try {
    const res = await api.get<{ success: boolean; data: Vehicle[] }>('/vehicles?sort=rating&limit=6');
    const grid = document.getElementById('featured-vehicles');
    if (grid && res.data) {
      grid.innerHTML = res.data.map(v => renderVehicleCard(v)).join('');
    }
  } catch {
    const grid = document.getElementById('featured-vehicles');
    if (grid) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state-icon">🔌</div>
          <h3 class="empty-state-title">Unable to load vehicles</h3>
          <p class="empty-state-text">Make sure the backend server is running on port 5000.</p>
        </div>
      `;
    }
  }
}
