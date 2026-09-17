const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDb, query, inMemoryStore, isPostgresActive } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Database on Startup
initDb();

// -------------------------------------------------------------
// CV & PROFILE API
// -------------------------------------------------------------
app.get('/api/profile', (req, res) => {
  res.json({
    name: "SAYEED ALAM",
    title: "Java Full Stack Developer",
    email: "sydrj116@gmail.com",
    phone: "+91 9122312432",
    location: "Siwan, Bihar, India",
    github: "https://github.com/Sayeed848",
    linkedin: "https://linkedin.com",
    summary: "Associate Engineer with 2 years of experience in developing and maintaining web applications. Strong knowledge of Core Java, OOP, Collections, Exception Handling, HTML, CSS, and JavaScript. Skilled in debugging, responsive UI development, Git, and Agile methodologies with a passion for building clean and efficient applications.",
    technicalSkills: {
      languages: ["Java", "JavaScript (ES6+)"],
      web: ["HTML5", "CSS3", "Responsive Design", "React.js"],
      coreJava: ["OOP", "Collections", "Exception Handling", "JDBC", "Hibernate", "Spring Boot"],
      tools: ["Git", "GitHub", "Google Antigravity AI", "Claude AI", "MS Office", "PostgreSQL", "MySQL"],
      methodologies: ["Agile", "Scrum"]
    },
    experience: [
      {
        role: "Software Engineer Intern",
        company: "Tek Pyramid, Bengaluru, India",
        period: "July 2026 – Present",
        points: [
          "Selected for the Project Implementation & Learning Program as a Software Engineer Intern.",
          "Developing application modules using Java, RESTful APIs, HTML, CSS, and JavaScript.",
          "Participating in code reviews, technical evaluations, and Agile development workflows."
        ]
      }
    ],
    projects: [
      {
        name: "ShopZone – E-Commerce Application",
        type: "Live Project",
        tech: "HTML, CSS, JavaScript, Node.js, PostgreSQL",
        points: [
          "Built a responsive e-commerce website with product listing, category filtering, and shopping cart functionality.",
          "Implemented dynamic DOM manipulation, reusable UI components, and responsive layouts using Flexbox and CSS Grid.",
          "Improved usability through optimized performance and cross-browser compatibility."
        ]
      }
    ],
    training: [
      {
        title: "Java Full Stack Development",
        institution: "JSpiders",
        details: "Trained in Core Java, HTML, CSS and JavaScript."
      }
    ],
    certifications: [
      {
        title: "Java Full Stack Development Certification (In Progress)",
        institution: "JSpiders, Rajajinagar, Bengaluru",
        details: "Covered Core Java, HTML, CSS and JavaScript."
      }
    ],
    education: [
      {
        degree: "Bachelor of Technology (B.Tech)",
        institution: "Bihar Engineering University (BEU), Bihar",
        period: "2020 – 2024"
      },
      {
        degree: "Senior Secondary (12th Grade)",
        board: "Bihar Board (BSEB)",
        institution: "PHULMATI GENA RAWAT +2 H/S CHAPRA, SARAN",
        period: "2018",
        percentage: "66.8%"
      },
      {
        degree: "Secondary (10th Grade)",
        board: "CBSE",
        institution: "MAXWELL H SCH BAIJALPUR FAKIR SONPUR SARAN BR",
        period: "2020",
        percentage: "43.2%"
      }
    ]
  });
});

// -------------------------------------------------------------
// PRODUCTS API
// -------------------------------------------------------------
app.get('/api/products', async (req, res) => {
  const { category, search } = req.query;

  if (isPostgresActive()) {
    try {
      let sql = 'SELECT * FROM products WHERE 1=1';
      const params = [];

      if (category && category !== 'all') {
        params.push(category.toLowerCase());
        sql += ` AND LOWER(category) = $${params.length}`;
      }

      if (search && search.trim() !== '') {
        params.push(`%${search.trim().toLowerCase()}%`);
        sql += ` AND LOWER(name) LIKE $${params.length}`;
      }

      sql += ' ORDER BY id ASC';
      const result = await query(sql, params);
      return res.json(result.rows);
    } catch (err) {
      console.error('Error fetching products from Postgres:', err);
    }
  }

  // Memory fallback
  let list = inMemoryStore.products;
  if (category && category !== 'all') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search && search.trim() !== '') {
    const s = search.trim().toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(s));
  }
  res.json(list);
});

app.get('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isPostgresActive()) {
    try {
      const result = await query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length > 0) return res.json(result.rows[0]);
      return res.status(404).json({ error: 'Product not found' });
    } catch (err) {
      console.error(err);
    }
  }

  const p = inMemoryStore.products.find(item => item.id === id);
  if (p) return res.json(p);
  res.status(404).json({ error: 'Product not found' });
});

app.post('/api/products', async (req, res) => {
  const { name, category, price, old_price, img, icon, badge, rating, description } = req.body;
  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Name, category and price are required' });
  }

  if (isPostgresActive()) {
    try {
      const result = await query(
        `INSERT INTO products (name, category, price, old_price, img, icon, badge, rating, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [name, category, price, old_price || null, img || '', icon || 'ti-box', badge || '', rating || 5, description || '']
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
    }
  }

  const newProd = {
    id: inMemoryStore.products.length + 1,
    name,
    category,
    price: Number(price),
    old_price: old_price ? Number(old_price) : null,
    img: img || '',
    icon: icon || 'ti-box',
    badge: badge || '',
    rating: Number(rating) || 5,
    description: description || ''
  };
  inMemoryStore.products.push(newProd);
  res.status(201).json(newProd);
});

app.delete('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isPostgresActive()) {
    try {
      await query('DELETE FROM products WHERE id = $1', [id]);
      return res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      console.error(err);
    }
  }

  inMemoryStore.products = inMemoryStore.products.filter(p => p.id !== id);
  res.json({ message: 'Product deleted successfully' });
});

// -------------------------------------------------------------
// CATEGORIES API
// -------------------------------------------------------------
app.get('/api/categories', async (req, res) => {
  if (isPostgresActive()) {
    try {
      const result = await query('SELECT * FROM categories ORDER BY id ASC');
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
    }
  }
  res.json(inMemoryStore.categories);
});

// -------------------------------------------------------------
// CONTACT MESSAGES API
// -------------------------------------------------------------
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  if (isPostgresActive()) {
    try {
      const result = await query(
        `INSERT INTO contact_messages (name, email, subject, message)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, email, subject || 'General Inquiry', message]
      );
      return res.status(201).json({ success: true, message: 'Message sent successfully!', data: result.rows[0] });
    } catch (err) {
      console.error(err);
    }
  }

  const msg = {
    id: inMemoryStore.contact_messages.length + 1,
    name,
    email,
    subject: subject || 'General Inquiry',
    message,
    created_at: new Date().toISOString()
  };
  inMemoryStore.contact_messages.unshift(msg);
  res.status(201).json({ success: true, message: 'Message sent successfully!', data: msg });
});

app.get('/api/contact/messages', async (req, res) => {
  if (isPostgresActive()) {
    try {
      const result = await query('SELECT * FROM contact_messages ORDER BY created_at DESC');
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
    }
  }
  res.json(inMemoryStore.contact_messages);
});

// -------------------------------------------------------------
// ORDERS & CHECKOUT API
// -------------------------------------------------------------
app.post('/api/orders', async (req, res) => {
  const { customer_name, customer_email, address, total_amount, discount_code, items } = req.body;
  if (!customer_name || !customer_email || !items || !items.length) {
    return res.status(400).json({ error: 'Customer information and items are required' });
  }

  if (isPostgresActive()) {
    try {
      const result = await query(
        `INSERT INTO orders (customer_name, customer_email, address, total_amount, discount_code, items_json)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [customer_name, customer_email, address || '', total_amount, discount_code || '', JSON.stringify(items)]
      );
      return res.status(201).json({ success: true, orderId: result.rows[0].id, order: result.rows[0] });
    } catch (err) {
      console.error(err);
    }
  }

  const newOrder = {
    id: 1000 + inMemoryStore.orders.length + 1,
    customer_name,
    customer_email,
    address: address || '',
    total_amount,
    discount_code: discount_code || '',
    items_json: items,
    status: 'Confirmed',
    created_at: new Date().toISOString()
  };
  inMemoryStore.orders.unshift(newOrder);
  res.status(201).json({ success: true, orderId: newOrder.id, order: newOrder });
});

app.get('/api/orders', async (req, res) => {
  if (isPostgresActive()) {
    try {
      const result = await query('SELECT * FROM orders ORDER BY created_at DESC');
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
    }
  }
  res.json(inMemoryStore.orders);
});

// -------------------------------------------------------------
// ADMIN STATS API
// -------------------------------------------------------------
app.get('/api/admin/stats', async (req, res) => {
  if (isPostgresActive()) {
    try {
      const pRes = await query('SELECT COUNT(*) FROM products');
      const oRes = await query('SELECT COUNT(*), COALESCE(SUM(total_amount), 0) as revenue FROM orders');
      const mRes = await query('SELECT COUNT(*) FROM contact_messages');

      return res.json({
        totalProducts: parseInt(pRes.rows[0].count, 10),
        totalOrders: parseInt(oRes.rows[0].count, 10),
        totalRevenue: parseFloat(oRes.rows[0].revenue),
        totalMessages: parseInt(mRes.rows[0].count, 10),
        dbType: 'PostgreSQL'
      });
    } catch (err) {
      console.error(err);
    }
  }

  const revenue = inMemoryStore.orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  res.json({
    totalProducts: inMemoryStore.products.length,
    totalOrders: inMemoryStore.orders.length,
    totalRevenue: revenue,
    totalMessages: inMemoryStore.contact_messages.length,
    dbType: 'InMemory (Configure DATABASE_URL for PostgreSQL)'
  });
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`💼 Sayeed Alam Portfolio: http://localhost:${PORT}`);
  console.log(`📄 Printable CV: http://localhost:${PORT}/cv.html`);
  console.log(`🛍️ ShopZone E-Commerce: http://localhost:${PORT}/shop.html`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin.html`);
});
