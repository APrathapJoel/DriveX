import { api } from '../api';
import { auth } from '../auth';
import { router } from '../router';
import { showToast } from '../toast';
import { formatPrice, formatDate, formatDateTime, getStatusBadge, generateVehicleGradient, getCategoryIcon, capitalize, timeAgo } from '../utils';

export function renderDashboardPage(section = 'overview'): string {
  const user = auth.getUser();
  if (!user) {
    router.navigate('/login');
    return '';
  }

  return `
    <main class="page-enter" style="padding-top: calc(var(--header-height) + var(--space-8));">
      <div class="container">
        <div class="dashboard-layout">
          <!-- Sidebar -->
          <aside class="dashboard-sidebar">
            <div class="dashboard-user-card">
              <div class="dashboard-avatar">${user.name.charAt(0).toUpperCase()}</div>
              <h3 class="dashboard-user-name">${user.name}</h3>
              <p class="dashboard-user-email">${user.email}</p>
              <span class="badge ${user.verificationStatus === 'VERIFIED' ? 'badge-success' : 'badge-warning'}">${user.verificationStatus === 'VERIFIED' ? '✓ Verified' : 'Unverified'}</span>
            </div>
            <nav class="dashboard-nav">
              <a href="/dashboard" data-link class="dashboard-nav-link ${section === 'overview' ? 'active' : ''}">
                📊 Overview
              </a>
              <a href="/dashboard/bookings" data-link class="dashboard-nav-link ${section === 'bookings' ? 'active' : ''}">
                📋 My Bookings
              </a>
              <a href="/dashboard/notifications" data-link class="dashboard-nav-link ${section === 'notifications' ? 'active' : ''}">
                🔔 Notifications
              </a>
              <a href="/dashboard/profile" data-link class="dashboard-nav-link ${section === 'profile' ? 'active' : ''}">
                👤 Profile
              </a>
            </nav>
          </aside>

          <!-- Content -->
          <div class="dashboard-content" id="dashboard-content">
            <div class="page-loader">
              <div class="spinner spinner-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

export async function initDashboardPage(section = 'overview') {
  const content = document.getElementById('dashboard-content');
  if (!content) return;

  switch (section) {
    case 'overview':
      await loadOverview(content);
      break;
    case 'bookings':
      await loadBookings(content);
      break;
    case 'notifications':
      await loadNotifications(content);
      break;
    case 'profile':
      loadProfile(content);
      break;
  }
}

async function loadOverview(container: HTMLElement) {
  try {
    const res = await api.get<{ success: boolean; data: any[]; pagination: any }>('/bookings/my?limit=5');
    const bookings = res.data;

    const stats = {
      total: res.pagination.total,
      active: bookings.filter((b: any) => ['confirmed', 'active'].includes(b.status)).length,
      completed: bookings.filter((b: any) => b.status === 'completed').length,
      totalSpent: bookings
        .filter((b: any) => b.paymentStatus === 'successful')
        .reduce((sum: number, b: any) => sum + b.pricing.totalAmount, 0),
    };

    container.innerHTML = `
      <h2 class="dashboard-section-title">Overview</h2>

      <div class="overview-stats-grid">
        <div class="overview-stat-card">
          <div class="overview-stat-icon" style="background:rgba(99,102,241,0.15);color:var(--primary-400);">📋</div>
          <div class="overview-stat-info">
            <span class="overview-stat-value">${stats.total}</span>
            <span class="overview-stat-label">Total Bookings</span>
          </div>
        </div>
        <div class="overview-stat-card">
          <div class="overview-stat-icon" style="background:rgba(16,185,129,0.15);color:var(--success);">✓</div>
          <div class="overview-stat-info">
            <span class="overview-stat-value">${stats.active}</span>
            <span class="overview-stat-label">Active</span>
          </div>
        </div>
        <div class="overview-stat-card">
          <div class="overview-stat-icon" style="background:rgba(139,92,246,0.15);color:#8b5cf6;">🏁</div>
          <div class="overview-stat-info">
            <span class="overview-stat-value">${stats.completed}</span>
            <span class="overview-stat-label">Completed</span>
          </div>
        </div>
        <div class="overview-stat-card">
          <div class="overview-stat-icon" style="background:rgba(249,115,22,0.15);color:var(--accent-400);">💰</div>
          <div class="overview-stat-info">
            <span class="overview-stat-value">${formatPrice(stats.totalSpent)}</span>
            <span class="overview-stat-label">Total Spent</span>
          </div>
        </div>
      </div>

      <h3 class="dashboard-subsection-title">Recent Bookings</h3>
      ${bookings.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3 class="empty-state-title">No bookings yet</h3>
          <p class="empty-state-text">Start exploring vehicles to make your first booking!</p>
          <a href="/vehicles" data-link class="btn btn-primary" style="margin-top:var(--space-4);">Browse Vehicles</a>
        </div>
      ` : `
        <div class="bookings-list">
          ${bookings.map((b: any) => renderBookingCard(b)).join('')}
        </div>
      `}
    `;

    attachBookingHandlers(container, () => loadOverview(container));
  } catch {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔌</div>
        <h3 class="empty-state-title">Connection Error</h3>
        <p class="empty-state-text">Unable to load dashboard data.</p>
      </div>
    `;
  }
}

async function loadBookings(container: HTMLElement) {
  try {
    const res = await api.get<{ success: boolean; data: any[]; pagination: any }>('/bookings/my?limit=50');
    const bookings = res.data;

    container.innerHTML = `
      <h2 class="dashboard-section-title">My Bookings</h2>
      ${bookings.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3 class="empty-state-title">No bookings yet</h3>
          <p class="empty-state-text">Start exploring vehicles to make your first booking!</p>
          <a href="/vehicles" data-link class="btn btn-primary" style="margin-top:var(--space-4);">Browse Vehicles</a>
        </div>
      ` : `
        <div class="bookings-list">
          ${bookings.map((b: any) => renderBookingCard(b)).join('')}
        </div>
      `}
    `;

    attachBookingHandlers(container, () => loadBookings(container));
  } catch {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔌</div>
        <h3 class="empty-state-title">Connection Error</h3>
      </div>
    `;
  }
}

function attachBookingHandlers(container: HTMLElement, reloadFn: () => Promise<void>) {
  // Pay booking handlers
  container.querySelectorAll('.pay-booking-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const bookingId = (btn as HTMLElement).dataset.bookingId!;
      const vehicle = (btn as HTMLElement).dataset.vehicle!;
      const amount = (btn as HTMLElement).dataset.amount!;

      const originalText = (btn as HTMLElement).innerHTML;
      (btn as HTMLElement).innerHTML = '<div class="spinner" style="width:14px;height:14px;border-top-color:white;display:inline-block;vertical-align:middle;margin-right:6px;"></div> Paying...';
      (btn as HTMLElement).setAttribute('disabled', 'true');

      try {
        const createRes = await api.post<{ success: boolean; data: { payment: any } }>('/payments/create', { bookingId });
        const paymentId = createRes.data.payment._id || createRes.data.payment.id;
        
        await api.post('/payments/verify', { paymentId, bookingId });
        showToast(`Payment of ₹${Number(amount).toLocaleString()} for ${vehicle} completed! Booking confirmed 🎉`, 'success');
        await reloadFn();
      } catch (err: any) {
        showToast(err.message || 'Payment failed', 'error');
        (btn as HTMLElement).innerHTML = originalText;
        (btn as HTMLElement).removeAttribute('disabled');
      }
    });
  });

  // Cancel booking handlers
  container.querySelectorAll('.cancel-booking-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const bookingId = (btn as HTMLElement).dataset.bookingId!;
      const originalText = (btn as HTMLElement).innerHTML;
      (btn as HTMLElement).innerHTML = '<div class="spinner" style="width:14px;height:14px;display:inline-block;vertical-align:middle;"></div>';
      (btn as HTMLElement).setAttribute('disabled', 'true');

      try {
        await api.put(`/bookings/${bookingId}/cancel`, { reason: 'Cancelled by user' });
        showToast('Booking cancelled successfully', 'info');
        await reloadFn();
      } catch (err: any) {
        showToast(err.message || 'Failed to cancel', 'error');
        (btn as HTMLElement).innerHTML = originalText;
        (btn as HTMLElement).removeAttribute('disabled');
      }
    });
  });
}

function renderBookingCard(b: any): string {
  const v = b.vehicle;
  const gradient = v ? generateVehicleGradient(v.brand, v.category) : 'var(--bg-tertiary)';
  const canCancel = ['pending', 'confirmed'].includes(b.status);
  const canPay = b.paymentStatus === 'pending' && b.status !== 'cancelled';

  return `
    <div class="booking-card-item card">
      <div class="booking-card-image" style="background:${gradient};">
        ${v ? `<span class="booking-card-emoji">${getCategoryIcon(v.category)}</span>` : ''}
      </div>
      <div class="booking-card-info">
        <div class="booking-card-top">
          <h4>${v ? `${v.brand} ${v.model}` : 'Vehicle'}</h4>
          <div class="booking-card-badges">
            ${getStatusBadge(b.status)}
            ${getStatusBadge(b.paymentStatus)}
          </div>
        </div>
        <div class="booking-card-dates">
          <span>📅 ${formatDateTime(b.startDate)} → ${formatDateTime(b.endDate)}</span>
        </div>
        <div class="booking-card-location">
          <span>📍 ${b.pickupLocation}</span>
        </div>
        <div class="booking-card-bottom">
          <span class="booking-card-total">${formatPrice(b.pricing?.totalAmount || 0)}</span>
          <div class="booking-card-actions" style="display:flex;gap:var(--space-2);align-items:center;">
            ${canPay ? `
              <button id="pay-btn-${b._id}" data-testid="pay-now-btn" class="btn btn-primary btn-sm pay-booking-btn" data-booking-id="${b._id}" data-amount="${b.pricing?.totalAmount || 0}" data-vehicle="${v ? `${v.brand} ${v.model}` : 'Vehicle'}">
                💳 Pay Now
              </button>
            ` : ''}
            ${canCancel ? `<button class="btn btn-outline btn-sm cancel-booking-btn" data-booking-id="${b._id}">Cancel</button>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

async function loadNotifications(container: HTMLElement) {
  try {
    const res = await api.get<{ success: boolean; data: any[] }>('/notifications');
    const notifications = res.data;

    container.innerHTML = `
      <div class="dashboard-section-header">
        <h2 class="dashboard-section-title">Notifications</h2>
        ${notifications.length > 0 ? `<button class="btn btn-ghost btn-sm" id="mark-all-read-btn">Mark all read</button>` : ''}
      </div>
      ${notifications.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">🔔</div>
          <h3 class="empty-state-title">No notifications</h3>
          <p class="empty-state-text">You're all caught up!</p>
        </div>
      ` : `
        <div class="notifications-list">
          ${notifications.map((n: any) => `
            <div class="notification-item ${n.isRead ? '' : 'unread'}">
              <div class="notification-icon">${getNotificationIcon(n.type)}</div>
              <div class="notification-content">
                <h4 class="notification-title">${n.title}</h4>
                <p class="notification-message">${n.message}</p>
                <span class="notification-time">${timeAgo(n.createdAt)}</span>
              </div>
              ${n.link ? `<a href="${n.link}" data-link class="btn btn-ghost btn-sm">View</a>` : ''}
            </div>
          `).join('')}
        </div>
      `}
    `;

    document.getElementById('mark-all-read-btn')?.addEventListener('click', async () => {
      try {
        await api.put('/notifications/read-all');
        showToast('All notifications marked as read', 'success');
        await loadNotifications(container);
      } catch {
        showToast('Failed to mark notifications', 'error');
      }
    });
  } catch {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔌</div>
        <h3 class="empty-state-title">Connection Error</h3>
      </div>
    `;
  }
}

function getNotificationIcon(type: string): string {
  const icons: Record<string, string> = {
    booking_confirmed: '✅',
    booking_cancelled: '❌',
    verification_reminder: '🔐',
    payment_received: '💳',
    review_reminder: '⭐',
  };
  return icons[type] || '🔔';
}

function loadProfile(container: HTMLElement) {
  const user = auth.getUser();
  if (!user) return;

  container.innerHTML = `
    <h2 class="dashboard-section-title">Profile</h2>

    <div class="profile-card card" style="padding:var(--space-8);">
      <form id="profile-form" class="profile-form">
        <div class="profile-form-grid">
          <div class="form-group">
            <label class="form-label" for="profile-name">Full Name</label>
            <input type="text" class="form-input" id="profile-name" value="${user.name}" required/>
          </div>
          <div class="form-group">
            <label class="form-label" for="profile-email">Email</label>
            <input type="email" class="form-input" id="profile-email" value="${user.email}" disabled/>
          </div>
          <div class="form-group">
            <label class="form-label" for="profile-phone">Phone</label>
            <input type="tel" class="form-input" id="profile-phone" value="${user.phone || ''}" placeholder="+91 9876543210"/>
          </div>
          <div class="form-group">
            <label class="form-label">Verification</label>
            <div style="padding: var(--space-3) 0;">
              ${getStatusBadge(user.verificationStatus.toLowerCase())}
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary" id="profile-submit">Save Changes</button>
      </form>
    </div>

    <div class="profile-card card" style="padding:var(--space-8); margin-top:var(--space-6);">
      <h3 style="margin-bottom:var(--space-6);">Change Password</h3>
      <form id="password-form" class="profile-form">
        <div class="profile-form-grid">
          <div class="form-group">
            <label class="form-label" for="current-password">Current Password</label>
            <input type="password" class="form-input" id="current-password" required/>
          </div>
          <div class="form-group">
            <label class="form-label" for="new-password">New Password</label>
            <input type="password" class="form-input" id="new-password" required minlength="6"/>
          </div>
        </div>
        <button type="submit" class="btn btn-outline" id="password-submit">Update Password</button>
      </form>
    </div>

    <div class="profile-card card" style="padding:var(--space-8); margin-top:var(--space-6);">
      <h3 style="margin-bottom:var(--space-2);">Account Info</h3>
      <p style="color:var(--text-secondary); font-size:0.9375rem;">
        Member since ${formatDate(user.createdAt)} · Role: ${capitalize(user.role)}
      </p>
    </div>
  `;

  // Profile form
  document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.getElementById('profile-name') as HTMLInputElement).value;
    const phone = (document.getElementById('profile-phone') as HTMLInputElement).value;

    try {
      await api.put('/auth/profile', { name, phone });
      await auth.refreshUser();
      showToast('Profile updated! ✓', 'success');
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  });

  // Password form
  document.getElementById('password-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = (document.getElementById('current-password') as HTMLInputElement).value;
    const newPassword = (document.getElementById('new-password') as HTMLInputElement).value;

    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      showToast('Password updated! ✓', 'success');
      (document.getElementById('password-form') as HTMLFormElement).reset();
    } catch (err: any) {
      showToast(err.message || 'Password update failed', 'error');
    }
  });
}
