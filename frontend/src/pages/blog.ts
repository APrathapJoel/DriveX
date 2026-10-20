import { showToast } from '../toast';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  icon: string;
  gradient: string;
}

const POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Ultimate Western Ghats Road Trip: Coimbatore through Ooty, Valparai & Munnar',
    category: 'Road Trips',
    readTime: '6 min read',
    date: 'March 15, 2026',
    author: 'Prathap Joel',
    excerpt: 'Starting from DriveR headquarters in Coimbatore, explore the misty hairpins of Valparai, tea gardens of Munnar, and the scenic heights of the Nilgiris.',
    content: `
      <p>Coimbatore, fondly celebrated as the gateway to the Nilgiris and Anamalai ranges, is the ultimate launchpad for unforgettable driving expeditions. When we designed DriveR, one of our driving inspirations was to hand people keys to vehicles capable of mastering both steep hairpin ascents and long scenic stretches.</p>
      <h3 style="color:var(--text-primary); margin:var(--space-4) 0 var(--space-2);">The Route Breakdown</h3>
      <p><strong>Leg 1: Coimbatore to Valparai (105 km)</strong> — Passing through Pollachi and traversing the famous 40 hairpin bends. A responsive SUV like the Mahindra Thar or Toyota Fortuner ensures total confidence through misty curves.</p>
      <p><strong>Leg 2: Valparai to Athirappilly & Munnar</strong> — Dense rainforest trails, cascading waterfalls, and emerald tea estates where early morning drives feel otherworldly.</p>
      <p><strong>Leg 3: Return via Udumalpet</strong> — Broad highways with mountain views, perfect for engaging cruise control and soaking in the panorama.</p>
      <div class="legal-box" style="margin:var(--space-4) 0;">
        💡 <strong>Pro Tip from DriveR:</strong> Check tyre pressures and brake wear before climbing. All DriveR vehicles undergo a thorough 120-point mechanical check specifically certified for hill driving.
      </div>
    `,
    icon: '🌄',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
  },
  {
    id: 'post-2',
    title: 'Electric Vehicles for Long Distance Road Trips: Reality vs Myths',
    category: 'Electric Mobility',
    readTime: '5 min read',
    date: 'March 02, 2026',
    author: 'DriveR Engineering',
    excerpt: 'Can you really rent an EV for an interstate journey? We put the Tata Nexon EV through 500 km of Southern highways to find out.',
    content: `
      <p>Range anxiety has historically been the primary hesitation for drivers considering electric rentals. With fast-charging hubs now dotting National Highway 544 between Coimbatore, Salem, and Bengaluru, that narrative has shifted completely.</p>
      <p>During our 500 km test loop with DriveR's connected Nexon EV fleet, fast chargers were accessible every 45 kilometers. A 30-minute coffee stop at a highway food court was all it took to replenish the battery from 20% to 80%.</p>
      <p>Combined with whisper-quiet cabin acoustics, instantaneous electric torque, and zero tailpipe emissions, EV rentals are proving to be the smartest choice for modern road travelers.</p>
    `,
    icon: '⚡',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
  },
  {
    id: 'post-3',
    title: 'Top 7 Pre-Trip Safety Checks Before Hitting the National Highways',
    category: 'Car Tips',
    readTime: '4 min read',
    date: 'February 20, 2026',
    author: 'DriveR Fleet Team',
    excerpt: 'Whether you are driving your personal car or a DriveR rental, here is our essential checklist to ensure a hassle-free vacation.',
    content: `
      <p>A great journey begins long before you turn the ignition key. Our Coimbatore fleet technicians inspect hundreds of vehicles weekly and recommend every driver observe these 7 golden rules:</p>
      <ol>
        <li><strong>Cold Tyre Pressure & Tread Depth:</strong> Underinflated tyres drastically reduce highway fuel efficiency and increase blowout risks.</li>
        <li><strong>Fluid Levels:</strong> Engine oil, coolant, and wiper fluid topped with anti-freeze wash.</li>
        <li><strong>Brake Pad Bite & Rotor Smoothness:</strong> Essential when driving at sustained highway speeds.</li>
        <li><strong>Headlamp Alignment:</strong> Crisp high-beam and fog-lamp visibility for late evening drives.</li>
        <li><strong>Emergency Toolkit & Jack:</strong> Verified presence and functionality in the boot.</li>
      </ol>
    `,
    icon: '🔧',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)',
  },
  {
    id: 'post-4',
    title: 'The Rise of Self-Drive Culture in India: Why Flexibility Wins',
    category: 'DriveR Stories',
    readTime: '4 min read',
    date: 'February 08, 2026',
    author: 'Prathap Joel',
    excerpt: 'Why modern Indian travelers are choosing self-drive freedom over rigid itineraries, chauffeured cabs, or public transit.',
    content: `
      <p>Travel has evolved from reaching a destination to owning the spontaneity along the way. In the past, renting a car meant navigating cumbersome paperwork, dealing with opaque security deposits, and settling for uninspected older vehicles.</p>
      <p>DriveR was created to shatter that friction. With instant smartphone KYC verification, spotless cars delivered to your doorstep, and 24/7 roadside protection, self-drive rentals offer unmatched privacy, flexibility, and pride of ownership.</p>
    `,
    icon: '🚗',
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
  },
  {
    id: 'post-5',
    title: 'Automatic vs Manual: What is Best for South Indian Terrain?',
    category: 'Car Tips',
    readTime: '5 min read',
    date: 'January 28, 2026',
    author: 'DriveR Fleet Team',
    excerpt: 'Comparing dual-clutch automatics, CVTs, and trusty manuals across ghat climbs, highway corridors, and city traffic.',
    content: `
      <p>One of the most frequent questions our customer support team in Coimbatore receives is: "Should I rent an automatic or a manual for my trip?"</p>
      <p>For stop-and-go city traffic and long highway cruising, automatics (like the Honda City CVT or BMW 3-Series Steptronic) dramatically reduce driver fatigue. However, enthusiasts heading up hill stations often love the mechanical control of a 6-speed manual in a Thar or Swift. DriveR offers both options across every category!</p>
    `,
    icon: '⚙️',
    gradient: 'linear-gradient(135deg, #831843 0%, #be185d 100%)',
  },
  {
    id: 'post-6',
    title: 'DriveR IoT Telematics: How Connected Cars Protect You',
    category: 'DriveR Stories',
    readTime: '6 min read',
    date: 'January 14, 2026',
    author: 'DriveR Engineering',
    excerpt: 'A deep dive into how onboard telematics sensors monitor fleet health and dispatch emergency roadside assistance in seconds.',
    content: `
      <p>Every vehicle in the DriveR fleet is equipped with a tamper-proof IoT telemetry unit engineered right at our Coimbatore tech lab. This system operates discreetly in the background, safeguarding vehicle health and driver security without compromising personal privacy.</p>
      <p>From automated puncture warnings and battery health telemetry to an emergency SOS dispatch when airbag deployment is detected, technology is our silent co-pilot on every trip.</p>
    `,
    icon: '📡',
    gradient: 'linear-gradient(135deg, #134e4a 0%, #0d9488 100%)',
  },
];

export function renderBlogPage(): string {
  const featured = POSTS[0];
  const rest = POSTS.slice(1);

  return `
    <main class="page-enter">
      <!-- Hero -->
      <section class="info-hero">
        <div class="container">
          <div class="info-hero-badge">
            <span>📰</span> The DriveR Journal
          </div>
          <h1 class="info-hero-title">Stories, Guides & Road Trip Chronicles</h1>
          <p class="info-hero-subtitle">
            Curated scenic routes, automotive advice, and platform announcements brought to you by our Coimbatore mobility team.
          </p>
        </div>
      </section>

      <!-- Featured Article -->
      <section class="info-section" style="padding-bottom:0;">
        <div class="container">
          <div class="blog-featured" id="featured-article" data-post-id="${featured.id}">
            <div class="blog-featured-img" style="background:${featured.gradient};">
              ${featured.icon}
            </div>
            <div class="blog-featured-content">
              <span class="blog-tag">${featured.category}</span>
              <h2 style="font-size:1.75rem; font-weight:800; color:var(--text-primary); margin-bottom:var(--space-3); line-height:1.25;">
                ${featured.title}
              </h2>
              <p style="color:var(--text-secondary); font-size:1rem; line-height:1.6; margin-bottom:var(--space-6);">
                ${featured.excerpt}
              </p>
              <div style="display:flex; justify-content:space-between; align-items:center; color:var(--text-muted); font-size:0.875rem;">
                <span>By ${featured.author} · ${featured.date}</span>
                <span style="color:var(--primary-400); font-weight:600;">${featured.readTime} →</span>
              </div>
            </div>
          </div>

          <!-- Category Filter Bar -->
          <div class="jobs-filter-bar" style="margin: var(--space-8) 0 var(--space-10);">
            <button class="filter-chip active" data-cat="all">All Articles</button>
            <button class="filter-chip" data-cat="Road Trips">Road Trips</button>
            <button class="filter-chip" data-cat="Electric Mobility">Electric Mobility</button>
            <button class="filter-chip" data-cat="Car Tips">Car Care & Safety</button>
            <button class="filter-chip" data-cat="DriveR Stories">DriveR Stories</button>
          </div>

          <!-- Articles Grid -->
          <div class="blog-grid" id="blog-grid-container">
            ${renderBlogCards(rest)}
          </div>
        </div>
      </section>

      <!-- Newsletter Section -->
      <section class="info-section">
        <div class="container">
          <div class="card" style="padding:var(--space-12); max-width:800px; margin:0 auto; text-align:center; background:linear-gradient(135deg, rgba(26,26,37,0.95) 0%, rgba(18,18,26,0.95) 100%); border:1px solid rgba(99,102,241,0.25);">
            <div style="font-size:2.5rem; margin-bottom:var(--space-3);">📬</div>
            <h3 style="font-size:1.75rem; font-weight:700; color:var(--text-primary); margin-bottom:var(--space-2);">
              Stay in the Driver's Seat
            </h3>
            <p style="color:var(--text-secondary); font-size:1rem; margin-bottom:var(--space-6); max-width:520px; margin-left:auto; margin-right:auto;">
              Subscribe to the DriveR Journal for curated scenic weekend getaways, secret road trip stops, and exclusive seasonal rental promo codes.
            </p>
            <form id="blog-newsletter-form" style="display:flex; gap:var(--space-3); max-width:480px; margin:0 auto; flex-wrap:wrap;">
              <input type="email" class="form-input" id="newsletter-email" required placeholder="Enter your email address" style="flex:1; min-width:240px;"/>
              <button type="submit" class="btn btn-primary" style="white-space:nowrap;">Subscribe →</button>
            </form>
          </div>
        </div>
      </section>

      <!-- Read Modal Container -->
      <div id="blog-modal-container"></div>
    </main>
  `;
}

function renderBlogCards(posts: BlogPost[]): string {
  if (posts.length === 0) {
    return `<div class="empty-state" style="grid-column:1/-1;">No articles found in this category.</div>`;
  }

  return posts.map(post => `
    <div class="blog-card" data-post-id="${post.id}">
      <div class="blog-card-media" style="background:${post.gradient};">
        ${post.icon}
      </div>
      <div class="blog-card-body">
        <span class="blog-tag">${post.category}</span>
        <h3 class="blog-card-title">${post.title}</h3>
        <p class="blog-card-excerpt">${post.excerpt}</p>
        <div class="blog-card-footer">
          <span>${post.date}</span>
          <span style="color:var(--primary-400); font-weight:600;">${post.readTime}</span>
        </div>
      </div>
    </div>
  `).join('');
}

export function initBlogPage() {
  const container = document.getElementById('blog-grid-container');
  const modalContainer = document.getElementById('blog-modal-container');

  // Filter chips click
  document.querySelectorAll('.jobs-filter-bar .filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.jobs-filter-bar .filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat') || 'all';
      const filtered = cat === 'all' ? POSTS.slice(1) : POSTS.slice(1).filter(p => p.category.toLowerCase() === cat.toLowerCase());
      if (container) {
        container.innerHTML = renderBlogCards(filtered);
        attachCardListeners();
      }
    });
  });

  function attachCardListeners() {
    // Featured post click
    document.getElementById('featured-article')?.addEventListener('click', () => {
      const post = POSTS[0];
      if (post && modalContainer) openArticleModal(post, modalContainer);
    });

    // Card clicks
    document.querySelectorAll('.blog-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-post-id');
        const post = POSTS.find(p => p.id === id);
        if (post && modalContainer) openArticleModal(post, modalContainer);
      });
    });
  }

  attachCardListeners();

  // Newsletter form
  document.getElementById('blog-newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('newsletter-email') as HTMLInputElement;
    if (input && input.value) {
      showToast('Thank you for subscribing! Check your inbox soon for travel inspiration.', 'success');
      input.value = '';
    }
  });
}

function openArticleModal(post: BlogPost, modalContainer: HTMLElement) {
  modalContainer.innerHTML = `
    <div class="info-modal-backdrop" id="blog-backdrop">
      <div class="info-modal" style="max-width:760px;">
        <button class="info-modal-close" id="blog-modal-close">&times;</button>
        <span class="blog-tag">${post.category}</span>
        <h1 style="font-size:1.85rem; font-weight:800; color:var(--text-primary); margin:var(--space-2) 0 var(--space-3); line-height:1.25;">
          ${post.title}
        </h1>
        <div style="display:flex; gap:var(--space-3); color:var(--text-muted); font-size:0.875rem; margin-bottom:var(--space-6); border-bottom:1px solid var(--border-default); padding-bottom:var(--space-4);">
          <span>By <strong>${post.author}</strong></span>
          <span>·</span>
          <span>${post.date}</span>
          <span>·</span>
          <span style="color:var(--primary-400);">${post.readTime}</span>
        </div>

        <div style="color:var(--text-secondary); line-height:1.8; font-size:1rem;">
          ${post.content}
        </div>

        <div style="margin-top:var(--space-8); padding-top:var(--space-6); border-top:1px solid var(--border-default); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-4);">
          <div style="font-size:0.875rem; color:var(--text-muted);">
            Published by DriveR Editorial Team · Coimbatore Hub
          </div>
          <button class="btn btn-outline btn-sm" id="close-article-btn">
            Close Article
          </button>
        </div>
      </div>
    </div>
  `;

  const close = () => {
    modalContainer.innerHTML = '';
  };

  document.getElementById('blog-modal-close')?.addEventListener('click', close);
  document.getElementById('close-article-btn')?.addEventListener('click', close);
  document.getElementById('blog-backdrop')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('blog-backdrop')) close();
  });
}
