/* ============================================
   ORIGEN VALLE — App JavaScript
   Gestión de carrito, productos y UI
   ============================================ */

'use strict';

const WA_PHONE = '56982233777';

/* ---- Catálogo de productos ---- */
const PRODUCTS = [
  {
    id: 1,
    name: 'Crema Corporal Hidratante',
    description: 'Hidratación profunda con aroma Sweet Apple. Deja tu piel suave, nutrida y con un aroma delicioso durante todo el día.',
    price: 28000,
    category: 'corporal',
    categoryLabel: 'Cuidado Corporal',
    badge: 'natural',
    badgeText: 'Natural',
    image: 'productos/WhatsApp Image 2026-04-01 at 11.13.07.jpeg'
  },
  {
    id: 2,
    name: 'Crema Corporal Duo',
    description: 'Pack doble de cremas corporales hidratantes. Aroma dulce y textura ligera. Ideal para compartir o regalar.',
    price: 52000,
    category: 'corporal',
    categoryLabel: 'Cuidado Corporal',
    badge: 'nuevo',
    badgeText: 'Nuevo',
    image: 'productos/WhatsApp Image 2026-04-01 at 11.13.07 (1).jpeg'
  },
  {
    id: 3,
    name: 'Shampoo Hidratante',
    description: 'Revitaliza el cabello con aceite de coco, jojoba y vitamina E. Aroma Sweet Apple. Cabello sedoso y lleno de vida.',
    price: 25000,
    category: 'cabello',
    categoryLabel: 'Cuidado Capilar',
    badge: 'natural',
    badgeText: 'Natural',
    image: 'productos/WhatsApp Image 2026-04-01 at 11.14.01.jpeg'
  },
  {
    id: 4,
    name: 'Kit Regalo Premium',
    description: 'Selección especial de nuestros productos más queridos, presentados en un hermoso empaque para regalar.',
    price: 65000,
    category: 'kits',
    categoryLabel: 'Kits y Regalos',
    badge: 'kit',
    badgeText: 'Kit Regalo',
    image: 'productos/WhatsApp Image 2026-04-01 at 11.14.32.jpeg'
  },
  {
    id: 5,
    name: 'Kit Regalo Natural',
    description: 'Caja regalo con una cuidadosa selección de productos naturales y té artesanal. Un regalo único y especial.',
    price: 55000,
    category: 'kits',
    categoryLabel: 'Kits y Regalos',
    badge: 'kit',
    badgeText: 'Kit Regalo',
    image: 'productos/WhatsApp Image 2026-04-01 at 11.14.33.jpeg'
  },
  {
    id: 6,
    name: 'Natural Pack Eco',
    description: 'Caja kraft ecológica con nuestros mejores productos. Empaque 100% reciclable. El regalo perfecto y responsable.',
    price: 75000,
    category: 'kits',
    categoryLabel: 'Kits y Regalos',
    badge: 'kit',
    badgeText: 'Eco Pack',
    image: 'productos/WhatsApp Image 2026-04-01 at 14.20.55.jpeg'
  },
  {
    id: 7,
    name: 'Tónico Facial Agua de Rosas',
    description: 'Hidrata, tonifica y equilibra tu piel con extracto puro de agua de rosas. Piel fresca y luminosa.',
    price: 32000,
    category: 'facial',
    categoryLabel: 'Cuidado Facial',
    badge: 'natural',
    badgeText: 'Natural',
    image: 'productos/WhatsApp Image 2026-04-01 at 14.20.56.jpeg'
  },
  {
    id: 8,
    name: 'Bálsamo Labial Dulce de Leche',
    description: 'Formulado con karité, cacao, coco y vitamina E. Nutre y protege tus labios de forma natural y deliciosa.',
    price: 12000,
    category: 'facial',
    categoryLabel: 'Cuidado Facial',
    badge: 'natural',
    badgeText: 'Natural',
    image: 'productos/WhatsApp Image 2026-04-01 at 14.20.56 (2).jpeg'
  },
  {
    id: 9,
    name: 'Sérum Facial',
    description: 'Hidratante, anti edad, aclarante y antioxidante. El aliado indispensable de tu rutina de cuidado facial.',
    price: 45000,
    category: 'facial',
    categoryLabel: 'Cuidado Facial',
    badge: 'nuevo',
    badgeText: 'Destacado',
    image: 'productos/WhatsApp Image 2026-04-01 at 14.20.57.jpeg'
  }
];

/* ---- Utilidades ---- */
function formatPrice(value) {
  return '$' + value.toLocaleString('es-CO');
}

function encodePath(path) {
  return path.split('/').map(segment =>
    segment.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29')
  ).join('/');
}

/* ============================================
   CARRITO — LocalStorage
   ============================================ */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('origen_valle_cart')) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('origen_valle_cart', JSON.stringify(cart));
  updateCartBadge();
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
}

function updateQty(productId, qty) {
  if (qty <= 0) { removeFromCart(productId); return; }
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) item.qty = qty;
  saveCart(cart);
}

/* ============================================
   UI — Navbar & Badge
   ============================================ */
function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const count = getCartCount();
  badges.forEach(badge => {
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
  });
}

function initNavbar() {
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // Cerrar al hacer click en un link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // Marcar link activo
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  updateCartBadge();
}

/* ============================================
   UI — Toast Notification
   ============================================ */
let toastTimer;
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">
        <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
      </div>
      <span class="toast-msg"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-msg').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ============================================
   UI — Render Products
   ============================================ */
function createProductCard(product) {
  const badgeColors = {
    natural: 'badge-natural',
    kit: 'badge-kit',
    nuevo: 'badge-nuevo'
  };
  const imgSrc = encodePath(product.image);
  return `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}">
      <div class="product-card__image">
        <img src="${imgSrc}" alt="${product.name}" loading="lazy">
        <span class="product-card__badge ${badgeColors[product.badge] || 'badge-natural'}">${product.badgeText}</span>
      </div>
      <div class="product-card__body">
        <div class="product-card__category">${product.categoryLabel}</div>
        <h3 class="product-card__name">${product.name}</h3>
        <p class="product-card__desc">${product.description}</p>
        <div class="product-micro-badges">
          <span class="micro-badge">🌿 Natural</span>
          <span class="micro-badge">✋ Artesanal</span>
          <span class="micro-badge">🧴 Lote pequeño</span>
        </div>
      </div>
      <div class="product-card__footer">
        <div class="product-card__price">
          ${formatPrice(product.price)} <span>CLP</span>
        </div>
        <button class="add-to-cart-btn" onclick="handleAddToCart(${product.id}, this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/>
          </svg>
          Agregar
        </button>
      </div>
    </div>
  `;
}

function handleAddToCart(productId, btn) {
  addToCart(productId);
  const product = PRODUCTS.find(p => p.id === productId);
  showToast(`"${product.name}" agregado al carrito`);

  btn.classList.add('added');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    Agregado`;
  setTimeout(() => {
    btn.classList.remove('added');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/>
      </svg>
      Agregar`;
  }, 2000);
}

function renderProducts(filter = 'all', containerId = 'products-grid') {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  const filtered = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(createProductCard).join('');

  // Actualizar contador
  const countEl = document.querySelector('.filters-count');
  if (countEl) countEl.textContent = `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`;
}


/* ============================================
   UI — Filtros
   ============================================ */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });
}

/* ============================================
   CARRITO — Render
   ============================================ */
function renderCartPage() {
  const cartContainer = document.getElementById('cart-items');
  const emptyState = document.getElementById('cart-empty');
  const summarySection = document.getElementById('order-summary');
  if (!cartContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    emptyState && emptyState.classList.remove('hidden');
    summarySection && summarySection.classList.add('hidden');
    cartContainer.innerHTML = '';
    return;
  }

  emptyState && emptyState.classList.add('hidden');
  summarySection && summarySection.classList.remove('hidden');

  cartContainer.innerHTML = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return '';
    const imgSrc = encodePath(product.image);
    return `
      <div class="cart-item" id="cart-item-${product.id}">
        <div class="cart-item__image">
          <img src="${imgSrc}" alt="${product.name}">
        </div>
        <div class="cart-item__info">
          <div class="item-category">${product.categoryLabel}</div>
          <h4>${product.name}</h4>
          <div class="cart-item__qty">
            <button class="qty-btn" onclick="changeQty(${product.id}, ${item.qty - 1})">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${product.id}, ${item.qty + 1})">+</button>
          </div>
        </div>
        <div class="cart-item__price-col">
          <span class="cart-item__price">${formatPrice(product.price * item.qty)}</span>
          <button class="cart-item__remove" onclick="removeItem(${product.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
            </svg>
            Eliminar
          </button>
        </div>
      </div>`;
  }).join('');

  updateSummary();
}

function updateSummary() {
  const cart = getCart();
  const total = getCartTotal();
  const subtotalEl = document.getElementById('summary-subtotal');
  const totalEl = document.getElementById('summary-total');
  const itemsEl = document.getElementById('summary-items');

  const count = cart.reduce((s, i) => s + i.qty, 0);
  if (itemsEl) itemsEl.textContent = `${count} producto${count !== 1 ? 's' : ''}`;
  if (subtotalEl) subtotalEl.textContent = formatPrice(total);
  if (totalEl) totalEl.textContent = formatPrice(total);
}

function changeQty(productId, newQty) {
  updateQty(productId, newQty);
  renderCartPage();
}

function removeItem(productId) {
  removeFromCart(productId);
  renderCartPage();
  showToast('Producto eliminado del carrito');
}

/* ============================================
   WhatsApp Checkout
   ============================================ */
function checkoutWhatsApp() {
  const cart = getCart();
  if (cart.length === 0) return;

  let msg = '🌿 *Hola Origen Valle!* Me gustaría hacer el siguiente pedido:\n\n';
  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (product) {
      msg += `• *${product.name}* x${item.qty} — ${formatPrice(product.price * item.qty)}\n`;
    }
  });
  msg += `\n💚 *Total: ${formatPrice(getCartTotal())}*\n\n¿Cómo puedo pagar y coordinar el envío?`;

  const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* ============================================
   MODAL DE COMPRA
   ============================================ */
let lastFocusedElement = null;

function openBuyModal() {
  const modal = document.getElementById('buy-modal');
  const waBtn = document.getElementById('buy-whatsapp-btn');

  if (!modal || !waBtn) return;

  lastFocusedElement = document.activeElement;

  // Construir URL de WhatsApp con el carrito completo
  const cart = getCart();
  let msg = '🌿 *Hola Origen Valle!* Me gustaría hacer el siguiente pedido:\n\n';
  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (product) {
      msg += `• *${product.name}* x${item.qty} — ${formatPrice(product.price * item.qty)}\n`;
    }
  });
  msg += `\n💚 *Total: ${formatPrice(getCartTotal())}*\n\n¿Cómo puedo pagar y coordinar el envío?`;
  waBtn.href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const closeBtn = modal.querySelector('.buy-modal__close');
  if (closeBtn) closeBtn.focus();

  // Focus trap
  const focusable = Array.from(modal.querySelectorAll('a[href], button:not([disabled])'));
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  modal._trapHandler = function(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  modal.addEventListener('keydown', modal._trapHandler);
}

function closeBuyModal() {
  const modal = document.getElementById('buy-modal');
  if (!modal) return;
  if (modal._trapHandler) {
    modal.removeEventListener('keydown', modal._trapHandler);
    modal._trapHandler = null;
  }
  modal.classList.remove('active');
  document.body.style.overflow = '';
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function closeBuyModalOnOverlay(event) {
  if (event.target === event.currentTarget) {
    closeBuyModal();
  }
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();

  // Escape key closes buy modal (only register if modal exists on this page)
  if (document.getElementById('buy-modal')) {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeBuyModal();
    });
  }

  const page = document.body.dataset.page;

  if (page === 'tienda') {
    renderProducts('all');
    initFilters();
  }

  if (page === 'home') {
    renderProducts('all', 'featured-grid');
    // Solo mostrar 4 destacados
    const grid = document.getElementById('featured-grid');
    if (grid) {
      const cards = grid.querySelectorAll('.product-card');
      cards.forEach((card, i) => { if (i >= 4) card.remove(); });
    }
  }

  if (page === 'carrito') {
    renderCartPage();
  }
});
