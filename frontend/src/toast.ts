/* ============================================
   Toast notification system
   ============================================ */

type ToastType = 'success' | 'error' | 'warning' | 'info';

let container: HTMLDivElement | null = null;

function getContainer(): HTMLDivElement {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

const icons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export function showToast(message: string, type: ToastType = 'info', duration = 4000) {
  const c = getContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon" style="font-size:16px;font-weight:bold;">${icons[type]}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close">✕</button>
  `;

  const closeBtn = toast.querySelector('.toast-close')!;
  const removeToast = () => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  };

  closeBtn.addEventListener('click', removeToast);

  c.appendChild(toast);

  if (duration > 0) {
    setTimeout(removeToast, duration);
  }
}
