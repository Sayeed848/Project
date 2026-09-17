let currentCategory = 'all';
let currentSearch = '';
let products = [];
let cart = JSON.parse(localStorage.getItem('shopzone_cart') || '[]');

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  updateCartUI();
});

async function fetchProducts() {
  const grid = document.getElementById('product-grid');
  try {
    let url = `/api/products?category=${currentCategory}`;
    if (currentSearch) {
      url += `&search=${encodeURIComponent(currentSearch)}`;
    }
    const res = await fetch(url);
    products = await res.json();
    renderProducts(products);
  } catch (err) {
    grid.innerHTML = `<div style="color: var(--shop-muted); grid-column: 1/-1; text-align: center;">Error loading products: ${err.message}</div>`;
  }
}

function renderProducts(list) {
  const grid = document.getElementById('product-grid');
  if (!list.length) {
    grid.innerHTML = `<div style="color: var(--shop-muted); grid-column: 1/-1; text-align: center; padding: 40px;">No products found in this category.</div>`;
    return;
  }

  grid.innerHTML = list.map(p => {
    const oldPriceHtml = p.old_price ? `<span class="card-old-price">₹${Number(p.old_price).toLocaleString()}</span>` : '';
    const discount = p.old_price ? Math.round((1 - p.price / p.old_price) * 100) + '% OFF' : '';
    const stars = '★'.repeat(p.rating || 5) + '☆'.repeat(5 - (p.rating || 5));
    const badgeHtml = p.badge ? `<div class="card-badge ${p.badge}">${p.badge}</div>` : '';

    const imgContent = p.img
      ? `<img src="${p.img}" alt="${p.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
         <i class="ti ${p.icon || 'ti-box'}" style="display:none;"></i>`
      : `<i class="ti ${p.icon || 'ti-box'}"></i>`;

    return `
      <div class="card">
        <div class="card-img">
          ${badgeHtml}
          ${imgContent}
        </div>
        <div class="card-body">
          <div class="card-name">${p.name}</div>
          <div class="card-rating">
            <span>${stars}</span>
            ${discount ? `<span style="color:var(--shop-accent); margin-left:8px; font-weight:700; font-size:11px;">${discount}</span>` : ''}
          </div>
          <div class="card-price-row">
            <span class="card-price">₹${Number(p.price).toLocaleString()}</span>
            ${oldPriceHtml}
          </div>
          <button class="add-to-cart" onclick="addToCart(${p.id})">
            <i class="ti ti-shopping-bag-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterCategory(cat, el) {
  currentCategory = cat;
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  fetchProducts();
}

let searchTimeout;
function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentSearch = document.getElementById('searchInput').value.trim();
    fetchProducts();
  }, 300);
}

function addToCart(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...prod, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`Added "${prod.name}" to cart!`);
}

function saveCart() {
  localStorage.setItem('shopzone_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const countBadge = document.getElementById('cart-count');
  const drawerCount = document.getElementById('cart-drawer-count');
  const container = document.getElementById('cart-items-container');
  const totalElem = document.getElementById('cart-total-amount');

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  countBadge.textContent = totalQty;
  drawerCount.textContent = totalQty;

  if (!cart.length) {
    container.innerHTML = `<div style="color: var(--shop-muted); text-align: center; margin-top: 40px;">Your cart is empty.</div>`;
    totalElem.textContent = '₹0';
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>₹${Number(item.price).toLocaleString()} × ${item.qty}</p>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button onclick="changeQty(${item.id}, -1)" style="background:#11131c; border:1px solid var(--shop-border); color:#fff; width:24px; height:24px; border-radius:4px; cursor:pointer;">-</button>
          <span style="font-size:14px; font-weight:700;">${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)" style="background:#11131c; border:1px solid var(--shop-border); color:#fff; width:24px; height:24px; border-radius:4px; cursor:pointer;">+</button>
          <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:#e74c3c; margin-left:8px; cursor:pointer;"><i class="ti ti-trash"></i></button>
        </div>
      </div>
    `;
  }).join('');

  // Check for promo code
  const promo = document.getElementById('promoCode').value.trim().toUpperCase();
  let discount = 0;
  if (promo === 'SAVE30' && subtotal >= 999) {
    discount = subtotal * 0.3;
  }

  const finalTotal = Math.max(0, subtotal - discount);
  totalElem.textContent = `₹${Math.round(finalTotal).toLocaleString()}${discount > 0 ? ' (30% OFF Applied)' : ''}`;
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartUI();
}

function toggleCartDrawer() {
  document.getElementById('cartDrawer').classList.toggle('open');
}

function openCheckoutModal() {
  if (!cart.length) {
    showToast('Your cart is empty!');
    return;
  }
  document.getElementById('checkoutModal').style.display = 'flex';
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').style.display = 'none';
}

async function submitOrder() {
  const name = document.getElementById('cust-name').value.trim();
  const email = document.getElementById('cust-email').value.trim();
  const address = document.getElementById('cust-address').value.trim();
  const promo = document.getElementById('promoCode').value.trim();

  if (!name || !email) {
    showToast('Please fill in your name and email');
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  let discount = 0;
  if (promo.toUpperCase() === 'SAVE30' && subtotal >= 999) {
    discount = subtotal * 0.3;
  }
  const totalAmount = Math.round(subtotal - discount);

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: name,
        customer_email: email,
        address,
        total_amount: totalAmount,
        discount_code: promo,
        items: cart
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      showToast(`Order #${data.orderId} placed successfully! Saved to PostgreSQL.`);
      cart = [];
      saveCart();
      updateCartUI();
      closeCheckoutModal();
      toggleCartDrawer();
    } else {
      throw new Error(data.error || 'Failed to place order');
    }
  } catch (err) {
    showToast(`Error placing order: ${err.message}`);
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
