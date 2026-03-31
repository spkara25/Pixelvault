/* =====================================================
   PIXELVAULT — Category Page JS
   Filter sidebar, sort controls, masonry
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Filter Sidebar Accordion ───────────────────────
  document.querySelectorAll('.filter-section-header').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.closest('.filter-section');
      section.classList.toggle('open');
    });
  });

  // Open first sections by default
  document.querySelectorAll('.filter-section').forEach((section, i) => {
    if (i < 2) section.classList.add('open');
  });

  // ─── Filter Checkboxes ──────────────────────────────
  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', () => {
      const checkbox = option.querySelector('.filter-checkbox');
      if (checkbox) checkbox.classList.toggle('checked');
      filterAssets();
    });
  });

  // ─── Filter Chips ───────────────────────────────────
  document.querySelectorAll('.filter-chip[data-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
    });
  });

  // ─── Sort Controls ──────────────────────────────────
  document.querySelectorAll('.seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sortAssets(btn.dataset.sort);
    });
  });

  // ─── View Toggle ────────────────────────────────────
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const grid = document.getElementById('assets-grid');
      if (!grid) return;

      if (btn.dataset.view === 'list') {
        grid.style.columns = '1';
        grid.querySelectorAll('.asset-card').forEach(card => {
          card.style.display = 'flex';
          card.style.flexDirection = 'row';
          card.style.height = '100px';
        });
      } else {
        grid.style.columns = '';
        grid.querySelectorAll('.asset-card').forEach(card => {
          card.style.display = '';
          card.style.flexDirection = '';
          card.style.height = '';
        });
      }
    });
  });

  // ─── Mobile Filter FAB ──────────────────────────────
  const filterFab = document.getElementById('filter-fab');
  const filterSidebar = document.getElementById('filter-sidebar');
  const filterOverlay = document.getElementById('filter-overlay');

  if (filterFab) {
    filterFab.addEventListener('click', () => {
      filterSidebar?.classList.toggle('mobile-open');
      filterOverlay?.classList.toggle('open');
    });
  }

  if (filterOverlay) {
    filterOverlay.addEventListener('click', () => {
      filterSidebar?.classList.remove('mobile-open');
      filterOverlay.classList.remove('open');
    });
  }

  // ─── Load More ──────────────────────────────────────
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      loadMoreBtn.textContent = 'Loading...';
      loadMoreBtn.disabled = true;

      setTimeout(() => {
        loadMoreBtn.textContent = 'Load More';
        loadMoreBtn.disabled = false;
        // In production, would load more assets via fetch
      }, 1200);
    });
  }

  // ─── Simple Filter Function ─────────────────────────
  function filterAssets() {
    const checkedLabels = Array.from(
      document.querySelectorAll('.filter-checkbox.checked')
    ).map(el => el.closest('.filter-option')?.querySelector('.filter-option-label')?.textContent?.toLowerCase());

    const cards = document.querySelectorAll('.asset-card');
    let shown = 0;

    cards.forEach(card => {
      const category = (card.dataset.assetCategory || '').toLowerCase();
      const visible = checkedLabels.length === 0 || checkedLabels.some(l => category.includes(l));
      card.style.opacity = visible ? '1' : '0.3';
      card.style.pointerEvents = visible ? '' : 'none';
      if (visible) shown++;
    });

    const resultsCount = document.getElementById('results-count');
    if (resultsCount) resultsCount.textContent = shown;
  }

  // ─── Sort Function ──────────────────────────────────
  function sortAssets(sort) {
    const grid = document.getElementById('assets-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.asset-card'));

    cards.sort((a, b) => {
      if (sort === 'price-asc') {
        return parseFloat(a.dataset.assetPrice||0) - parseFloat(b.dataset.assetPrice||0);
      } else if (sort === 'price-desc') {
        return parseFloat(b.dataset.assetPrice||0) - parseFloat(a.dataset.assetPrice||0);
      } else if (sort === 'newest') {
        return parseInt(b.dataset.assetId||0) - parseInt(a.dataset.assetId||0);
      }
      return 0; // popular: default order
    });

    cards.forEach(card => grid.appendChild(card));
  }
});
