document.addEventListener('DOMContentLoaded', () => {
  loadAdminStats();
  loadProductsTable();
  loadMessagesTable();
});

async function loadAdminStats() {
  try {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();

    document.getElementById('stat-products').textContent = data.totalProducts || 0;
    document.getElementById('stat-orders').textContent = data.totalOrders || 0;
    document.getElementById('stat-revenue').textContent = `₹${(data.totalRevenue || 0).toLocaleString()}`;
    document.getElementById('stat-messages').textContent = data.totalMessages || 0;
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

async function loadProductsTable() {
  const tbody = document.getElementById('products-table-body');
  try {
    const res = await fetch('/api/products?category=all');
    const products = await res.json();

    if (!products.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#8c93a4;">No products in database.</td></tr>`;
      return;
    }

    tbody.innerHTML = products.map(p => `
      <tr>
        <td>#${p.id}</td>
        <td><strong>${p.name}</strong></td>
        <td><span style="text-transform:capitalize;">${p.category}</span></td>
        <td>₹${Number(p.price).toLocaleString()}</td>
        <td>${p.old_price ? '₹' + Number(p.old_price).toLocaleString() : '-'}</td>
        <td>${p.badge ? '<span style="background:#e74c3c; color:#fff; font-size:10px; padding:2px 6px; border-radius:4px;">' + p.badge + '</span>' : '-'}</td>
        <td>
          <button class="btn-sm btn-danger" onclick="deleteProduct(${p.id})"><i class="ti ti-trash"></i> Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#e74c3c;">Error loading products: ${err.message}</td></tr>`;
  }
}

async function loadMessagesTable() {
  const tbody = document.getElementById('messages-table-body');
  try {
    const res = await fetch('/api/contact/messages');
    const messages = await res.json();

    if (!messages.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#8c93a4;">No contact messages received yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = messages.map(m => `
      <tr>
        <td>${new Date(m.created_at).toLocaleDateString()}</td>
        <td><strong>${m.name}</strong></td>
        <td><a href="mailto:${m.email}" style="color:#7c6af7;">${m.email}</a></td>
        <td>${m.subject || 'General'}</td>
        <td style="max-width:300px;">${m.message}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#e74c3c;">Error loading messages: ${err.message}</td></tr>`;
  }
}

function openAddProductModal() {
  document.getElementById('addProductModal').style.display = 'flex';
}

function closeAddProductModal() {
  document.getElementById('addProductModal').style.display = 'none';
}

async function submitAddProduct(event) {
  event.preventDefault();

  const name = document.getElementById('p-name').value.trim();
  const category = document.getElementById('p-category').value;
  const price = document.getElementById('p-price').value;
  const old_price = document.getElementById('p-old-price').value;
  const img = document.getElementById('p-img').value.trim();

  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, price, old_price, img })
    });

    if (res.ok) {
      closeAddProductModal();
      document.getElementById('addProductForm').reset();
      loadAdminStats();
      loadProductsTable();
    } else {
      alert('Failed to add product');
    }
  } catch (err) {
    alert('Error adding product: ' + err.message);
  }
}

async function deleteProduct(id) {
  if (!confirm(`Are you sure you want to delete product #${id}?`)) return;

  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadAdminStats();
      loadProductsTable();
    }
  } catch (err) {
    alert('Error deleting product: ' + err.message);
  }
}
