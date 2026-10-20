import './style.css'
import './pages.css'
import './company-pages.css'
import { router } from './router'
import { auth } from './auth'
import { renderHeader, renderFooter, initLayout } from './layout'
import { renderHomePage, initHomePage } from './pages/home'
import { renderVehiclesPage, initVehiclesPage } from './pages/vehicles'
import { renderVehicleDetailPage, initVehicleDetailPage } from './pages/vehicleDetail'
import { renderLoginPage, renderRegisterPage, initLoginPage, initRegisterPage } from './pages/auth'
import { renderDashboardPage, initDashboardPage } from './pages/dashboard'
import { renderAdminPage, initAdminPage } from './pages/admin'
import { renderAboutPage, initAboutPage } from './pages/about'
import { renderCareersPage, initCareersPage } from './pages/careers'
import { renderBlogPage, initBlogPage } from './pages/blog'
import { renderContactPage, initContactPage } from './pages/contact'
import { renderHelpPage, initHelpPage } from './pages/help'
import { renderSafetyPage, initSafetyPage } from './pages/safety'
import { renderTermsPage, initTermsPage } from './pages/terms'
import { renderPrivacyPage, initPrivacyPage } from './pages/privacy'
import { renderPaymentPage, initPaymentPage } from './pages/payment'
import { renderKycPage, initKycPage } from './pages/kyc'

const app = document.querySelector<HTMLDivElement>('#app')!

function renderPage(content: string, opts: { noFooter?: boolean } = {}) {
  app.innerHTML = renderHeader() + content + (opts.noFooter ? '' : renderFooter());
  initLayout();
  window.scrollTo(0, 0);
}

// Routes
router
  .add('/', () => {
    renderPage(renderHomePage());
    initHomePage();
  })
  .add('/payment', () => {
    renderPage(renderPaymentPage());
    initPaymentPage();
  })
  .add('/kyc', () => {
    renderPage(renderKycPage());
    initKycPage();
  })
  .add('/verification', () => {
    renderPage(renderKycPage());
    initKycPage();
  })
  .add('/vehicles', () => {
    renderPage(renderVehiclesPage());
    initVehiclesPage();
  })
  .add('/vehicles/:id', (params) => {
    renderPage(renderVehicleDetailPage());
    initVehicleDetailPage(params!.id);
  })
  .add('/login', () => {
    if (auth.isLoggedIn()) {
      router.navigate('/dashboard');
      return;
    }
    renderPage(renderLoginPage(), { noFooter: true });
    initLoginPage();
  })
  .add('/register', () => {
    if (auth.isLoggedIn()) {
      router.navigate('/dashboard');
      return;
    }
    renderPage(renderRegisterPage(), { noFooter: true });
    initRegisterPage();
  })
  .add('/dashboard', () => {
    if (!auth.isLoggedIn()) { router.navigate('/login'); return; }
    renderPage(renderDashboardPage('overview'));
    initDashboardPage('overview');
  })
  .add('/dashboard/bookings', () => {
    if (!auth.isLoggedIn()) { router.navigate('/login'); return; }
    renderPage(renderDashboardPage('bookings'));
    initDashboardPage('bookings');
  })
  .add('/dashboard/notifications', () => {
    if (!auth.isLoggedIn()) { router.navigate('/login'); return; }
    renderPage(renderDashboardPage('notifications'));
    initDashboardPage('notifications');
  })
  .add('/dashboard/profile', () => {
    if (!auth.isLoggedIn()) { router.navigate('/login'); return; }
    renderPage(renderDashboardPage('profile'));
    initDashboardPage('profile');
  })
  .add('/admin', () => {
    if (!auth.isAdmin()) { router.navigate('/'); return; }
    renderPage(renderAdminPage('dashboard'));
    initAdminPage('dashboard');
  })
  .add('/admin/vehicles', () => {
    if (!auth.isAdmin()) { router.navigate('/'); return; }
    renderPage(renderAdminPage('vehicles'));
    initAdminPage('vehicles');
  })
  .add('/admin/bookings', () => {
    if (!auth.isAdmin()) { router.navigate('/'); return; }
    renderPage(renderAdminPage('bookings'));
    initAdminPage('bookings');
  })
  .add('/admin/users', () => {
    if (!auth.isAdmin()) { router.navigate('/'); return; }
    renderPage(renderAdminPage('users'));
    initAdminPage('users');
  })
  .add('/about', () => {
    renderPage(renderAboutPage());
    initAboutPage();
  })
  .add('/careers', () => {
    renderPage(renderCareersPage());
    initCareersPage();
  })
  .add('/blog', () => {
    renderPage(renderBlogPage());
    initBlogPage();
  })
  .add('/contact', () => {
    renderPage(renderContactPage());
    initContactPage();
  })
  .add('/help', () => {
    renderPage(renderHelpPage());
    initHelpPage();
  })
  .add('/safety', () => {
    renderPage(renderSafetyPage());
    initSafetyPage();
  })
  .add('/terms', () => {
    renderPage(renderTermsPage());
    initTermsPage();
  })
  .add('/privacy', () => {
    renderPage(renderPrivacyPage());
    initPrivacyPage();
  })
  .notFound(() => {
    renderPage(`
      <main class="page-enter" style="padding-top:calc(var(--header-height) + var(--space-16));">
        <div class="container">
          <div class="empty-state" style="min-height:60vh;">
            <div class="empty-state-icon">🚧</div>
            <h1 class="empty-state-title" style="font-size:3rem;">404</h1>
            <p class="empty-state-text" style="font-size:1.125rem;">Page not found</p>
            <a href="/" data-link class="btn btn-primary" style="margin-top:var(--space-6);">Go Home</a>
          </div>
        </div>
      </main>
    `);
  });

// Start router
router.start();

// Re-render on auth change (handles header update)
auth.subscribe(() => {
  router.navigate(router.getCurrentPath(), false);
});
