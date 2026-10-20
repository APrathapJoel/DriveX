import { auth } from '../auth';
import { router } from '../router';
import { showToast } from '../toast';

export function renderLoginPage(): string {
  return `
    <main class="page-enter auth-page">
      <div class="auth-container">
        <div class="auth-card card animate-scale-in">
          <div class="auth-header">
            <a href="/" data-link class="logo" style="justify-content:center;">
              <img src="/driver-logo-badge.png" alt="DriveR" class="logo-img" style="height:44px;" />
            </a>
            <h1 class="auth-title">Welcome back</h1>
            <p class="auth-subtitle">Log in to your DriveR account</p>
          </div>

          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label class="form-label" for="login-email">Email</label>
              <input type="email" class="form-input" id="login-email" placeholder="you@example.com" required autocomplete="email"/>
            </div>
            <div class="form-group">
              <label class="form-label" for="login-password">Password</label>
              <input type="password" class="form-input" id="login-password" placeholder="••••••••" required autocomplete="current-password"/>
            </div>
            <button type="submit" class="btn btn-primary btn-lg" id="login-submit" style="width:100%;">
              Log in
            </button>
          </form>

          <div class="auth-footer">
            <p>Don't have an account? <a href="/register" data-link class="auth-link">Sign up</a></p>
          </div>

          <div class="auth-demo">
            <p class="auth-demo-title">Demo Accounts</p>
            <button class="auth-demo-btn" data-email="admin@driver.com" data-password="admin123">
              👑 Admin — admin@driver.com
            </button>
            <button class="auth-demo-btn" data-email="rahul@example.com" data-password="customer123">
              👤 Customer — rahul@example.com
            </button>
          </div>
        </div>
      </div>
    </main>
  `;
}

export function renderRegisterPage(): string {
  return `
    <main class="page-enter auth-page">
      <div class="auth-container">
        <div class="auth-card card animate-scale-in">
          <div class="auth-header">
            <a href="/" data-link class="logo" style="justify-content:center;">
              <img src="/driver-logo-badge.png" alt="DriveR" class="logo-img" style="height:44px;" />
            </a>
            <h1 class="auth-title">Create account</h1>
            <p class="auth-subtitle">Start your journey with DriveR</p>
          </div>

          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label class="form-label" for="reg-name">Full Name</label>
              <input type="text" class="form-input" id="reg-name" placeholder="John Doe" required/>
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-email">Email</label>
              <input type="email" class="form-input" id="reg-email" placeholder="you@example.com" required autocomplete="email"/>
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-phone">Phone (optional)</label>
              <input type="tel" class="form-input" id="reg-phone" placeholder="+91 9876543210"/>
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-password">Password</label>
              <input type="password" class="form-input" id="reg-password" placeholder="Min 6 characters" required minlength="6" autocomplete="new-password"/>
            </div>
            <button type="submit" class="btn btn-primary btn-lg" id="register-submit" style="width:100%;">
              Create Account
            </button>
          </form>

          <div class="auth-footer">
            <p>Already have an account? <a href="/login" data-link class="auth-link">Log in</a></p>
          </div>
        </div>
      </div>
    </main>
  `;
}

export function initLoginPage() {
  const form = document.getElementById('login-form') as HTMLFormElement;
  const submitBtn = document.getElementById('login-submit')!;

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;

    submitBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-top-color:white;"></div>';
    submitBtn.setAttribute('disabled', 'true');

    try {
      await auth.login(email, password);
      showToast('Welcome back! 👋', 'success');
      router.navigate('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      submitBtn.innerHTML = 'Log in';
      submitBtn.removeAttribute('disabled');
    }
  });

  // Demo account buttons
  document.querySelectorAll('.auth-demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = (btn as HTMLElement).dataset.email!;
      const password = (btn as HTMLElement).dataset.password!;
      (document.getElementById('login-email') as HTMLInputElement).value = email;
      (document.getElementById('login-password') as HTMLInputElement).value = password;
    });
  });
}

export function initRegisterPage() {
  const form = document.getElementById('register-form') as HTMLFormElement;
  const submitBtn = document.getElementById('register-submit')!;

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.getElementById('reg-name') as HTMLInputElement).value;
    const email = (document.getElementById('reg-email') as HTMLInputElement).value;
    const phone = (document.getElementById('reg-phone') as HTMLInputElement).value;
    const password = (document.getElementById('reg-password') as HTMLInputElement).value;

    submitBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-top-color:white;"></div>';
    submitBtn.setAttribute('disabled', 'true');

    try {
      await auth.register(name, email, password, phone || undefined);
      showToast('Account created! Welcome to DriveR 🎉', 'success');
      router.navigate('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      submitBtn.innerHTML = 'Create Account';
      submitBtn.removeAttribute('disabled');
    }
  });
}
