# Full-Stack Portfolio & ShopZone E-Commerce Application

A complete full-stack web application featuring **Sayeed Alam's Developer Portfolio**, **Printable CV Format**, **ShopZone E-Commerce Platform**, and **PostgreSQL Admin Dashboard**, built with **Node.js, Express, PostgreSQL, HTML5, CSS3, and JavaScript (ES6+)**.

---

## 🚀 Quick Setup Instructions

### 1. Install Dependencies
Navigate into the project directory and install the required npm packages:
```bash
npm install
```

### 2. Configure PostgreSQL Connection
Open the `.env` file in the root of `fullstack-project` and paste your PostgreSQL database connection URL:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/shopzone_db
```

> **Note**: You only need to set `DATABASE_URL`! When you start the server, Node.js will automatically:
> - Connect to your PostgreSQL database.
> - Create all required tables (`products`, `categories`, `cart_items`, `orders`, `contact_messages`).
> - Populate the database with default sample data if it's empty.

---

## 🏃 Running the Application

Start the Node.js server:
```bash
npm start
```
Or run in development mode with auto-reload:
```bash
npm run dev
```

Open your browser and navigate to:
- 💼 **Portfolio & Project Showcase**: [http://localhost:5000](http://localhost:5000)
- 📄 **Printable CV Format**: [http://localhost:5000/cv.html](http://localhost:5000/cv.html)
- 🛍️ **ShopZone E-Commerce App**: [http://localhost:5000/shop.html](http://localhost:5000/shop.html)
- 📊 **PostgreSQL Admin Dashboard**: [http://localhost:5000/admin.html](http://localhost:5000/admin.html)

---

## ✨ Features Overview

1. **Exact CV Formatting (`/cv.html` & Portfolio)**:
   - Formatted cleanly matching the classic blue-header horizontal line design with updated 2 years experience at RMI Systems, JSpiders training, B.Tech from BEU, skills, and projects.
   - One-click **Print / Save to PDF** button.

2. **Full-Stack E-Commerce Store (`/shop.html`)**:
   - Dynamic product grid fetched from PostgreSQL database.
   - Live category filtering (Fashion, Electronics, Home & Living, Sports) and real-time search bar.
   - Slide-over Shopping Cart drawer with quantity controls, subtotal calculation, and promo code support (`SAVE30` for 30% OFF).
   - Checkout modal saving orders directly into PostgreSQL `orders` table.

3. **Working Contact Form (`/`)**:
   - Submits messages via REST API (`POST /api/contact`) and stores them directly in PostgreSQL `contact_messages` table.

4. **PostgreSQL Admin Panel (`/admin.html`)**:
   - Real-time metric cards (Total Products, Orders, Revenue, Messages).
   - Manage Store Products: Add new product to PostgreSQL, Delete product.
   - Contact Messages Inbox: View incoming inquiries sent from the portfolio contact form.
