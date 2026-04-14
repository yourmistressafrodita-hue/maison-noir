// ============================================
// MAISON NOIR — Application Logic
// ============================================

// ---- Product Data ----
const PRODUCTS = [
  { id: 1, name: 'Silk Draped Blouse', price: 189, category: 'tops', image: './assets/product-1.png', desc: 'A luxurious silk blouse with an elegant draped neckline. The fluid silhouette flatters every figure while the premium silk catches the light beautifully. Perfect for both office and evening wear.', color: 'Ivory', material: '100% Mulberry Silk' },
  { id: 2, name: 'Cashmere Oversized Coat', price: 425, category: 'outerwear', image: './assets/product-2.png', desc: 'Our signature oversized coat in the finest Scottish cashmere. A timeless investment piece with clean lines and a relaxed, modern silhouette. Fully lined in silk.', color: 'Black', material: '100% Scottish Cashmere' },
  { id: 3, name: 'Tailored Wide-Leg Trousers', price: 295, category: 'bottoms', image: './assets/product-3.png', desc: 'Impeccably tailored wide-leg trousers with a high waist and fluid drape. Crafted from Italian wool blend for a refined, comfortable fit that moves with you.', color: 'Charcoal', material: 'Italian Wool Blend' },
  { id: 4, name: 'Merino Ribbed Turtleneck', price: 165, category: 'tops', image: './assets/product-4.png', desc: 'A refined ribbed turtleneck in ultra-soft New Zealand merino wool. The slim fit and fine knit make this an essential layering piece for the colder months.', color: 'Cream', material: '100% Merino Wool' },
  { id: 5, name: 'Leather Structured Bag', price: 350, category: 'accessories', image: './assets/product-5.png', desc: 'A structured leather handbag with clean geometric lines. Hand-stitched from full-grain Italian leather with brushed gold hardware. Interior suede lining with two compartments.', color: 'Black', material: 'Full-grain Italian Leather' },
  { id: 6, name: 'Linen Wrap Dress', price: 245, category: 'dresses', image: './assets/product-6.png', desc: 'An effortlessly elegant wrap dress in premium French linen. The adjustable tie waist creates a flattering silhouette, while the midi length keeps it versatile for any occasion.', color: 'Oatmeal', material: 'French Linen' },
];

// ---- Shopping Bag State ----
let bag = [];
let bagCount = 0;

// ---- DOM Ready ----
(function() {

  // === DARK MODE TOGGLE ===
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);
  updateToggleIcon();

  toggle && toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    updateToggleIcon();
  });

  function updateToggleIcon() {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  // === HEADER SCROLL ===
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // === MOBILE MENU ===
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  window.closeMobileNav = function() {
    mobileNav.classList.remove('active');
    menuToggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  };

  menuToggle && menuToggle.addEventListener('click', () => {
    const isActive = mobileNav.classList.toggle('active');
    menuToggle.innerHTML = isActive
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  });

  // === BAG SIDEBAR ===
  const bagBtn = document.getElementById('bagBtn');
  const bagSidebar = document.getElementById('bagSidebar');
  const bagOverlay = document.getElementById('bagOverlay');
  const closeBag = document.getElementById('closeBag');

  function openBag() {
    bagSidebar.classList.add('open');
    bagOverlay.classList.add('open');
  }

  window.closeBagPanel = function() {
    bagSidebar.classList.remove('open');
    bagOverlay.classList.remove('open');
  };

  bagBtn && bagBtn.addEventListener('click', openBag);
  closeBag && closeBag.addEventListener('click', closeBagPanel);
  bagOverlay && bagOverlay.addEventListener('click', closeBagPanel);

  function updateBagUI() {
    const countEl = document.getElementById('bagCount');
    const itemsEl = document.getElementById('bagItems');
    const footerEl = document.getElementById('bagFooter');
    const totalEl = document.getElementById('bagTotal');

    countEl.textContent = bag.reduce((sum, item) => sum + item.qty, 0);

    if (bag.length === 0) {
      itemsEl.innerHTML = '<div class="bag-empty"><p>Your bag is empty</p><a href="#shop" data-nav class="btn-primary-solid" onclick="closeBagPanel()">Continue Shopping</a></div>';
      footerEl.style.display = 'none';
    } else {
      let html = '';
      bag.forEach((item, i) => {
        html += `<div class="bag-item">
          <img src="${item.image}" alt="${item.name}" width="80" height="106">
          <div class="bag-item-info">
            <p class="bag-item-name">${item.name}</p>
            <p class="bag-item-price">€${item.price}</p>
            <div class="bag-item-qty">
              <button onclick="changeBagQty(${i}, -1)">−</button>
              <span>${item.qty}</span>
              <button onclick="changeBagQty(${i}, 1)">+</button>
            </div>
          </div>
          <button class="bag-item-remove" onclick="removeBagItem(${i})">×</button>
        </div>`;
      });
      itemsEl.innerHTML = html;
      footerEl.style.display = 'block';
      totalEl.textContent = '€' + bag.reduce((sum, item) => sum + item.price * item.qty, 0);
    }
  }

  window.addToBag = function(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const existing = bag.find(item => item.id === productId);
    if (existing) {
      existing.qty++;
    } else {
      bag.push({ ...product, qty: 1 });
    }
    updateBagUI();
    openBag();
  };

  window.changeBagQty = function(index, delta) {
    bag[index].qty += delta;
    if (bag[index].qty <= 0) bag.splice(index, 1);
    updateBagUI();
  };

  window.removeBagItem = function(index) {
    bag.splice(index, 1);
    updateBagUI();
  };

  // === PRODUCT RENDERING ===
  function renderProductCard(product, delay) {
    return `<div class="product-card reveal reveal-delay-${delay}" data-category="${product.category}">
      <a href="#product-${product.id}" data-nav class="product-link">
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}" width="600" height="800" loading="lazy">
          <div class="product-overlay">
            <button class="btn-add-bag" onclick="event.preventDefault(); event.stopPropagation(); addToBag(${product.id})">Add to Bag</button>
          </div>
        </div>
        <div class="product-info">
          <p class="product-name">${product.name}</p>
          <p class="product-price">€${product.price}</p>
        </div>
      </a>
    </div>`;
  }

  function renderFeatured() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map((p, i) => renderProductCard(p, (i % 6) + 1)).join('');
    initReveals(grid);
  }

  function renderShop(filter = 'all', sort = 'featured') {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;

    let filtered = filter === 'all' ? [...PRODUCTS] : PRODUCTS.filter(p => p.category === filter);

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'newest') filtered.reverse();

    grid.innerHTML = filtered.map((p, i) => renderProductCard(p, (i % 6) + 1)).join('');

    const countEl = document.getElementById('resultsCount');
    if (countEl) countEl.textContent = filtered.length + ' Product' + (filtered.length !== 1 ? 's' : '');

    initReveals(grid);
  }

  function renderProduct(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('productDetailImg').src = product.image;
    document.getElementById('productDetailImg').alt = product.name;
    document.getElementById('productDetailName').textContent = product.name;
    document.getElementById('productDetailPrice').textContent = '€' + product.price;
    document.getElementById('productDetailCategory').textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    document.getElementById('breadcrumbProduct').textContent = product.name;
    document.getElementById('productDetailDesc').innerHTML = `<p>${product.desc}</p><p style="margin-top:var(--space-3);color:var(--color-text-muted);"><strong>Color:</strong> ${product.color}<br><strong>Material:</strong> ${product.material}</p>`;

    // Reset qty
    document.getElementById('qtyValue').textContent = '1';

    // Add to bag
    const addBtn = document.getElementById('addToBagDetail');
    addBtn.onclick = function() {
      const qty = parseInt(document.getElementById('qtyValue').textContent);
      const existing = bag.find(item => item.id === product.id);
      if (existing) {
        existing.qty += qty;
      } else {
        bag.push({ ...product, qty: qty });
      }
      updateBagUI();
      addBtn.textContent = 'Added to Bag ✓';
      setTimeout(() => { addBtn.textContent = 'Add to Bag'; }, 2000);
    };

    // Related products
    const related = PRODUCTS.filter(p => p.id !== productId).slice(0, 3);
    const relatedGrid = document.getElementById('relatedGrid');
    if (relatedGrid) {
      relatedGrid.innerHTML = related.map((p, i) => renderProductCard(p, i + 1)).join('');
      initReveals(relatedGrid);
    }

    document.title = product.name + ' — MAISON NOIR';
  }

  // === SHOP FILTERS ===
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.getAttribute('data-filter');
      const sort = document.getElementById('sortSelect')?.value || 'featured';
      renderShop(filter, sort);
    }
  });

  const sortSelect = document.getElementById('sortSelect');
  sortSelect && sortSelect.addEventListener('change', () => {
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    renderShop(activeFilter, sortSelect.value);
  });

  // === SIZE BUTTONS ===
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('size-btn')) {
      e.target.parentElement.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
    }
  });

  // === QUANTITY CONTROLS ===
  document.getElementById('qtyMinus')?.addEventListener('click', () => {
    const el = document.getElementById('qtyValue');
    const val = parseInt(el.textContent);
    if (val > 1) el.textContent = val - 1;
  });

  document.getElementById('qtyPlus')?.addEventListener('click', () => {
    const el = document.getElementById('qtyValue');
    el.textContent = parseInt(el.textContent) + 1;
  });

  // === ACCORDIONS ===
  document.querySelectorAll('.accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById('accordion-' + btn.getAttribute('data-accordion'));
      const isOpen = target.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
    });
  });

  // === CONTACT FORM ===
  const contactForm = document.getElementById('contactForm');
  contactForm && contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Message Sent ✓';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      contactForm.reset();
    }, 3000);
  });

  // === SCROLL REVEAL ===
  function initReveals(container) {
    const reveals = (container || document).querySelectorAll('.reveal:not(.visible)');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // === SPA ROUTER ===
  function navigateTo(hash) {
    // Close mobile nav on navigation
    closeMobileNav();

    const pages = document.querySelectorAll('.page');
    pages.forEach(p => {
      p.style.display = 'none';
      p.classList.remove('page-active');
    });

    let pageId = 'page-home';
    let productId = null;

    if (hash.startsWith('#product-')) {
      pageId = 'page-product';
      productId = parseInt(hash.replace('#product-', ''));
    } else if (hash === '#shop' || hash === '#shop-women') {
      pageId = 'page-shop';
    } else if (hash === '#about' || hash === '#story') {
      pageId = 'page-about';
    } else if (hash === '#contact' || hash === '#newsletter') {
      pageId = 'page-contact';
    }

    const target = document.getElementById(pageId);
    if (target) {
      target.style.display = 'block';
      target.classList.add('page-active');
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Render page content
    if (pageId === 'page-home') {
      renderFeatured();
      document.title = 'MAISON NOIR — Timeless Elegance. Modern Simplicity.';
    } else if (pageId === 'page-shop') {
      renderShop('all', 'featured');
      // Reset filter buttons
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');
      document.title = 'Shop — MAISON NOIR';
    } else if (pageId === 'page-product' && productId) {
      renderProduct(productId);
    } else if (pageId === 'page-about') {
      document.title = 'Our Story — MAISON NOIR';
    } else if (pageId === 'page-contact') {
      document.title = 'Contact — MAISON NOIR';
    }

    // Reinit scroll reveals for visible page
    setTimeout(() => initReveals(), 100);

    // Update active nav
    document.querySelectorAll('.main-nav a').forEach(a => {
      a.classList.toggle('nav-active', a.getAttribute('href') === '#' + pageId.replace('page-', ''));
    });
  }

  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    navigateTo(location.hash || '#home');
  });

  // Handle nav clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-nav]');
    if (link) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        // Check for filter links from footer
        const filterLink = link.getAttribute('data-filter-link');
        if (filterLink) {
          setTimeout(() => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            document.querySelector(`.filter-btn[data-filter="${filterLink}"]`)?.classList.add('active');
            renderShop(filterLink, 'featured');
          }, 100);
        }
      }
    }
  });

  // Checkout button
  document.querySelector('.bag-checkout')?.addEventListener('click', () => {
    alert('This is a demo store. In a real store, you would proceed to checkout.');
  });

  // Initial route
  navigateTo(location.hash || '#home');

})();
