import { api } from '../api';
import { renderVehicleCard } from './home';
import { capitalize } from '../utils';

interface VehiclesResponse {
  success: boolean;
  data: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

let currentFilters: Record<string, string> = {};
let currentPage = 1;

export function renderVehiclesPage(): string {
  // Parse query params
  const params = new URLSearchParams(window.location.search);
  currentFilters = {};
  for (const [key, value] of params.entries()) {
    currentFilters[key] = value;
  }
  currentPage = parseInt(params.get('page') || '1');

  return `
    <main class="page-enter" style="padding-top: calc(var(--header-height) + var(--space-8));">
      <div class="container">
        <div class="vehicles-page-header">
          <div>
            <h1 class="vehicles-page-title">Browse Vehicles</h1>
            <p class="vehicles-page-subtitle">Find the perfect car for your next adventure</p>
          </div>
        </div>

        <div class="vehicles-layout">
          <!-- Filters Sidebar -->
          <aside class="filters-sidebar" id="filters-sidebar">
            <div class="filters-header">
              <h3>Filters</h3>
              <button class="btn btn-ghost btn-sm" id="clear-filters-btn">Clear All</button>
            </div>

            <!-- Search -->
            <div class="filter-group">
              <label class="form-label">Search</label>
              <input type="text" class="form-input" id="filter-search" placeholder="Brand or model..." value="${currentFilters.search || ''}"/>
            </div>

            <!-- Brand -->
            <div class="filter-group">
              <label class="form-label">Brand</label>
              <div class="filter-chips" id="filter-brand">
                ${['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Toyota', 'Kia', 'Honda', 'Volkswagen', 'Škoda', 'MG', 'Force', 'Jeep', 'BMW', 'Mercedes-Benz', 'Audi', 'Land Rover', 'Ford', 'Porsche']
                  .map(b => `<button class="filter-chip ${(currentFilters.brand || '').split(',').includes(b) ? 'active' : ''}" data-value="${b}">${b}</button>`)
                  .join('')}
              </div>
            </div>

            <!-- Category -->
            <div class="filter-group">
              <label class="form-label">Category</label>
              <div class="filter-chips" id="filter-category">
                ${['hatchback', 'sedan', 'suv', 'muv', 'coupe', 'convertible', 'luxury', 'sports', 'electric']
                  .map(c => `<button class="filter-chip ${(currentFilters.category || '').split(',').includes(c) ? 'active' : ''}" data-value="${c}">${capitalize(c)}</button>`)
                  .join('')}
              </div>
            </div>

            <!-- Fuel Type -->
            <div class="filter-group">
              <label class="form-label">Fuel Type</label>
              <div class="filter-chips" id="filter-fuelType">
                ${['petrol', 'diesel', 'electric', 'hybrid', 'cng']
                  .map(f => `<button class="filter-chip ${(currentFilters.fuelType || '').split(',').includes(f) ? 'active' : ''}" data-value="${f}">${capitalize(f)}</button>`)
                  .join('')}
              </div>
            </div>

            <!-- Transmission -->
            <div class="filter-group">
              <label class="form-label">Transmission</label>
              <div class="filter-chips" id="filter-transmission">
                ${['manual', 'automatic']
                  .map(t => `<button class="filter-chip ${currentFilters.transmission === t ? 'active' : ''}" data-value="${t}">${capitalize(t)}</button>`)
                  .join('')}
              </div>
            </div>

            <!-- Price Range -->
            <div class="filter-group">
              <label class="form-label">Price Range (per day)</label>
              <div class="filter-price-inputs">
                <input type="number" class="form-input" id="filter-minPrice" placeholder="Min ₹" value="${currentFilters.minPrice || ''}"/>
                <span style="color:var(--text-muted);">—</span>
                <input type="number" class="form-input" id="filter-maxPrice" placeholder="Max ₹" value="${currentFilters.maxPrice || ''}"/>
              </div>
            </div>

            <!-- Location -->
            <div class="filter-group">
              <label class="form-label">Location</label>
              <input type="text" class="form-input" id="filter-location" placeholder="City name..." value="${currentFilters.location || ''}"/>
            </div>

            <button class="btn btn-primary" id="apply-filters-btn" style="width:100%; margin-top:var(--space-4);">Apply Filters</button>
          </aside>

          <!-- Results -->
          <div class="vehicles-results">
            <div class="results-header" id="results-header">
              <span class="results-count" id="results-count">Loading...</span>
              <div class="results-sort">
                <label class="form-label" style="margin-bottom:0;">Sort:</label>
                <select class="form-select" id="sort-select" style="width:auto;">
                  <option value="" ${!currentFilters.sort ? 'selected' : ''}>Newest</option>
                  <option value="price_asc" ${currentFilters.sort === 'price_asc' ? 'selected' : ''}>Price: Low → High</option>
                  <option value="price_desc" ${currentFilters.sort === 'price_desc' ? 'selected' : ''}>Price: High → Low</option>
                  <option value="rating" ${currentFilters.sort === 'rating' ? 'selected' : ''}>Top Rated</option>
                  <option value="popular" ${currentFilters.sort === 'popular' ? 'selected' : ''}>Most Popular</option>
                </select>
              </div>
            </div>

            <div class="vehicles-grid" id="vehicles-grid">
              <div class="page-loader" style="grid-column:1/-1;">
                <div class="spinner spinner-lg"></div>
              </div>
            </div>

            <div class="pagination" id="pagination"></div>
          </div>
        </div>
      </div>
    </main>
  `;
}

export async function initVehiclesPage() {
  await loadVehicles();

  // Filter chips (multi-select for brand, category and fuelType, single-select for transmission)
  ['filter-brand', 'filter-category', 'filter-fuelType'].forEach(id => {
    const container = document.getElementById(id);
    container?.addEventListener('click', (e) => {
      const chip = (e.target as HTMLElement).closest('.filter-chip') as HTMLElement;
      if (chip) chip.classList.toggle('active');
    });
  });

  const transmissionContainer = document.getElementById('filter-transmission');
  transmissionContainer?.addEventListener('click', (e) => {
    const chip = (e.target as HTMLElement).closest('.filter-chip') as HTMLElement;
    if (chip) {
      const wasActive = chip.classList.contains('active');
      transmissionContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      if (!wasActive) chip.classList.add('active');
    }
  });

  // Apply filters
  document.getElementById('apply-filters-btn')?.addEventListener('click', applyFilters);

  // Clear filters
  document.getElementById('clear-filters-btn')?.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    (document.getElementById('filter-search') as HTMLInputElement).value = '';
    (document.getElementById('filter-minPrice') as HTMLInputElement).value = '';
    (document.getElementById('filter-maxPrice') as HTMLInputElement).value = '';
    (document.getElementById('filter-location') as HTMLInputElement).value = '';
    (document.getElementById('sort-select') as HTMLSelectElement).value = '';
    currentFilters = {};
    currentPage = 1;
    window.history.pushState({}, '', '/vehicles');
    loadVehicles();
  });

  // Sort change
  document.getElementById('sort-select')?.addEventListener('change', () => {
    applyFilters();
  });

  // Search on Enter
  document.getElementById('filter-search')?.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') applyFilters();
  });
}

function applyFilters() {
  const filters: Record<string, string> = {};

  const search = (document.getElementById('filter-search') as HTMLInputElement)?.value.trim();
  if (search) filters.search = search;

  const brands = Array.from(document.querySelectorAll('#filter-brand .filter-chip.active'))
    .map(c => (c as HTMLElement).dataset.value!)
    .filter(Boolean);
  if (brands.length) filters.brand = brands.join(',');

  const categories = Array.from(document.querySelectorAll('#filter-category .filter-chip.active'))
    .map(c => (c as HTMLElement).dataset.value!)
    .filter(Boolean);
  if (categories.length) filters.category = categories.join(',');

  const fuels = Array.from(document.querySelectorAll('#filter-fuelType .filter-chip.active'))
    .map(c => (c as HTMLElement).dataset.value!)
    .filter(Boolean);
  if (fuels.length) filters.fuelType = fuels.join(',');

  const transmission = document.querySelector('#filter-transmission .filter-chip.active') as HTMLElement;
  if (transmission) filters.transmission = transmission.dataset.value!;

  const minPrice = (document.getElementById('filter-minPrice') as HTMLInputElement)?.value;
  if (minPrice) filters.minPrice = minPrice;

  const maxPrice = (document.getElementById('filter-maxPrice') as HTMLInputElement)?.value;
  if (maxPrice) filters.maxPrice = maxPrice;

  const location = (document.getElementById('filter-location') as HTMLInputElement)?.value.trim();
  if (location) filters.location = location;

  const sort = (document.getElementById('sort-select') as HTMLSelectElement)?.value;
  if (sort) filters.sort = sort;

  currentFilters = filters;
  currentPage = 1;

  const qs = new URLSearchParams(filters).toString();
  window.history.pushState({}, '', `/vehicles${qs ? '?' + qs : ''}`);
  loadVehicles();
}

async function loadVehicles() {
  const grid = document.getElementById('vehicles-grid');
  const countEl = document.getElementById('results-count');
  const paginationEl = document.getElementById('pagination');

  if (grid) {
    grid.innerHTML = `<div class="page-loader" style="grid-column:1/-1;"><div class="spinner spinner-lg"></div></div>`;
  }

  try {
    const params = new URLSearchParams({ ...currentFilters, page: String(currentPage), limit: '12' });
    const res = await api.get<VehiclesResponse>(`/vehicles?${params}`);

    if (grid) {
      if (res.data.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1;">
            <div class="empty-state-icon">🔍</div>
            <h3 class="empty-state-title">No vehicles found</h3>
            <p class="empty-state-text">Try adjusting your filters or search terms.</p>
          </div>
        `;
      } else {
        grid.innerHTML = res.data.map(v => renderVehicleCard(v)).join('');
      }
    }

    if (countEl) {
      countEl.textContent = `${res.pagination.total} vehicle${res.pagination.total !== 1 ? 's' : ''} found`;
    }

    if (paginationEl && res.pagination.pages > 1) {
      paginationEl.innerHTML = renderPagination(res.pagination.page, res.pagination.pages);
      paginationEl.querySelectorAll('.pagination-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          currentPage = parseInt((btn as HTMLElement).dataset.page!);
          loadVehicles();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    } else if (paginationEl) {
      paginationEl.innerHTML = '';
    }
  } catch {
    if (grid) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <div class="empty-state-icon">🔌</div>
          <h3 class="empty-state-title">Connection Error</h3>
          <p class="empty-state-text">Unable to load vehicles. Make sure the backend is running.</p>
        </div>
      `;
    }
  }
}

function renderPagination(current: number, total: number): string {
  let html = '';
  for (let i = 1; i <= total; i++) {
    html += `<button class="pagination-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  return html;
}
