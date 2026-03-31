/* =====================================================
   PIXELVAULT — Payment Page JS
   Live card preview, floating labels, tabs, submit
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Order Summary from session ────────────────────
  const orderTotalEl = document.getElementById('payment-order-total');
  const storedTotal = sessionStorage.getItem('pv-order-total') || '0.00';
  if (orderTotalEl) orderTotalEl.textContent = `$${storedTotal}`;

  const summaryItemsEl = document.getElementById('payment-summary-items');
  if (summaryItemsEl && window.PixelVault) {
    const items = window.PixelVault.Cart.getItems();
    summaryItemsEl.innerHTML = items.map(item => `
      <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;">
        <span style="color:var(--text-secondary);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          ${item.emoji || '🖼️'} ${item.title}
        </span>
        <span style="font-family:var(--font-mono);color:var(--text-primary);">$${(item.price * (item.qty||1)).toFixed(2)}</span>
      </div>
    `).join('');
  }

  // ─── Live Credit Card Preview ───────────────────────
  const cardPreview = document.getElementById('card-preview');
  const cardNumberDisplay = document.getElementById('card-number-display');
  const cardNameDisplay = document.getElementById('card-name-display');
  const cardExpiryDisplay = document.getElementById('card-expiry-display');
  const cardCvvDisplay = document.getElementById('card-cvv-display');
  const cardNetworkDisplay = document.getElementById('card-network');

  const numberInput = document.getElementById('card-number-input');
  const nameInput = document.getElementById('card-name-input');
  const expiryInput = document.getElementById('card-expiry-input');
  const cvvInput = document.getElementById('card-cvv-input');

  // Format card number with spaces every 4 digits
  if (numberInput) {
    numberInput.addEventListener('input', e => {
      let val = e.target.value.replace(/\D/g, '').slice(0, 16);
      e.target.value = val.replace(/(.{4})/g, '$1 ').trim();

      const display = val.padEnd(16, '•');
      if (cardNumberDisplay) {
        cardNumberDisplay.textContent = [
          display.slice(0,4),
          display.slice(4,8),
          display.slice(8,12),
          display.slice(12,16)
        ].join(' ');
      }

      // Detect card network
      if (cardNetworkDisplay) {
        if (val.startsWith('4')) cardNetworkDisplay.textContent = '💳 Visa';
        else if (val.startsWith('5') || val.startsWith('2')) cardNetworkDisplay.textContent = '💳 MC';
        else if (val.startsWith('3')) cardNetworkDisplay.textContent = '💳 Amex';
        else cardNetworkDisplay.textContent = '💳';
      }
    });
  }

  if (nameInput) {
    nameInput.addEventListener('input', e => {
      const val = e.target.value.toUpperCase() || 'FULL NAME';
      if (cardNameDisplay) cardNameDisplay.textContent = val.slice(0, 22);
    });
  }

  if (expiryInput) {
    expiryInput.addEventListener('input', e => {
      let val = e.target.value.replace(/\D/g, '').slice(0, 4);
      if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
      e.target.value = val;
      if (cardExpiryDisplay) cardExpiryDisplay.textContent = val || 'MM/YY';
    });
  }

  // CVV flip
  if (cvvInput) {
    cvvInput.addEventListener('focus', () => {
      if (cardPreview) cardPreview.classList.add('flipped');
    });
    cvvInput.addEventListener('blur', () => {
      if (cardPreview) cardPreview.classList.remove('flipped');
    });
    cvvInput.addEventListener('input', e => {
      let val = e.target.value.replace(/\D/g, '').slice(0, 4);
      e.target.value = val;
      if (cardCvvDisplay) cardCvvDisplay.textContent = val.replace(/./g, '•') || '•••';
    });
  }

  // ─── Payment Method Tabs ────────────────────────────
  const payTabs = document.querySelectorAll('.pay-tab');
  const cardSection = document.getElementById('card-section');
  const altPaySection = document.getElementById('alt-pay-section');

  payTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      payTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const method = tab.dataset.method;
      if (cardSection) cardSection.style.display = method === 'card' ? 'block' : 'none';
      if (altPaySection) altPaySection.style.display = method !== 'card' ? 'block' : 'none';

      if (altPaySection && method !== 'card') {
        const icons = { paypal: '₿', upi: '🇮🇳', netbanking: '🏦' };
        const labels = { paypal: 'PayPal', upi: 'UPI', netbanking: 'Net Banking' };
        altPaySection.innerHTML = `
          <div style="text-align:center;padding:32px 0;color:var(--text-secondary);">
            <div style="font-size:48px;margin-bottom:16px;">${icons[method] || '💰'}</div>
            <div style="font-size:16px;font-weight:600;margin-bottom:8px;">Pay with ${labels[method] || method}</div>
            <div style="font-size:13px;max-width:260px;margin:0 auto;">
              You'll be redirected to ${labels[method] || method} to complete your payment securely.
            </div>
          </div>
        `;
      }
    });
  });

  // ─── Order Summary Toggle ───────────────────────────
  const summaryToggle = document.getElementById('summary-toggle');
  const summaryCollapsed = document.getElementById('summary-collapsed');
  const summaryArrow = document.getElementById('summary-arrow');

  if (summaryToggle) {
    summaryToggle.addEventListener('click', () => {
      summaryCollapsed?.classList.toggle('open');
      if (summaryArrow) {
        summaryArrow.style.transform = summaryCollapsed?.classList.contains('open')
          ? 'rotate(180deg)' : '';
      }
    });
  }

  // ─── Form Validation ────────────────────────────────
  const form = document.getElementById('payment-form');
  const submitBtn = document.getElementById('submit-btn');
  const successModal = document.getElementById('success-modal');

  // Generate random order ID
  function generateOrderId() {
    return 'PV-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Show loading
      submitBtn?.classList.add('loading');

      // Simulate API call
      await new Promise(r => setTimeout(r, 2000));

      submitBtn?.classList.remove('loading');

      // Show success
      if (successModal) {
        successModal.classList.add('open');
        const orderIdEl = document.getElementById('success-order-id');
        if (orderIdEl) orderIdEl.textContent = generateOrderId();

        // Clear cart
        if (window.PixelVault) window.PixelVault.Cart.clearCart();
      }
    });
  }

  // ─── Success Modal ──────────────────────────────────
  if (successModal) {
    const closeModal = () => {
      successModal.classList.remove('open');
      window.location.href = 'index.html';
    };

    successModal.querySelector('.success-modal-backdrop')?.addEventListener('click', closeModal);
    document.getElementById('success-continue')?.addEventListener('click', closeModal);
  }

  // ─── Progress Steps ─────────────────────────────────
  // Mark "Cart" as completed, "Payment" as active
  const steps = document.querySelectorAll('.progress-step');
  if (steps.length >= 2) {
    steps[0].classList.add('completed');
    steps[1].classList.add('active');
  }

  // ─── Floating Labels ────────────────────────────────
  // Already handled via CSS :focus and :not(:placeholder-shown)
  // Add placeholder=" " to all float inputs for CSS trick
  document.querySelectorAll('.float-input').forEach(input => {
    if (!input.getAttribute('placeholder')) {
      input.setAttribute('placeholder', ' ');
    }
  });
});
