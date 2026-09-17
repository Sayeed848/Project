const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

let pool = null;
let usePostgres = false;

if (connectionString && connectionString.trim() !== '') {
  try {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1') ? false : { rejectUnauthorized: false }
    });
    usePostgres = true;
    console.log('📌 Attempting PostgreSQL connection via DATABASE_URL...');
  } catch (err) {
    console.warn('⚠️ Could not initialize PostgreSQL pool:', err.message);
  }
}

// In-Memory Fallback Storage if PostgreSQL is temporarily unavailable
const inMemoryStore = {
  categories: [
    { id: 1, name: "Fashion", icon: "ti-shirt" },
    { id: 2, name: "Electronics", icon: "ti-device-laptop" },
    { id: 3, name: "Home & Living", icon: "ti-sofa" },
    { id: 4, name: "Sports", icon: "ti-run" }
  ],
  products: [
    {
      id: 1,
      name: "Classic White Tee",
      category: "fashion",
      price: 499,
      old_price: 799,
      img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTAd-1qpXFswFmZDcJ6_xUJ5v5O3A6bPdnmbhCxh2LpmJJvwJOcu9OIkai7eF_Cpo7bC6ReG_kyTRktZueGwbY8P2OU5CiYog",
      icon: "ti-shirt",
      badge: "sale",
      rating: 4,
      description: "Premium cotton classic crewneck white tee for everyday comfort."
    },
    {
      id: 2,
      name: "Wireless Earbuds Pro",
      category: "electronics",
      price: 1299,
      old_price: 2499,
      img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
      icon: "ti-headphones",
      badge: "sale",
      rating: 5,
      description: "Active noise cancelling wireless earbuds with deep bass and 30-hour battery life."
    },
    {
      id: 3,
      name: "Lightweight Running Shoes",
      category: "sports",
      price: 1899,
      old_price: 2499,
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
      icon: "ti-shoe",
      badge: "new",
      rating: 4,
      description: "Ergonomic running sneakers engineered for high performance and shock absorption."
    },
    {
      id: 4,
      name: "Aluminum Ergonomic Laptop Stand",
      category: "home",
      price: 699,
      old_price: 999,
      img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60",
      icon: "ti-device-laptop",
      badge: "sale",
      rating: 4,
      description: "Sturdy aluminum desktop riser to improve posture and laptop ventilation."
    },
    {
      id: 5,
      name: "Vintage Denim Jacket",
      category: "fashion",
      price: 1599,
      old_price: 2199,
      img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRvFBNXHsqq7psuwuHae5gtDLtmhASCWLVIA9zJCNz_8ygZQu6CqhfPKQooGnNJSKpBquhWoSLg_ru_ooHXR-DZZNZrhXTEUSW7_1Jot-HH8YxoMIJ_1s_I",
      icon: "ti-shirt",
      badge: "",
      rating: 5,
      description: "Stylish washed denim jacket with durable stitching and modern fit."
    },
    {
      id: 6,
      name: "AMOLED Display Smart Watch",
      category: "electronics",
      price: 3499,
      old_price: 4999,
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
      icon: "ti-device-watch",
      badge: "new",
      rating: 5,
      description: "Feature-packed fitness tracker with heart-rate monitor, GPS, and multi-sport mode."
    },
    {
      id: 7,
      name: "Eco Non-Slip Yoga Mat",
      category: "sports",
      price: 849,
      old_price: 1200,
      img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format&fit=crop&q=60",
      icon: "ti-run",
      badge: "",
      rating: 4,
      description: "High-density cushioned yoga mat crafted from eco-friendly TPE material."
    },
    {
      id: 8,
      name: "Aromatherapy Scented Candle Set",
      category: "home",
      price: 399,
      old_price: 599,
      img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=60",
      icon: "ti-flame",
      badge: "new",
      rating: 4,
      description: "Soy wax scented candle set with soothing lavender and vanilla essential oils."
    }
  ],
  cart: {}, // session_id -> array of items
  orders: [],
  contact_messages: [
    {
      id: 1,
      name: "Recruiter / Hiring Manager",
      email: "hr@techcompany.com",
      subject: "Full Stack Developer Role",
      message: "Hi Sayeed, loved your portfolio and ShopZone project! Let us connect for an interview.",
      created_at: new Date().toISOString()
    }
  ]
};

async function initDb() {
  if (!usePostgres || !pool) {
    console.log('ℹ️ Running in memory mode. Set a valid DATABASE_URL in .env to use PostgreSQL.');
    return;
  }

  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL Database!');

    // Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50) DEFAULT 'ti-layout-grid'
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        old_price NUMERIC(10,2),
        img TEXT,
        icon VARCHAR(50) DEFAULT 'ti-box',
        badge VARCHAR(50) DEFAULT '',
        rating INT DEFAULT 5,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        product_id INT REFERENCES products(id) ON DELETE CASCADE,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        address TEXT,
        total_amount NUMERIC(10,2) NOT NULL,
        discount_code VARCHAR(50),
        items_json JSONB NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if products exist, else seed default data
    const res = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(res.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding default products into PostgreSQL...');
      for (const p of inMemoryStore.products) {
        await client.query(
          `INSERT INTO products (id, name, category, price, old_price, img, icon, badge, rating, description)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [p.id, p.name, p.category, p.price, p.old_price, p.img, p.icon, p.badge, p.rating, p.description]
        );
      }
      // Reset sequence
      await client.query(`SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))`);
    }

    // Check if categories exist, else seed
    const catRes = await client.query('SELECT COUNT(*) FROM categories');
    if (parseInt(catRes.rows[0].count, 10) === 0) {
      for (const c of inMemoryStore.categories) {
        await client.query(
          `INSERT INTO categories (id, name, icon) VALUES ($1, $2, $3)`,
          [c.id, c.name, c.icon]
        );
      }
    }

    client.release();
    console.log('✅ PostgreSQL Schema and Seed Data ready.');
  } catch (err) {
    console.warn('⚠️ PostgreSQL initialization warning:', err.message);
    console.log('ℹ️ Falling back gracefully to memory store until PostgreSQL database is accessible.');
    usePostgres = false;
  }
}

// Database Query Helpers
async function query(text, params) {
  if (usePostgres && pool) {
    return pool.query(text, params);
  }
  return null;
}

module.exports = {
  pool,
  initDb,
  query,
  inMemoryStore,
  isPostgresActive: () => usePostgres
};
