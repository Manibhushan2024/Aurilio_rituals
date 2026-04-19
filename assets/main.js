/**
 * Aurilio Rituals — main.js
 * Plain vanilla JS, no jQuery, no dependencies.
 * Handles: sticky header, mobile nav, cart drawer,
 *          search bar, gallery, qty selectors, animations,
 *          cart AJAX (Shopify cart API).
 */

(function () {
  'use strict';

  /* ─── Utility: Query selectors ─────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ─── 1. STICKY HEADER ──────────────────────────────────── */
  const header = $('#SiteHeader');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ─── 2. MOBILE NAV ─────────────────────────────────────── */
  const navToggle  = $('#NavToggle');
  const siteNav    = $('#SiteNav');
  const navOverlay = $('#NavOverlay');

  function openNav() {
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.classList.add('is-active');
    siteNav && siteNav.classList.add('is-open');
    navOverlay && navOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navToggle && navToggle.setAttribute('aria-expanded', 'false');
    navToggle && navToggle.classList.remove('is-active');
    siteNav && siteNav.classList.remove('is-open');
    navOverlay && navOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  navToggle && navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeNav() : openNav();
  });
  navOverlay && navOverlay.addEventListener('click', closeNav);

  /* ─── 3. SEARCH BAR ─────────────────────────────────────── */
  const searchToggle = $('#SearchToggle');
  const searchBar    = $('#SearchBar');
  const searchClose  = $('#SearchClose');
  const searchInput  = searchBar && $('input[type="search"]', searchBar);

  function openSearch() {
    searchBar.classList.add('is-open');
    searchBar.setAttribute('aria-hidden', 'false');
    searchToggle.setAttribute('aria-expanded', 'true');
    setTimeout(() => searchInput && searchInput.focus(), 150);
  }

  function closeSearch() {
    searchBar.classList.remove('is-open');
    searchBar.setAttribute('aria-hidden', 'true');
    searchToggle.setAttribute('aria-expanded', 'false');
  }

  searchToggle && searchToggle.addEventListener('click', () => {
    searchBar.classList.contains('is-open') ? closeSearch() : openSearch();
  });
  searchClose && searchClose.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); closeNav(); closeCart(); }
  });

  /* ─── 4. CART DRAWER ─────────────────────────────────────── */
  const cartDrawer  = $('#CartDrawer');
  const cartToggle  = $('#CartToggle');
  const cartClose   = $('#CartDrawerClose');
  const cartCount   = $('#CartCount');

  function openCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.add('is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    cartToggle && cartToggle.setAttribute('aria-expanded', 'true');
    navOverlay && navOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    cartToggle && cartToggle.setAttribute('aria-expanded', 'false');
    navOverlay && navOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  cartToggle && cartToggle.addEventListener('click', () => {
    cartDrawer.classList.contains('is-open') ? closeCart() : openCart();
  });
  cartClose && cartClose.addEventListener('click', closeCart);
  navOverlay && navOverlay.addEventListener('click', closeCart);

  /* Cart API helpers */
  async function fetchCart() {
    const res = await fetch('/cart.js');
    return res.json();
  }

  async function updateCartItem(key, quantity) {
    const res = await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity }),
    });
    return res.json();
  }

  async function addToCart(variantId, quantity = 1) {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity }),
    });
    return res.json();
  }

  function updateCartCount(count) {
    if (!cartCount) return;
    cartCount.textContent = count;
    count > 0 ? cartCount.removeAttribute('hidden') : cartCount.setAttribute('hidden', '');
  }

  /* Cart Qty buttons (drawer) */
  document.addEventListener('click', async (e) => {
    const qtyBtn = e.target.closest('.cart-drawer__qty-btn');
    if (!qtyBtn) return;
    const key = qtyBtn.dataset.key;
    const action = qtyBtn.dataset.action;
    if (!key || !action) return;
    const item = qtyBtn.closest('.cart-drawer__item');
    const qtyEl = item && $('.cart-drawer__qty-num', item);
    if (!qtyEl) return;
    let qty = parseInt(qtyEl.textContent, 10);
    qty = action === 'increase' ? qty + 1 : Math.max(0, qty - 1);
    qtyBtn.disabled = true;
    try {
      const cart = await updateCartItem(key, qty);
      updateCartCount(cart.item_count);
      // Reload cart drawer content via fetch
      reloadCartDrawer();
    } catch (err) {
      console.error('Cart update error:', err);
    } finally {
      qtyBtn.disabled = false;
    }
  });

  /* Cart Remove buttons */
  document.addEventListener('click', async (e) => {
    const removeBtn = e.target.closest('.cart-drawer__remove');
    if (!removeBtn) return;
    const key = removeBtn.dataset.key;
    if (!key) return;
    try {
      const cart = await updateCartItem(key, 0);
      updateCartCount(cart.item_count);
      reloadCartDrawer();
    } catch (err) {
      console.error('Remove error:', err);
    }
  });

  async function reloadCartDrawer() {
    if (!cartDrawer) return;
    try {
      const res = await fetch('/?section_id=cart-drawer');
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const newDrawer = doc.querySelector('.cart-drawer');
      if (newDrawer) cartDrawer.innerHTML = newDrawer.innerHTML;
    } catch (err) {
      // fallback — just reload
      window.location.reload();
    }
  }

  /* Quick add to cart forms */
  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('.product-card__quick-form');
    if (!form) return;
    e.preventDefault();
    const variantId = form.querySelector('[name="id"]')?.value;
    if (!variantId) return;
    const btn = form.querySelector('.product-card__quick-btn');
    if (btn) { btn.textContent = 'Adding…'; btn.disabled = true; }
    try {
      await addToCart(variantId, 1);
      const cart = await fetchCart();
      updateCartCount(cart.item_count);
      openCart();
      reloadCartDrawer();
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally {
      if (btn) { btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Added!'; btn.disabled = false; }
      setTimeout(() => { if (btn) { btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add to Cart'; } }, 2000);
    }
  });

  /* ─── 5. PRODUCT IMAGE GALLERY ──────────────────────────── */
  const gallery = $('#ProductGallery');
  if (gallery) {
    const slides = $$('.product-gallery__slide', gallery);
    const thumbs = $$('.product-gallery__thumb', gallery);

    function activateSlide(index) {
      slides.forEach((s, i) => {
        s.classList.toggle('is-active', i === index);
        s.setAttribute('aria-hidden', i !== index ? 'true' : 'false');
      });
      thumbs.forEach((t, i) => t.classList.toggle('is-active', i === index));
    }

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => activateSlide(i));
    });
  }

  /* ─── 6. QUANTITY SELECTORS (Product Page) ──────────────── */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;
    const input = btn.closest('.qty-selector')?.querySelector('.qty-input');
    if (!input) return;
    const action = btn.dataset.action;
    let val = parseInt(input.value, 10) || 1;
    if (action === 'inc') val += 1;
    if (action === 'dec') val = Math.max(1, val - 1);
    input.value = val;
  });

  /* ─── 7. VARIANT SELECTION ──────────────────────────────── */
  $$('.product-form__swatch-input').forEach((input) => {
    input.addEventListener('change', () => {
      const optionName = input.name;
      const optionIndex = input.closest('.product-form__option')?.querySelector('.product-form__option-label strong');
      if (optionIndex) optionIndex.textContent = input.value;
    });
  });

  /* ─── 8. SCROLL ANIMATIONS ──────────────────────────────── */
  const animEls = $$('.animate-fade-up');
  if (animEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    animEls.forEach((el) => observer.observe(el));
  } else {
    // No IntersectionObserver — just show all
    animEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ─── 9. MOBILE NAV — Dropdown Accordions ───────────────── */
  $$('.site-nav__item--has-dropdown .site-nav__link').forEach((link) => {
    link.addEventListener('click', (e) => {
      // Only intercept on mobile (where nav is toggled)
      if (window.innerWidth > 1024) return;
      e.preventDefault();
      const parent = link.closest('.site-nav__item');
      const isOpen = parent.classList.contains('is-open');
      $$('.site-nav__item.is-open').forEach((el) => el.classList.remove('is-open'));
      !isOpen && parent.classList.add('is-open');
    });
  });

  /* ─── 10. SMOOTH SCROLL for anchor links ────────────────── */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── 11. HEADER: add mobile nav styles dynamically ─────── */
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 1024px) {
      .site-nav {
        display: block !important;
        position: fixed;
        top: 0; left: 0; bottom: 0;
        width: min(320px, 85vw);
        background: #FAF6F0;
        z-index: 300;
        transform: translateX(-100%);
        transition: transform 400ms ease;
        overflow-y: auto;
        padding: 80px 24px 40px;
        border-right: 1px solid #F2EFE9;
      }
      .site-nav.is-open { transform: translateX(0); }
      .site-nav__list { flex-direction: column; gap: 0; }
      .site-nav__link { padding: 14px 0; font-size: 1rem; border-bottom: 1px solid #F2EFE9; border-radius: 0; }
      .site-nav__dropdown { display: none; position: static; box-shadow: none; border: none; padding: 0 0 8px 16px; animation: none; }
      .site-nav__item.is-open .site-nav__dropdown { display: block; }
      .site-nav__item.is-open .site-nav__caret { transform: rotate(180deg); }
    }
  `;
  document.head.appendChild(style);

  console.log('%c✨ Aurilio Rituals theme loaded', 'color:#C9A96E;font-weight:bold;font-size:14px;');

})();
