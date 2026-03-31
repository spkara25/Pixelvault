/* =====================================================
   PIXELVAULT — Main JS
   Theme toggle, navbar scroll, search overlay,
   cart badge, micro-interactions
   ===================================================== */

// ─── Theme ────────────────────────────────────────────
const ThemeManager = (() => {
  const STORAGE_KEY = 'pv-theme';
  const root = document.documentElement;

  function getStored() {
    return localStorage.getItem(STORAGE_KEY) || 'dark';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    document.querySelectorAll('[data-theme-icon]').forEach(el => {
      el.textContent = theme === 'dark' ? '🌙' : '☀️';
    });
  }

  function toggle() {
    const current = root.getAttribute('data-theme') || 'dark';
    apply(current === 'dark' ? 'light' : 'dark');
  }

  function init() {
    apply(getStored());
    document.querySelectorAll('[data-theme-toggle]').forEach(el => {
      el.addEventListener('click', toggle);
    });
  }

  return { init, toggle, apply, get: getStored };
})();

// ─── Navbar Scroll ────────────────────────────────────
const NavbarManager = (() => {
  function init() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const onScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  return { init };
})();

// ─── Cart State ────────────────────────────────────────
const Cart = (() => {
  const STORAGE_KEY = 'pv-cart';

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function getItems() { return load(); }

  function getCount() {
    return load().reduce((s, i) => s + (i.qty || 1), 0);
  }

  function getTotal() {
    return load().reduce((s, i) => s + (i.price * (i.qty || 1)), 0);
  }

  function addItem(item) {
    const items = load();
    const idx = items.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      items[idx].qty = (items[idx].qty || 1) + 1;
    } else {
      items.push({ ...item, qty: 1 });
    }
    save(items);
    CartBadge.update();
    showAddedToast(item.title);
  }

  function removeItem(id) {
    const items = load().filter(i => i.id !== id);
    save(items);
    CartBadge.update();
  }

  function setQty(id, qty) {
    if (qty < 1) { removeItem(id); return; }
    const items = load();
    const idx = items.findIndex(i => i.id === id);
    if (idx >= 0) { items[idx].qty = qty; save(items); CartBadge.update(); }
  }

  function clearCart() {
    save([]);
    CartBadge.update();
  }

  return { getItems, getCount, getTotal, addItem, removeItem, setQty, clearCart };
})();

// ─── Cart Badge ────────────────────────────────────────
const CartBadge = (() => {
  function update() {
    const count = Cart.getCount();
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
      // Bounce animation
      badge.classList.remove('bounce');
      badge.offsetWidth; // reflow
      badge.classList.add('bounce');
      setTimeout(() => badge.classList.remove('bounce'), 400);
    });
  }
  return { update };
})();

// ─── Toast Notification ────────────────────────────────
function showAddedToast(title) {
  let toast = document.getElementById('pv-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'pv-toast';
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: var(--bg-surface); border: 1px solid var(--border-subtle);
      border-radius: 12px; padding: 14px 20px; box-shadow: var(--shadow-lg);
      display: flex; align-items: center; gap: 12px; z-index: 500;
      font-family: var(--font-body); font-size: 14px; font-weight: 500;
      color: var(--text-primary); min-width: 260px; justify-content: center;
      opacity: 0; transition: opacity 0.2s ease, transform 0.2s ease;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  const shortTitle = title.length > 28 ? title.slice(0, 28) + '…' : title;
  toast.innerHTML = `<span style="font-size:18px">✓</span> <span style="color:#34D399;font-weight:700">Added!</span> &nbsp;<span style="color:var(--text-secondary)">${shortTitle}</span>`;

  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(8px)';
  }, 2000);
}

// ─── Search Overlay ────────────────────────────────────
const SearchOverlay = (() => {
  let overlay, input, isOpen = false;

  function open() {
    overlay = document.getElementById('search-overlay');
    if (!overlay) return;
    overlay.classList.add('open');
    isOpen = true;
    document.body.style.overflow = 'hidden';
    input = overlay.querySelector('.search-main-input');
    if (input) setTimeout(() => input.focus(), 150);
  }

  function close() {
    overlay = document.getElementById('search-overlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    isOpen = false;
    document.body.style.overflow = '';
  }

  function toggle() { isOpen ? close() : open(); }

  function init() {
    // Search trigger buttons
    document.querySelectorAll('[data-search-open]').forEach(el => {
      el.addEventListener('click', open);
    });

    // Close on backdrop click
    const overlay = document.getElementById('search-overlay');
    if (!overlay) return;

    const backdrop = overlay.querySelector('.search-backdrop');
    if (backdrop) backdrop.addEventListener('click', close);

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) close();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
    });

    // Chip click
    overlay.querySelectorAll('.search-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const input = overlay.querySelector('.search-main-input');
        if (input) { input.value = chip.textContent; input.focus(); }
      });
    });
  }

  return { init, open, close };
})();

// ─── Add to Cart Buttons ───────────────────────────────
function initAddToCartButtons() {
  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest('[data-asset-id]');
      if (!card) return;

      const item = {
        id: card.dataset.assetId,
        title: card.dataset.assetTitle || 'Asset',
        price: parseFloat(card.dataset.assetPrice) || 0,
        category: card.dataset.assetCategory || '',
        emoji: card.dataset.assetEmoji || '🖼️',
      };

      Cart.addItem(item);

      // Button state
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span>✓</span> Added';
      btn.style.background = '#34D399';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 1500);
    });
  });
}

// ─── Category Chip Active State ────────────────────────
function initCategoryChips() {
  document.querySelectorAll('.cat-chip[data-cat]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
}

// ─── Navbar Cat Pill Active ────────────────────────────
function initNavCatPills() {
  document.querySelectorAll('.navbar-cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.navbar-cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

// ─── Parallax Hero Bento ──────────────────────────────
function initParallax() {
  const bentoCards = document.querySelectorAll('.bento-card');
  if (!bentoCards.length) return;

  const factors = [0.015, -0.01, 0.012, -0.008, 0.018];

  window.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    bentoCards.forEach((card, i) => {
      const f = factors[i] || 0.01;
      card.style.transform = `translate(${dx * 15 * f * 100}px, ${dy * 10 * f * 100}px)`;
    });
  }, { passive: true });
}

// ─── Scroll Reveal ────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards';
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ─── Trending Carousel ────────────────────────────────
function initCarousel(carouselEl) {
  if (!carouselEl) return;

  const track = carouselEl.querySelector('.carousel-track');
  const prevBtn = carouselEl.querySelector('.carousel-nav-prev');
  const nextBtn = carouselEl.querySelector('.carousel-nav-next');
  if (!track) return;

  let position = 0;
  const STEP = 320; // card width + gap

  const getMax = () => {
    const items = track.querySelectorAll('.carousel-item');
    const trackWidth = track.scrollWidth;
    const wrapWidth = track.parentElement.offsetWidth;
    return Math.max(0, trackWidth - wrapWidth);
  };

  function update() {
    const max = getMax();
    position = Math.max(0, Math.min(position, max));
    track.style.transform = `translateX(-${position}px)`;
    if (prevBtn) prevBtn.disabled = position <= 0;
    if (nextBtn) nextBtn.disabled = position >= max;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { position -= STEP; update(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { position += STEP; update(); });

  update();
}

// ─── Quick View ────────────────────────────────────────
function initQuickView() {
  const modal = document.getElementById('quick-view-modal');
  if (!modal) return;

  const backdrop = modal.querySelector('.quick-view-backdrop');
  const closeBtn = modal.querySelector('.quick-view-close');

  function openModal(assetData) {
    const content = modal.querySelector('#qv-content');
    if (content && assetData) {
      content.querySelector('#qv-emoji').textContent = assetData.emoji || '🖼️';
      content.querySelector('#qv-title').textContent = assetData.title || '';
      content.querySelector('#qv-category').textContent = assetData.category || '';
      content.querySelector('#qv-price').textContent = `$${assetData.price || 0}`;
      content.querySelector('#qv-creator').textContent = assetData.creator || '';
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  document.querySelectorAll('[data-quick-view]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('[data-asset-id]');
      if (card) {
        openModal({
          id: card.dataset.assetId,
          title: card.dataset.assetTitle,
          price: card.dataset.assetPrice,
          category: card.dataset.assetCategory,
          emoji: card.dataset.assetEmoji,
          creator: card.dataset.assetCreator,
        });
      }
    });
  });
}

// ─── Mobile Nav Active ────────────────────────────────
function initMobileNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.mobile-nav-item[data-page]').forEach(item => {
    const page = item.dataset.page;
    if (path.includes(page) || (page === 'home' && (path === '/' || path.endsWith('index.html')))) {
      item.classList.add('active');
    }
  });
}

// ─── Init All ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  NavbarManager.init();
  CartBadge.update();
  SearchOverlay.init();
  initAddToCartButtons();
  initCategoryChips();
  initNavCatPills();
  initParallax();
  initScrollReveal();
  initQuickView();
  initMobileNav();

  // Carousels
  document.querySelectorAll('[data-carousel]').forEach(el => initCarousel(el));
});

// Export for use in other scripts
window.PixelVault = { Cart, CartBadge, ThemeManager };
