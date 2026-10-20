import { api } from '../api';
import { auth } from '../auth';
import { router } from '../router';
import { formatPrice, formatDate, getStatusBadge, getCategoryIcon, capitalize } from '../utils';

export function renderAdminPage(section = 'dashboard'): string {
  const user = auth.getUser();
  if (!user || user.role !== 'admin') {
    router.navigate('/');
    return '';
  }

  return `
    <main class="page-enter" style="padding-top: calc(var(--header-height) + var(--space-8));">
      <div class="container" style="max-width: 1400px;">
        <div class="dashboard-layout" style="grid-template-columns: 240px 1fr;">
          <!-- Admin Sidebar -->
          <aside class="dashboard-sidebar">
            <div class="dashboard-user-card" style="padding: var(--space-4);">
              <div class="dashboard-avatar" style="width:48px;height:48px;font-size:1.2rem;">👑</div>
              <h3 class="dashboard-user-name" style="font-size:1rem;">Admin Portal</h3>
            </div>
            <nav class="dashboard-nav">
              <a href="/admin" data-link class="dashboard-nav-link ${section === 'dashboard' ? 'active' : ''}">
                📊 Dashboard
              </a>
              <a href="/admin/vehicles" data-link class="dashboard-nav-link ${section === 'vehicles' ? 'active' : ''}">
                🚗 Vehicles
              </a>
              <a href="/admin/bookings" data-link class="dashboard-nav-link ${section === 'bookings' ? 'active' : ''}">
                📋 Bookings
              </a>
              <a href="/admin/users" data-link class="dashboard-nav-link ${section === 'users' ? 'active' : ''}">
                👥 Users
              </a>
            </nav>
          </aside>

          <!-- Admin Content -->
          <div class="dashboard-content" id="admin-content">
            <div class="page-loader">
              <div class="spinner spinner-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

export async function initAdminPage(section = 'dashboard') {
  const content = document.getElementById('admin-content');
  if (!content) return;

  switch (section) {
    case 'dashboard':
      await loadAdminDashboard(content);
      break;
    case 'vehicles':
      await loadAdminVehicles(content);
      break;
    case 'bookings':
      await loadAdminBookings(content);
      break;
    case 'users':
      await loadAdminUsers(content);
      break;
  }
}

async function loadAdminDashboard(container: HTMLElement) {
  try {
    const res = await api.get<{ success: boolean; data: any }>('/admin/dashboard-stats');
    const stats = res.data;

    container.innerHTML = `
      <h2 class="dashboard-section-title">Admin Dashboard</h2>
      
      <div class="overview-stats-grid" style="grid-template-columns: repeat(4, 1fr);">
        <div class="overview-stat-card">
          <div class="overview-stat-icon" style="background:rgba(99,102,241,0.15);color:var(--primary-400);">👥</div>
          <div class="overview-stat-info">
            <span class="overview-stat-value">${stats.totalUsers}</span>
            <span class="overview-stat-label">Total Users</span>
          </div>
        </div>
        <div class="overview-stat-card">
          <div class="overview-stat-icon" style="background:rgba(16,185,129,0.15);color:var(--success);">🚗</div>
          <div class="overview-stat-info">
            <span class="overview-stat-value">${stats.totalVehicles}</span>
            <span class="overview-stat-label">Total Vehicles</span>
          </div>
        </div>
        <div class="overview-stat-card">
          <div class="overview-stat-icon" style="background:rgba(249,115,22,0.15);color:var(--warning);">📋</div>
          <div class="overview-stat-info">
            <span class="overview-stat-value">${stats.totalBookings}</span>
            <span class="overview-stat-label">Total Bookings</span>
          </div>
        </div>
        <div class="overview-stat-card">
          <div class="overview-stat-icon" style="background:rgba(139,92,246,0.15);color:#8b5cf6;">💰</div>
          <div class="overview-stat-info">
            <span class="overview-stat-value">${formatPrice(stats.totalRevenue)}</span>
            <span class="overview-stat-label">Total Revenue</span>
          </div>
        </div>
      </div>
      
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:var(--space-6); margin-top:var(--space-8);">
        <div class="card" style="padding:var(--space-6);">
          <h3 style="margin-bottom:var(--space-4);">Recent Bookings</h3>
          ${(stats.recentBookings || []).map((b: any) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:var(--space-2) 0; border-bottom:1px solid var(--border-default);">
              <div>
                <div style="font-weight:600;font-size:0.9375rem;">${b.vehicle?.brand || 'Vehicle'} ${b.vehicle?.model || ''}</div>
                <div style="font-size:0.8125rem;color:var(--text-secondary);">${b.user?.name || 'User'}</div>
              </div>
              <div style="text-align:right;">
                ${getStatusBadge(b.status || 'pending')}
                <div style="font-size:0.8125rem;color:var(--text-secondary);margin-top:4px;">${formatPrice(b.pricing?.totalAmount || 0)}</div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="card" style="padding:var(--space-6);">
          <h3 style="margin-bottom:var(--space-4);">Recent Users</h3>
          ${(stats.recentUsers || []).map((u: any) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:var(--space-2) 0; border-bottom:1px solid var(--border-default);">
              <div style="display:flex;align-items:center;gap:var(--space-3);">
                <div style="width:32px;height:32px;border-radius:50%;background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;">${(u.name || 'U').charAt(0)}</div>
                <div>
                  <div style="font-weight:600;font-size:0.9375rem;">${u.name || 'User'}</div>
                  <div style="font-size:0.8125rem;color:var(--text-secondary);">${u.email || ''}</div>
                </div>
              </div>
              <div>
                ${getStatusBadge((u.verificationStatus || 'not_submitted').toLowerCase())}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (err) {
    console.error('Failed to load admin dashboard:', err);
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔌</div>
        <h3 class="empty-state-title">Connection Error</h3>
        <p class="empty-state-text">Unable to load admin dashboard.</p>
      </div>
    `;
  }
}

async function loadAdminVehicles(container: HTMLElement) {
  try {
    const res = await api.get<{ success: boolean; data: any[] }>('/vehicles?limit=100');
    const vehicles = res.data;

    container.innerHTML = `
      <div class="dashboard-section-header">
        <h2 class="dashboard-section-title">Manage Vehicles</h2>
        <button class="btn btn-primary btn-sm">➕ Add Vehicle</button>
      </div>
      
      <div class="card" style="overflow-x:auto;">
        <table style="width:100%; text-align:left; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-default); background:var(--bg-tertiary);">
              <th style="padding:var(--space-3) var(--space-4); font-size:0.8125rem; text-transform:uppercase; color:var(--text-secondary);">Vehicle</th>
              <th style="padding:var(--space-3) var(--space-4); font-size:0.8125rem; text-transform:uppercase; color:var(--text-secondary);">Reg No.</th>
              <th style="padding:var(--space-3) var(--space-4); font-size:0.8125rem; text-transform:uppercase; color:var(--text-secondary);">Price/Day</th>
              <th style="padding:var(--space-3) var(--space-4); font-size:0.8125rem; text-transform:uppercase; color:var(--text-secondary);">Status</th>
              <th style="padding:var(--space-3) var(--space-4); font-size:0.8125rem; text-transform:uppercase; color:var(--text-secondary);">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${vehicles.map((v: any) => `
              <tr style="border-bottom:1px solid var(--border-default);">
                <td style="padding:var(--space-3) var(--space-4);">
                  <div style="font-weight:600;font-size:0.9375rem;">${v.brand} ${v.model}</div>
                  <div style="font-size:0.8125rem;color:var(--text-secondary);">${getCategoryIcon(v.category)} ${capitalize(v.category)} · ${v.location}</div>
                </td>
                <td style="padding:var(--space-3) var(--space-4); font-size:0.9375rem; font-family:var(--mono);">${v.registrationNumber}</td>
                <td style="padding:var(--space-3) var(--space-4); font-size:0.9375rem;">${formatPrice(v.pricePerDay)}</td>
                <td style="padding:var(--space-3) var(--space-4);">
                  ${v.isAvailable ? '<span class="badge badge-success">Available</span>' : '<span class="badge badge-error">Unavailable</span>'}
                </td>
                <td style="padding:var(--space-3) var(--space-4);">
                  <div style="display:flex;gap:var(--space-2);">
                    <button class="btn btn-outline btn-sm" style="padding:4px 8px;font-size:0.75rem;">Edit</button>
                    <button class="btn btn-outline btn-sm" style="padding:4px 8px;font-size:0.75rem;color:var(--error);border-color:rgba(239,68,68,0.3);">Delete</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch {
    container.innerHTML = `<div class="empty-state">Error loading vehicles</div>`;
  }
}

async function loadAdminBookings(container: HTMLElement) {
  try {
    const res = await api.get<{ success: boolean; data: any[] }>('/admin/bookings');
    const bookings = res.data;

    container.innerHTML = `
      <div class="dashboard-section-header">
        <h2 class="dashboard-section-title">All Bookings</h2>
      </div>
      
      <div class="card" style="overflow-x:auto;">
        <table style="width:100%; text-align:left; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-default); background:var(--bg-tertiary);">
              <th style="padding:var(--space-3) var(--space-4); font-size:0.8125rem; text-transform:uppercase; color:var(--text-secondary);">User</th>
              <th style="padding:var(--space-3) var(--space-4); font-size:0.8125rem; text-transform:uppercase; color:var(--text-secondary);">Vehicle</th>
              <th style="padding:var(--space-3) var(--space-4); font-size:0.8125rem; text-transform:uppercase; color:var(--text-secondary);">Dates</th>
              <th style="padding:var(--space-3) var(--space-4); font-size:0.8125rem; text-transform:uppercase; color:var(--text-secondary);">Amount</th>
              <th style="padding:var(--space-3) var(--space-4); font-size:0.8125rem; text-transform:uppercase; color:var(--text-secondary);">Status</th>
            </tr>
          </thead>
          <tbody>
            ${bookings.map((b: any) => `
              <tr style="border-bottom:1px solid var(--border-default);">
                <td style="padding:var(--space-3) var(--space-4);">
                  <div style="font-weight:600;font-size:0.9375rem;">${b.user?.name || 'Unknown'}</div>
                  <div style="font-size:0.8125rem;color:var(--text-secondary);">${b.user?.email || ''}</div>
                </td>
                <td style="padding:var(--space-3) var(--space-4);">
                  <div style="font-weight:600;font-size:0.9375rem;">${b.vehicle?.brand} ${b.vehicle?.model}</div>
                </td>
                <td style="padding:var(--space-3) var(--space-4);">
                  <div style="font-size:0.875rem;">${formatDate(b.startDate)}</div>
                  <div style="font-size:0.875rem;color:var(--text-secondary);">to ${formatDate(b.endDate)}</div>
                </td>
                <td style="padding:var(--space-3) var(--space-4); font-size:0.9375rem; font-weight:600;">
                  ${formatPrice(b.pricing?.totalAmount || 0)}
                </td>
                <td style="padding:var(--space-3) var(--space-4);">
                  <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start;">
                    ${getStatusBadge(b.status)}
                    ${getStatusBadge(b.paymentStatus)}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    console.error('Failed to load admin bookings:', err);
    container.innerHTML = `<div class="empty-state">Error loading bookings</div>`;
  }
}

async function loadAdminUsers(container: HTMLElement) {
  try {
    const res = await api.get<{ success: boolean; data: any[] }>('/admin/users');
    const users = Array.isArray(res.data) ? res.data : [];

    container.innerHTML = `
      <div class="dashboard-section-header">
        <h2 class="dashboard-section-title">Users</h2>
      </div>
      
      <div class="card" style="overflow-x:auto;">
        <table style="width:100%; text-align:left; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-default); background:var(--bg-tertiary);">
              <th style="padding:var(--space-3) var(--space-4); font-size:0.8125rem; text-transform:uppercase; color:var(--text-secondary);">User</th>
              <th style="padding:var(--space-3) var(--space-4); font-size:0.8125rem; text-transform:uppercase; color:var(--text-secondary);">Role</th>
              <th style="padding:var(--space-3) var(--space-4); font-size:0.8125rem; text-transform:uppercase; color:var(--text-secondary);">Joined</th>
              <th style="padding:var(--space-3) var(--space-4); font-size:0.8125rem; text-transform:uppercase; color:var(--text-secondary);">Status</th>
            </tr>
          </thead>
          <tbody>
            ${users.map((u: any) => `
              <tr style="border-bottom:1px solid var(--border-default);">
                <td style="padding:var(--space-3) var(--space-4);">
                  <div style="font-weight:600;font-size:0.9375rem;">${u.name}</div>
                  <div style="font-size:0.8125rem;color:var(--text-secondary);">${u.email}</div>
                  <div style="font-size:0.8125rem;color:var(--text-secondary);">${u.phone || 'No phone'}</div>
                </td>
                <td style="padding:var(--space-3) var(--space-4);">
                  <span class="badge ${u.role === 'admin' ? 'badge-primary' : 'badge-neutral'}">${capitalize(u.role)}</span>
                </td>
                <td style="padding:var(--space-3) var(--space-4); font-size:0.9375rem;">
                  ${formatDate(u.createdAt)}
                </td>
                <td style="padding:var(--space-3) var(--space-4);">
                  ${getStatusBadge(u.verificationStatus.toLowerCase())}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch {
    container.innerHTML = `<div class="empty-state">Error loading users</div>`;
  }
}
