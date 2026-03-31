/* =====================================================
   PIXELVAULT — Cart Page JS
   cart.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const { Cart, CartBadge } = window.PixelVault;

  const cartItemsList = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty-state');
  const cartLayout = document.getElementById('cart-layout');
  const cartCountEl = document.getElementById('cart-item-count');
  const subtotalEl = document.getElementById('order-subtotal');
  const discountEl = document.getElementById('order-discount');
  const totalEl = document.getElementById('order-total');
  const promoInput = document.getElementById('promo-input');
  const promoApply = document.getElementById('promo-apply');
  const clearCartBtn = document.getElementById('clear-cart-btn');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Promo codes
  const PROMO_CODES = {
    'PIXEL20': 0.20,
    'VAULT10': 0.10,
    'FIRST50': 0.50,
    'CREATIVE': 0.15,
  };
  let activePromo = null;

  function renderCart() {
    const items = Cart.getItems();

    if (!cartItemsList) return;

    if (items.length === 0) {
      if (cartLayout) cartLayout.style.display = 'none';
      if (emptyState) emptyState.style.display = 'flex';
      updateSummary(items);
      return;
    }

    if (cartLayout) cartLayout.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';

    cartItemsList.innerHTML = items.map(item => `
      <div class="cart-item" data-item-id="${item.id}">
        <div class="cart-item-thumb" style="background: linear-gradient(135deg, var(--bg-elevated), var(--border-medium));">
          <span style="font-size:28px">${item.emoji || '🖼️'}</span>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-creator">by ${item.creator || 'PixelVault Creator'}</div>
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:4px;">
            <span class="badge badge-accent" style="font-size:10px;">📁 ${item.category || 'Digital Asset'}</span>
            <select class="cart-item-license">
              <option value="personal" ${item.license === 'personal' ? 'selected' : ''}>Personal License</option>
              <option value="commercial" ${item.license === 'commercial' ? 'selected' : ''}>Commercial License (+$10)</option>
              <option value="extended" ${item.license === 'extended' ? 'selected' : ''}>Extended License (+$35)</option>
            </select>
          </div>
        </div>
        <div class="cart-item-actions">
          <span class="text-price" style="font-size:18px;">$${(item.price * (item.qty || 1)).toFixed(2)}</span>
          <div class="qty-stepper">
            <button class="qty-btn" data-qty-dec>−</button>
            <span class="qty-value">${item.qty || 1}</span>
            <button class="qty-btn" data-qty-inc>+</button>
          </div>
          <button class="remove-btn" data-remove title="Remove item">🗑</button>
        </div>
      </div>
    `).join('');

    // Bind events
    cartItemsList.querySelectorAll('[data-item-id]').forEach(itemEl => {
      const id = itemEl.dataset.itemId;

      itemEl.querySelector('[data-qty-dec]')?.addEventListener('click', () => {
        const item = Cart.getItems().find(i => i.id === id);
        if (item) Cart.setQty(id, (item.qty || 1) - 1);
        renderCart();
      });

      itemEl.querySelector('[data-qty-inc]')?.addEventListener('click', () => {
        const item = Cart.getItems().find(i => i.id === id);
        if (item) Cart.setQty(id, (item.qty || 1) + 1);
        renderCart();
      });

      itemEl.querySelector('[data-remove]')?.addEventListener('click', () => {
        const card = itemEl;
        card.style.animation = 'fadeUp 0.2s ease reverse forwards';
        setTimeout(() => {
          Cart.removeItem(id);
          renderCart();
        }, 180);
      });

      const licenseSelect = itemEl.querySelector('.cart-item-license');
      licenseSelect?.addEventListener('change', () => {
        // Update price based on license (simplified)
        const items = Cart.getItems();
        const idx = items.findIndex(i => i.id === id);
        if (idx >= 0) {
          const extra = licenseSelect.value === 'commercial' ? 10
                      : licenseSelect.value === 'extended'   ? 35 : 0;
          items[idx].license = licenseSelect.value;
          items[idx].licenseExtra = extra;
          localStorage.setItem('pv-cart', JSON.stringify(items));
          updateSummary(Cart.getItems());
        }
      });
    });

    if (cartCountEl) cartCountEl.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;

    updateSummary(items);
  }

  function updateSummary(items) {
    const subtotal = items.reduce((s, i) => {
      const extra = i.licenseExtra || 0;
      return s + ((i.price + extra) * (i.qty || 1));
    }, 0);

    const discount = activePromo ? subtotal * PROMO_CODES[activePromo] : 0;
    const total = subtotal - discount;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (discountEl) {
      discountEl.textContent = discount > 0 ? `-$${discount.toFixed(2)}` : '$0.00';
      discountEl.style.color = discount > 0 ? '#34D399' : '';
    }
    if (totalEl) {
      totalEl.textContent = `$${total.toFixed(2)}`;
      // Store for payment page
      sessionStorage.setItem('pv-order-total', total.toFixed(2));
    }
  }

  // Promo code
  if (promoApply) {
    promoApply.addEventListener('click', () => {
      const code = promoInput?.value.trim().toUpperCase();
      if (!code) return;

      if (PROMO_CODES[code]) {
        activePromo = code;
        promoApply.textContent = '✓ Applied!';
        promoApply.style.color = '#34D399';
        promoApply.style.borderColor = '#34D399';
        if (promoInput) promoInput.style.borderColor = '#34D399';
        updateSummary(Cart.getItems());
      } else {
        promoApply.textContent = '✗ Invalid';
        promoApply.style.color = 'var(--accent-coral)';
        setTimeout(() => {
          promoApply.textContent = 'Apply';
          promoApply.style.color = '';
        }, 1500);
      }
    });
  }

  // Clear cart
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm('Clear all items from cart?')) {
        Cart.clearCart();
        renderCart();
      }
    });
  }

  // Checkout
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const items = Cart.getItems();
      if (items.length === 0) return;
      window.location.href = 'payment.html';
    });
  }

  // Initial render
  renderCart();
});
