/* ============================================
   Shared UI helpers & icon SVGs
   ============================================ */

export function renderStars(rating: number, size = 14): string {
  let html = '<span class="stars">';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><defs><linearGradient id="half"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="var(--gray-700)"/></linearGradient></defs><path fill="url(#half)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    } else {
      html += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="var(--gray-700)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    }
  }
  html += '</span>';
  return html;
}

export function formatPrice(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusBadge(status: string): string {
  const map: Record<string, { class: string; label: string }> = {
    pending: { class: 'badge-warning', label: 'Pending' },
    confirmed: { class: 'badge-primary', label: 'Confirmed' },
    active: { class: 'badge-success', label: 'Active' },
    completed: { class: 'badge-success', label: 'Completed' },
    cancelled: { class: 'badge-error', label: 'Cancelled' },
    rejected: { class: 'badge-error', label: 'Rejected' },
    successful: { class: 'badge-success', label: 'Paid' },
    failed: { class: 'badge-error', label: 'Failed' },
    refunded: { class: 'badge-neutral', label: 'Refunded' },
  };
  const info = map[status] || { class: 'badge-neutral', label: status };
  return `<span class="badge ${info.class}">${info.label}</span>`;
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    hatchback: '🚗',
    sedan: '🚙',
    suv: '🚘',
    muv: '🚐',
    coupe: '🏎️',
    convertible: '🏎️',
    luxury: '✨',
    sports: '🏁',
    electric: '⚡',
  };
  return icons[category] || '🚗';
}

export function getVehicleImageUrl(images: string[]): string {
  // For seed data, we generate a gradient placeholder based on hash
  if (!images || images.length === 0 || images[0].includes('placeholder')) {
    return '';
  }
  return images[0].startsWith('http') ? images[0] : `http://localhost:5000${images[0]}`;
}

export function generateVehicleGradient(brand: string, category: string): string {
  const b = (brand || '').toLowerCase();
  if (b.includes('porsche')) return 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #ea580c 100%)';
  if (b.includes('bmw')) return 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)';
  if (b.includes('mercedes')) return 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #52525b 100%)';
  if (b.includes('audi')) return 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #6366f1 100%)';
  if (b.includes('land rover') || b.includes('force')) return 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #059669 100%)';
  if (b.includes('mustang') || b.includes('ford')) return 'linear-gradient(135deg, #450a0a 0%, #991b1b 50%, #dc2626 100%)';
  if (b.includes('jeep') || (b.includes('mahindra') && category === 'suv')) return 'linear-gradient(135deg, #422006 0%, #713f12 50%, #a16207 100%)';

  const gradients: Record<string, string> = {
    hatchback: 'linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #818cf8 100%)',
    sedan: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #6366f1 100%)',
    suv: 'linear-gradient(135deg, #0f172a 0%, #0369a1 50%, #0ea5e9 100%)',
    muv: 'linear-gradient(135deg, #064e3b 0%, #0f766e 50%, #14b8a6 100%)',
    coupe: 'linear-gradient(135deg, #4c0519 0%, #9f1239 50%, #f43f5e 100%)',
    convertible: 'linear-gradient(135deg, #701a75 0%, #a21caf 50%, #e879f9 100%)',
    luxury: 'linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #d97706 100%)',
    sports: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #ef4444 100%)',
    electric: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #38bdf8 100%)',
  };
  return gradients[category] || gradients.sedan;
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
