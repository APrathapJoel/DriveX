import { api } from '../api';
import { renderStars, formatPrice, generateVehicleGradient, getCategoryIcon, capitalize } from '../utils';

export interface Vehicle {
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
  description?: string;
  features?: string[];
  isAvailable?: boolean;
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
            <span class="badge badge-primary">🚀 India's #1 Premium Car Rental</span>
          </div>
          <h1 class="hero-title animate-fade-in-up delay-1">
            Drive Your Dream<br/>
            <span class="hero-gradient-text">Car Today</span>
          </h1>
          <p class="hero-subtitle animate-fade-in-up delay-2">
            From city hatchbacks to luxury supercars — explore our entire fleet below. 
            Choose any filter to segregate vehicles instantly. Verified cars, transparent pricing, zero hidden fees.
          </p>
          <div class="hero-cta animate-fade-in-up delay-3">
            <a href="#fleet-section" class="btn btn-accent btn-lg" id="hero-explore-btn">
              Explore All Vehicles
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
            </a>
            <a href="/register" data-link class="btn btn-outline btn-lg">
              Create Free Account
            </a>
          </div>
          <div class="hero-stats animate-fade-in-up delay-4">
            <div class="hero-stat">
              <span class="hero-stat-value" id="hero-stat-cars">20+</span>
              <span class="hero-stat-label">Available Cars</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="hero-stat-value">9</span>
              <span class="hero-stat-label">Categories</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="hero-stat-value">12+</span>
              <span class="hero-stat-label">Major Cities</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="hero-stat-value">4.8★</span>
              <span class="hero-stat-label">Average Rating</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Category Quick Picks Section -->
      <section class="categories-section" id="categories-section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Quick Segregation</span>
            <h2 class="section-title">Select a Category</h2>
            <p class="section-subtitle">Click any vehicle type to segregate the full fleet instantly</p>
          </div>
          <div class="categories-grid" id="home-categories-grid">
            ${renderQuickCategoryCards()}
          </div>
        </div>
      </section>

      <!-- All Vehicles Fleet Explorer (with instant segregation) -->
      <section class="fleet-section" id="fleet-section">
        <div class="container">
          <div class="section-header" style="text-align: left; margin-bottom: var(--space-8);">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: var(--space-4);">
              <div>
                <span class="section-tag">🚗 Complete Fleet</span>
                <h2 class="section-title" style="margin-bottom: var(--space-2);">All Available Vehicles</h2>
                <p class="section-subtitle" style="margin: 0;">Browse our complete lineup. Select a filter to segregate vehicles in real-time.</p>
              </div>
              <div class="fleet-counter-badge" id="fleet-total-counter">
                Loading fleet...
              </div>
            </div>
          </div>

          <!-- Interactive Filter Controls Card -->
          <div class="fleet-controls-card card">
            <!-- 1. Category Filter Pills -->
            <div class="fleet-control-group">
              <label class="fleet-control-label">Filter by Category:</label>
              <div class="fleet-category-pills" id="fleet-category-pills">
                <button class="category-pill active" data-category="all">
                  <span class="category-pill-icon">🌟</span>
                  <span class="category-pill-name">All Vehicles</span>
                  <span class="category-pill-count" id="count-all">...</span>
                </button>
                <button class="category-pill" data-category="suv">
                  <span class="category-pill-icon">🚘</span>
                  <span class="category-pill-name">SUV</span>
                  <span class="category-pill-count" id="count-suv"></span>
                </button>
                <button class="category-pill" data-category="sedan">
                  <span class="category-pill-icon">🚙</span>
                  <span class="category-pill-name">Sedan</span>
                  <span class="category-pill-count" id="count-sedan"></span>
                </button>
                <button class="category-pill" data-category="hatchback">
                  <span class="category-pill-icon">🚗</span>
                  <span class="category-pill-name">Hatchback</span>
                  <span class="category-pill-count" id="count-hatchback"></span>
                </button>
                <button class="category-pill" data-category="luxury">
                  <span class="category-pill-icon">✨</span>
                  <span class="category-pill-name">Luxury</span>
                  <span class="category-pill-count" id="count-luxury"></span>
                </button>
                <button class="category-pill" data-category="sports">
                  <span class="category-pill-icon">🏁</span>
                  <span class="category-pill-name">Sports</span>
                  <span class="category-pill-count" id="count-sports"></span>
                </button>
                <button class="category-pill" data-category="electric">
                  <span class="category-pill-icon">⚡</span>
                  <span class="category-pill-name">Electric</span>
                  <span class="category-pill-count" id="count-electric"></span>
                </button>
                <button class="category-pill" data-category="convertible">
                  <span class="category-pill-icon">🏎️</span>
                  <span class="category-pill-name">Convertible</span>
                  <span class="category-pill-count" id="count-convertible"></span>
                </button>
                <button class="category-pill" data-category="muv">
                  <span class="category-pill-icon">🚐</span>
                  <span class="category-pill-name">MUV</span>
                  <span class="category-pill-count" id="count-muv"></span>
                </button>
              </div>
            </div>

            <!-- 2. Search & Fine-grain Filters Row -->
            <div class="fleet-secondary-filters">
              <!-- Live Search -->
              <div class="fleet-search-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="fleet-search-icon"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input type="text" id="home-search-input" class="form-input fleet-search-input" placeholder="Search vehicle name, model, city, features..."/>
                <button id="home-search-clear" class="fleet-search-clear" style="display:none;" title="Clear search">✕</button>
              </div>

              <!-- Quick Transmission Filters -->
              <div class="fleet-chip-group" id="fleet-transmission-pills">
                <span class="fleet-sublabel">Gearbox:</span>
                <button class="filter-chip active" data-transmission="all">All</button>
                <button class="filter-chip" data-transmission="automatic">Automatic</button>
                <button class="filter-chip" data-transmission="manual">Manual</button>
              </div>

              <!-- Quick Fuel Filters -->
              <div class="fleet-chip-group" id="fleet-fuel-pills">
                <span class="fleet-sublabel">Fuel:</span>
                <button class="filter-chip active" data-fuel="all">All</button>
                <button class="filter-chip" data-fuel="petrol">Petrol</button>
                <button class="filter-chip" data-fuel="diesel">Diesel</button>
                <button class="filter-chip" data-fuel="electric">Electric</button>
              </div>

              <!-- Sorting -->
              <div class="fleet-sort-box">
                <label for="home-sort-select" class="fleet-sublabel">Sort:</label>
                <select id="home-sort-select" class="form-select fleet-sort-select">
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            <!-- 3. Active Segregation Filter Bar -->
            <div class="fleet-status-bar" id="fleet-status-bar">
              <div class="fleet-status-info">
                <span id="fleet-status-text">Showing all vehicles</span>
              </div>
              <div class="fleet-active-tags" id="fleet-active-tags"></div>
              <button class="btn btn-ghost btn-sm" id="fleet-reset-btn" style="display: none;">
                ↺ Reset All Filters
              </button>
            </div>
          </div>

          <!-- Vehicles Grid Container -->
          <div class="vehicles-grid" id="all-vehicles-grid">
            <div class="page-loader" style="grid-column: 1/-1;">
              <div class="spinner spinner-lg"></div>
              <p style="margin-top: var(--space-4); color: var(--text-muted);">Loading complete vehicle fleet...</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Choose Us / User Friendly Benefits -->
      <section class="features-section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Why DriveR</span>
            <h2 class="section-title">Built for Seamless Journeys</h2>
            <p class="section-subtitle">Experience car rental designed around you</p>
          </div>
          <div class="features-grid">
            <div class="feature-card card">
              <div class="feature-icon">⚡</div>
              <h3>Instant Booking & Segregation</h3>
              <p>Explore our entire fleet with live segregation filters. Find exact match cars by category, transmission, or fuel in seconds.</p>
            </div>
            <div class="feature-card card">
              <div class="feature-icon">🛡️</div>
              <h3>100% Verified Fleet</h3>
              <p>Every car undergoes comprehensive mechanical inspections and deep interior sanitization before handover.</p>
            </div>
            <div class="feature-card card">
              <div class="feature-icon">💰</div>
              <h3>Zero Hidden Charges</h3>
              <p>Transparent daily and hourly rates with fuel & insurance options clearly detailed upfront. No security deposit surprises.</p>
            </div>
            <div class="feature-card card">
              <div class="feature-icon">📍</div>
              <h3>Doorstep Delivery & Pickup</h3>
              <p>Get your vehicle delivered directly to your doorstep, airport, or hotel across 12+ major cities in India.</p>
            </div>
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
              <h3>Search & Segregate</h3>
              <p>Browse our complete fleet right on this page. Pick any category or fuel filter to narrow down your dream car.</p>
            </div>
            <div class="step-connector">
              <svg width="40" height="2"><line x1="0" y1="1" x2="40" y2="1" stroke="var(--primary-500)" stroke-width="2" stroke-dasharray="4 4"/></svg>
            </div>
            <div class="step-card">
              <div class="step-number">02</div>
              <div class="step-icon">📅</div>
              <h3>Book & Confirm</h3>
              <p>Choose your rental dates, upload your driver's license for instant verification, and pay securely.</p>
            </div>
            <div class="step-connector">
              <svg width="40" height="2"><line x1="0" y1="1" x2="40" y2="1" stroke="var(--primary-500)" stroke-width="2" stroke-dasharray="4 4"/></svg>
            </div>
            <div class="step-card">
              <div class="step-number">03</div>
              <div class="step-icon">🚗</div>
              <h3>Drive & Enjoy</h3>
              <p>Pick up your keys or get doorstep handover. Enjoy 24/7 roadside assistance on every single trip.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Banner -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-card">
            <div class="cta-bg-effects">
              <div class="cta-orb cta-orb-1"></div>
              <div class="cta-orb cta-orb-2"></div>
            </div>
            <h2>Ready to Hit the Road?</h2>
            <p>Join thousands of happy riders today. Your dream drive is just a click away.</p>
            <div class="cta-actions">
              <a href="#fleet-section" class="btn btn-accent btn-lg">Explore Fleet Now</a>
              <a href="/register" data-link class="btn btn-outline btn-lg" style="border-color:rgba(255,255,255,0.25);color:white;">Get Started Free</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

function renderQuickCategoryCards(): string {
  const categories = [
    { id: 'all', icon: '🌟', label: 'All Fleet', desc: 'Browse every vehicle' },
    { id: 'suv', icon: '🚘', label: 'SUV', desc: 'Power, space & highway dominance' },
    { id: 'sedan', icon: '🚙', label: 'Sedan', desc: 'Smooth cruising & executive comfort' },
    { id: 'hatchback', icon: '🚗', label: 'Hatchback', desc: 'Agile city commutes & high mileage' },
    { id: 'luxury', icon: '✨', label: 'Luxury', desc: 'Prestige, craftsmanship & elegance' },
    { id: 'sports', icon: '🏁', label: 'Sports', desc: 'Exhilarating horsepower & thrill' },
    { id: 'electric', icon: '⚡', label: 'Electric', desc: 'Instant torque & zero emissions' },
    { id: 'convertible', icon: '🏎️', label: 'Convertible', desc: 'Open-top coastal & hill drives' },
    { id: 'muv', icon: '🚐', label: 'MUV', desc: '7+ seater family & group road trips' },
  ];

  return categories.map(cat => `
    <button type="button" class="category-card home-category-trigger" data-target-category="${cat.id}">
      <span class="category-icon">${cat.icon}</span>
      <span class="category-label">${cat.label}</span>
      <span class="category-desc">${cat.desc}</span>
    </button>
  `).join('');
}

export function renderVehicleCard(v: Vehicle): string {
  const gradient = generateVehicleGradient(v.brand, v.category);
  const icon = getCategoryIcon(v.category);

  return `
    <div class="vehicle-card card">
      <a href="/vehicles/${v._id}" data-link class="vehicle-card-image-link" aria-label="${v.brand} ${v.model}">
        <div class="vehicle-card-image" style="background:${gradient};">
          <span class="vehicle-card-category">${icon} ${capitalize(v.category)}</span>
          <span class="vehicle-card-avail-badge">● Available</span>
          <span class="vehicle-card-emoji">${icon}</span>
        </div>
      </a>
      <div class="vehicle-card-body">
        <div class="vehicle-card-header">
          <div>
            <h3 class="vehicle-card-title">
              <a href="/vehicles/${v._id}" data-link class="vehicle-card-title-link">${v.brand} ${v.model}</a>
            </h3>
            <span class="vehicle-card-location">📍 ${v.location || 'India'}</span>
          </div>
          <div class="vehicle-card-rating">
            ${renderStars(v.rating, 12)}
            <span class="vehicle-card-rating-text">${v.rating ? v.rating.toFixed(1) : '4.5'} (${v.reviewCount || 12})</span>
          </div>
        </div>

        <div class="vehicle-card-specs">
          <span class="vehicle-spec" title="Fuel Type">⛽ ${capitalize(v.fuelType || 'Petrol')}</span>
          <span class="vehicle-spec" title="Transmission">⚙️ ${capitalize(v.transmission || 'Manual')}</span>
          <span class="vehicle-spec" title="Seating Capacity">💺 ${v.seats || 5} Seats</span>
        </div>

        ${v.features && v.features.length ? `
          <div class="vehicle-card-highlights">
            <span class="vehicle-highlight-pill">✓ ${v.features[0]}</span>
            ${v.features[1] ? `<span class="vehicle-highlight-pill">✓ ${v.features[1]}</span>` : ''}
          </div>
        ` : ''}

        <div class="vehicle-card-footer">
          <div class="vehicle-card-price">
            <div class="price-main">
              <span class="price-amount">${formatPrice(v.pricePerDay)}</span>
              <span class="price-unit">/day</span>
            </div>
            ${v.pricePerHour ? `<span class="price-hour-sub">${formatPrice(v.pricePerHour)}/hr</span>` : ''}
          </div>
          <div class="vehicle-card-actions">
            <a href="/vehicles/${v._id}" data-link class="btn btn-outline btn-sm">Details</a>
            <a href="/vehicles/${v._id}" data-link class="btn btn-primary btn-sm">Rent Now</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// State management for interactive segregation
let allVehicles: Vehicle[] = [];
let currentCategory = 'all';
let currentTransmission = 'all';
let currentFuel = 'all';
let currentSort = 'featured';
let searchQuery = '';

export async function initHomePage() {
  // Smooth scroll for hero explore button
  document.getElementById('hero-explore-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('fleet-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Setup Category Pills clicks
  const categoryPillsContainer = document.getElementById('fleet-category-pills');
  categoryPillsContainer?.addEventListener('click', (e) => {
    const pill = (e.target as HTMLElement).closest('.category-pill') as HTMLElement;
    if (!pill) return;
    const cat = pill.dataset.category || 'all';
    selectCategory(cat);
  });

  // Setup Quick Category Grid Cards (scroll & segregate)
  document.querySelectorAll('.home-category-trigger').forEach(card => {
    card.addEventListener('click', () => {
      const targetCat = (card as HTMLElement).dataset.targetCategory || 'all';
      selectCategory(targetCat);
      document.getElementById('fleet-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Transmission Pills
  const transmissionContainer = document.getElementById('fleet-transmission-pills');
  transmissionContainer?.addEventListener('click', (e) => {
    const chip = (e.target as HTMLElement).closest('.filter-chip') as HTMLElement;
    if (!chip) return;
    transmissionContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentTransmission = chip.dataset.transmission || 'all';
    segregateAndRender();
  });

  // Fuel Pills
  const fuelContainer = document.getElementById('fleet-fuel-pills');
  fuelContainer?.addEventListener('click', (e) => {
    const chip = (e.target as HTMLElement).closest('.filter-chip') as HTMLElement;
    if (!chip) return;
    fuelContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentFuel = chip.dataset.fuel || 'all';
    segregateAndRender();
  });

  // Search Input with instant debounce
  const searchInput = document.getElementById('home-search-input') as HTMLInputElement;
  const searchClear = document.getElementById('home-search-clear') as HTMLButtonElement;
  let searchTimer: any = null;

  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchQuery = searchInput.value.trim().toLowerCase();
      if (searchClear) {
        searchClear.style.display = searchQuery ? 'inline-block' : 'none';
      }
      segregateAndRender();
    }, 120);
  });

  searchClear?.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
      searchQuery = '';
      searchClear.style.display = 'none';
      segregateAndRender();
    }
  });

  // Sort Select
  const sortSelect = document.getElementById('home-sort-select') as HTMLSelectElement;
  sortSelect?.addEventListener('change', () => {
    currentSort = sortSelect.value;
    segregateAndRender();
  });

  // Reset Button
  document.getElementById('fleet-reset-btn')?.addEventListener('click', resetAllFilters);

  // Load all vehicles
  await fetchAllVehicles();
}

function selectCategory(cat: string) {
  currentCategory = cat.toLowerCase();
  const pills = document.querySelectorAll('#fleet-category-pills .category-pill');
  pills.forEach(p => {
    const pillCat = (p as HTMLElement).dataset.category || 'all';
    if (pillCat === currentCategory) {
      p.classList.add('active');
      p.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      p.classList.remove('active');
    }
  });
  segregateAndRender();
}

function resetAllFilters() {
  currentCategory = 'all';
  currentTransmission = 'all';
  currentFuel = 'all';
  currentSort = 'featured';
  searchQuery = '';

  const searchInput = document.getElementById('home-search-input') as HTMLInputElement;
  if (searchInput) searchInput.value = '';
  const searchClear = document.getElementById('home-search-clear') as HTMLButtonElement;
  if (searchClear) searchClear.style.display = 'none';

  const sortSelect = document.getElementById('home-sort-select') as HTMLSelectElement;
  if (sortSelect) sortSelect.value = 'featured';

  document.querySelectorAll('#fleet-category-pills .category-pill').forEach(p => {
    p.classList.toggle('active', (p as HTMLElement).dataset.category === 'all');
  });

  document.querySelectorAll('#fleet-transmission-pills .filter-chip').forEach(c => {
    c.classList.toggle('active', (c as HTMLElement).dataset.transmission === 'all');
  });

  document.querySelectorAll('#fleet-fuel-pills .filter-chip').forEach(c => {
    c.classList.toggle('active', (c as HTMLElement).dataset.fuel === 'all');
  });

  segregateAndRender();
}

async function fetchAllVehicles() {
  const grid = document.getElementById('all-vehicles-grid');
  try {
    const res = await api.get<{ success: boolean; data: Vehicle[] }>('/vehicles?limit=100');
    if (res.data) {
      allVehicles = res.data;
      updateCategoryCounts(allVehicles);
      segregateAndRender();
    }
  } catch (err) {
    if (grid) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state-icon">🔌</div>
          <h3 class="empty-state-title">Unable to connect to fleet catalog</h3>
          <p class="empty-state-text">Please refresh the page or check your network connection.</p>
          <button class="btn btn-primary" onclick="window.location.reload()" style="margin-top:var(--space-4);">Retry</button>
        </div>
      `;
    }
  }
}

function updateCategoryCounts(vehicles: Vehicle[]) {
  const counts: Record<string, number> = { all: vehicles.length };
  vehicles.forEach(v => {
    const cat = (v.category || '').toLowerCase();
    counts[cat] = (counts[cat] || 0) + 1;
  });

  // Update pills count
  for (const [cat, count] of Object.entries(counts)) {
    const el = document.getElementById(`count-${cat}`);
    if (el) el.textContent = `(${count})`;
  }

  // Update hero stat
  const heroStat = document.getElementById('hero-stat-cars');
  if (heroStat && vehicles.length) {
    heroStat.textContent = `${vehicles.length}+`;
  }
}

function segregateAndRender() {
  const grid = document.getElementById('all-vehicles-grid');
  const counterEl = document.getElementById('fleet-total-counter');
  const statusText = document.getElementById('fleet-status-text');
  const activeTags = document.getElementById('fleet-active-tags');
  const resetBtn = document.getElementById('fleet-reset-btn');

  if (!grid) return;

  // 1. Filter
  let filtered = allVehicles.filter(v => {
    // Category filter
    if (currentCategory !== 'all' && v.category?.toLowerCase() !== currentCategory) {
      return false;
    }
    // Transmission filter
    if (currentTransmission !== 'all' && v.transmission?.toLowerCase() !== currentTransmission) {
      return false;
    }
    // Fuel filter
    if (currentFuel !== 'all' && v.fuelType?.toLowerCase() !== currentFuel) {
      return false;
    }
    // Search query
    if (searchQuery) {
      const q = searchQuery;
      const matchBrand = (v.brand || '').toLowerCase().includes(q);
      const matchModel = (v.model || '').toLowerCase().includes(q);
      const matchLoc = (v.location || '').toLowerCase().includes(q);
      const matchCat = (v.category || '').toLowerCase().includes(q);
      const matchFuel = (v.fuelType || '').toLowerCase().includes(q);
      const matchFeatures = (v.features || []).some(f => f.toLowerCase().includes(q));
      if (!matchBrand && !matchModel && !matchLoc && !matchCat && !matchFuel && !matchFeatures) {
        return false;
      }
    }
    return true;
  });

  // 2. Sort
  if (currentSort === 'price_asc') {
    filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (currentSort === 'price_desc') {
    filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // 3. Update counter & status bar
  const isFiltered = currentCategory !== 'all' || currentTransmission !== 'all' || currentFuel !== 'all' || searchQuery !== '';
  
  if (counterEl) {
    counterEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'vehicle' : 'vehicles'} available`;
  }

  if (statusText) {
    if (!isFiltered) {
      statusText.innerHTML = `Showing all <strong>${allVehicles.length}</strong> vehicles in our fleet`;
    } else {
      statusText.innerHTML = `Segregated <strong>${filtered.length}</strong> of <strong>${allVehicles.length}</strong> vehicles`;
    }
  }

  // Render active tags
  if (activeTags) {
    const tags: string[] = [];
    if (currentCategory !== 'all') {
      tags.push(`<span class="active-filter-tag">${capitalize(currentCategory)} <button class="tag-remove" data-clear="category">✕</button></span>`);
    }
    if (currentTransmission !== 'all') {
      tags.push(`<span class="active-filter-tag">${capitalize(currentTransmission)} <button class="tag-remove" data-clear="transmission">✕</button></span>`);
    }
    if (currentFuel !== 'all') {
      tags.push(`<span class="active-filter-tag">${capitalize(currentFuel)} <button class="tag-remove" data-clear="fuel">✕</button></span>`);
    }
    if (searchQuery) {
      tags.push(`<span class="active-filter-tag">"${searchQuery}" <button class="tag-remove" data-clear="search">✕</button></span>`);
    }
    activeTags.innerHTML = tags.join('');

    // Attach click listeners to individual tag remove buttons
    activeTags.querySelectorAll('.tag-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = (btn as HTMLElement).dataset.clear;
        if (type === 'category') selectCategory('all');
        if (type === 'transmission') {
          currentTransmission = 'all';
          document.querySelectorAll('#fleet-transmission-pills .filter-chip').forEach(c => {
            c.classList.toggle('active', (c as HTMLElement).dataset.transmission === 'all');
          });
          segregateAndRender();
        }
        if (type === 'fuel') {
          currentFuel = 'all';
          document.querySelectorAll('#fleet-fuel-pills .filter-chip').forEach(c => {
            c.classList.toggle('active', (c as HTMLElement).dataset.fuel === 'all');
          });
          segregateAndRender();
        }
        if (type === 'search') {
          searchQuery = '';
          const searchInput = document.getElementById('home-search-input') as HTMLInputElement;
          if (searchInput) searchInput.value = '';
          const searchClear = document.getElementById('home-search-clear') as HTMLButtonElement;
          if (searchClear) searchClear.style.display = 'none';
          segregateAndRender();
        }
      });
    });
  }

  if (resetBtn) {
    resetBtn.style.display = isFiltered ? 'inline-flex' : 'none';
  }

  // 4. Render Cards
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state fleet-empty-state" style="grid-column: 1/-1;">
        <div class="empty-state-icon">🏎️💨</div>
        <h3 class="empty-state-title">No vehicles match your segregation criteria</h3>
        <p class="empty-state-text">Try clearing some filters or searching with a different term.</p>
        <button class="btn btn-accent btn-md" id="empty-reset-btn" style="margin-top:var(--space-4);">
          ↺ Show All Vehicles (${allVehicles.length})
        </button>
      </div>
    `;
    document.getElementById('empty-reset-btn')?.addEventListener('click', resetAllFilters);
  } else {
    grid.innerHTML = filtered.map(v => renderVehicleCard(v)).join('');
  }
}
