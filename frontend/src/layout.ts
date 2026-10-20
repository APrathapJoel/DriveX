import { auth } from './auth';
import { router } from './router';

export function renderHeader(): string {
  const user = auth.getUser();

  return `
    <header class="header" id="main-header">
      <div class="header-inner">
        <a href="/" data-link class="logo">
          <img src="/driver-logo-badge.png" alt="DriveR" class="logo-img" />
        </a>

        <nav class="nav-links" id="nav-links">
          <a href="/" data-link class="nav-link" data-route="/">Home</a>
          <a href="/vehicles" data-link class="nav-link" data-route="/vehicles">Vehicles</a>
          <a href="/kyc" data-link class="nav-link" data-route="/kyc">Instant KYC</a>
          <a href="/payment" data-link class="nav-link" data-route="/payment">Pay & Checkout</a>
          ${user ? `<a href="/dashboard" data-link class="nav-link" data-route="/dashboard">Dashboard</a>` : ''}
          ${user?.role === 'admin' ? `<a href="/admin" data-link class="nav-link" data-route="/admin">Admin</a>` : ''}
        </nav>

        <div class="nav-actions">
          ${user ? `
            <button class="nav-user-btn" id="user-menu-btn">
              <span class="nav-avatar">${user.name.charAt(0).toUpperCase()}</span>
              <span>${user.name.split(' ')[0]}</span>
            </button>
          ` : `
            <a href="/login" data-link class="btn btn-ghost btn-sm">Log in</a>
            <a href="/register" data-link class="btn btn-primary btn-sm">Sign up</a>
          `}
          <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Dropdown menu for logged-in user -->
      ${user ? `
        <div class="user-dropdown" id="user-dropdown" style="display:none;">
          <div class="dropdown-header">
            <span class="dropdown-name">${user.name}</span>
            <span class="dropdown-email">${user.email}</span>
          </div>
          <div class="dropdown-divider"></div>
          <a href="/dashboard" data-link class="dropdown-item">📊 Dashboard</a>
          <a href="/dashboard/bookings" data-link class="dropdown-item">📋 My Bookings</a>
          <a href="/kyc" data-link class="dropdown-item">🪪 Instant KYC Verification</a>
          <a href="/payment" data-link class="dropdown-item">💳 Payment Gateway</a>
          <a href="/dashboard/profile" data-link class="dropdown-item">👤 Profile</a>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item dropdown-logout" id="logout-btn">🚪 Log out</button>
        </div>
      ` : ''}

      <!-- Mobile menu -->
      <div class="mobile-nav" id="mobile-nav" style="display:none;">
        <a href="/" data-link class="mobile-nav-link">Home</a>
        <a href="/vehicles" data-link class="mobile-nav-link">Vehicles</a>
        <a href="/kyc" data-link class="mobile-nav-link">Instant KYC</a>
        <a href="/payment" data-link class="mobile-nav-link">Payment Gateway</a>
        ${user ? `
          <a href="/dashboard" data-link class="mobile-nav-link">Dashboard</a>
          <a href="/dashboard/bookings" data-link class="mobile-nav-link">My Bookings</a>
          <div class="dropdown-divider"></div>
          <button class="mobile-nav-link" id="mobile-logout-btn">Log out</button>
        ` : `
          <div class="dropdown-divider"></div>
          <a href="/login" data-link class="mobile-nav-link">Log in</a>
          <a href="/register" data-link class="mobile-nav-link">Sign up</a>
        `}
      </div>
    </header>
  `;
}

export function renderFooter(): string {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="logo">
              <img src="/driver-logo-badge.png" alt="DriveR" class="logo-img" style="height:38px; width:auto;" />
            </div>
            <p>DriveR is India's premier self-drive car rental platform offering luxury, sports, electric, and everyday vehicles across India.</p>
          </div>
          <div>
            <h4 class="footer-title">Quick Links</h4>
            <div class="footer-links">
              <a href="/" data-link>Home</a>
              <a href="/vehicles" data-link>Browse Vehicles</a>
              <a href="/vehicles?category=electric" data-link>Electric Cars</a>
              <a href="/vehicles?category=luxury" data-link>Luxury Cars</a>
            </div>
          </div>
          <div>
            <h4 class="footer-title">Company</h4>
            <div class="footer-links">
              <a href="/about" data-link>About Us</a>
              <a href="/careers" data-link>Careers</a>
              <a href="/blog" data-link>Blog</a>
              <a href="/contact" data-link>Contact</a>
            </div>
          </div>
          <div>
            <h4 class="footer-title">Support</h4>
            <div class="footer-links">
              <a href="/help" data-link>Help Center</a>
              <a href="/safety" data-link>Safety</a>
              <a href="/terms" data-link>Terms of Service</a>
              <a href="/privacy" data-link>Privacy Policy</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} DriveR Mobility. Founded by Prathap Joel · Coimbatore, India.</span>
          <span>Made with ❤️ in India</span>
        </div>
      </div>
    </footer>
  `;
}

export function initLayout() {
  // Scroll-based header
  const header = document.getElementById('main-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Active nav link
  const currentPath = router.getCurrentPath();
  document.querySelectorAll('.nav-link[data-route]').forEach(link => {
    const route = link.getAttribute('data-route');
    if (route === currentPath || (route !== '/' && currentPath.startsWith(route!))) {
      link.classList.add('active');
    }
  });

  // User dropdown
  const userBtn = document.getElementById('user-menu-btn');
  const dropdown = document.getElementById('user-dropdown');
  if (userBtn && dropdown) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = dropdown.style.display !== 'none';
      dropdown.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
      dropdown.style.display = 'none';
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
  const handleLogout = async () => {
    await auth.logout();
    router.navigate('/');
  };
  logoutBtn?.addEventListener('click', handleLogout);
  mobileLogoutBtn?.addEventListener('click', handleLogout);

  // Mobile menu
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      const isVisible = mobileNav.style.display !== 'none';
      mobileNav.style.display = isVisible ? 'none' : 'flex';
    });
  }
}
