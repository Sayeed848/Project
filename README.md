# 🛒 ShopZone Advanced - E-Commerce & Admin Control Studio

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-purple?logo=bootstrap)
![Vite](https://img.shields.io/badge/Vite-5.1.4-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-ISC-green)

**ShopZone Advanced** is a full-featured, enterprise-grade e-commerce application built with **React.js**, **TypeScript**, **Bootstrap 5**, **HTML5**, **CSS3**, and **JavaScript**. 

It features an interactive customer storefront with over **105+ catalog items** across 8 categories, instant live search, multi-criteria sidebar filters, price slider, shopping cart drawer with promo discount codes, wishlist, product quick-view modal, and a complete **Admin Control Studio** for managing inventory, prices, promotional offers, and out-of-stock toggles.

---

## 🔥 Key Features

### 🛍️ Customer E-Commerce Experience
* **105+ Pre-Seeded Product Catalog**: Spanning *Fashion & Apparel*, *Electronics & Tech*, *Home & Living*, *Sports & Fitness*, *Footwear*, *Beauty & Care*, *Accessories*, and *Watches & Jewelry*.
* **Direct Web Image Links**: Clean, high-resolution direct HTTPS image URLs from Unsplash and Google CDN (zero base64 strings).
* **Live Instant Search**: Real-time filtering across titles, categories, and descriptions.
* **Multi-Criteria Filter System**:
  * Category Pills bar with item count indicators.
  * Price Range Slider (₹500 to ₹20,000+).
  * In Stock Only & Discounted/On-Sale Only toggles.
  * Minimum Rating filter (4.5+ stars, 4.0+ stars).
* **Flexible Sorting**: Sort by Featured, Price (Low to High / High to Low), Rating, Discount %, and Alphabetical (A-Z).
* **Shopping Cart Drawer**: Slide-out cart with quantity adjustment (+/-), item removal, subtotal & shipping calculation, promo coupon application (`SAVE30`, `FESTIVE20`, `WELCOME10`), and Checkout modal trigger.
* **Saved Wishlist**: Save favorite items with persistent local storage.
* **Product Detail Quick View**: High-res gallery preview, key specifications list, customer reviews, and stock quantity badges.
* **Checkout Wizard**: Shipping details form, payment method selector (UPI, Credit/Debit Card, Net Banking, COD), and printable order receipt.

---

### 🛡️ Admin Control Studio
* **Admin Authentication**: Secured modal login (`username: admin`, `password: admin123`) + 1-Click Demo Login button.
* **Inventory & Revenue Dashboard**: Real-time stats on total catalog items, total inventory valuation (₹), out-of-stock count, low stock warnings, and total sales revenue.
* **1-Click Out-of-Stock Toggle**: Instantly toggle any product between **In Stock** and **Out of Stock**.
* **Add New Product Modal**: Form supporting Title, Category, Selling Price, MRP, Discount %, Stock Quantity, Image URL (with live web image preview), Description, and Specifications.
* **Edit Details & Price**: Live update price, discount %, description, and stock status for any item.
* **Offers & Promos Manager**: Admin can create and delete promotional coupon codes with minimum spend requirements.
* **Reset Catalog Dataset**: One-click restore button to reset all edits back to the default 105 catalog items.

---

### 💾 LocalStorage Persistence
All changes made in the store — including newly added products, price updates, stock status toggles, cart items, wishlist items, promo codes, and orders — automatically persist in your browser's `localStorage`!

---

## 🛠️ Tech Stack & Architecture

| Technology | Purpose |
| :--- | :--- |
| **React 18** | Modular Component Architecture & Functional State Hooks |
| **TypeScript 5** | Strict Type Definitions (`Product`, `CartItem`, `Order`, `PromoCoupon`, `FilterState`) |
| **Bootstrap 5** | Responsive Grid System, Drawers, Modals, Badges, Cards, and Toasts |
| **Lucide Icons** | Modern SVG Vector Icon set |
| **Custom CSS3** | Luxury Dark & Gold Aesthetic, Glassmorphism Hero, Animations |
| **Vite 5** | Next-Generation Frontend Tooling & Fast HMR Development Server |
| **Context API** | Centralized Global Shop State Management (`ShopContext.tsx`) |

---

## 📁 Project Directory Structure

```
c:\Users\walia\OneDrive\Desktop\githubpush\Project\
├── index.html                    # Root entry html launcher
├── package.json                  # React + TypeScript + Vite + Bootstrap dependencies
├── vite.config.ts                # Vite build & alias configuration
├── tsconfig.json                 # TypeScript compiler setup
├── README.md                     # Project documentation
└── src/
    ├── main.tsx                  # React DOM root entry point
    ├── App.tsx                   # Main App Component (Views, Drawers, Modals)
    ├── index.css                 # Global luxury CSS & Bootstrap custom styling
    ├── types/
    │   └── ecommerce.ts          # TypeScript interfaces (Product, CartItem, Order, etc.)
    ├── data/
    │   └── productsData.ts       # 105 pre-seeded products with Unsplash HTTPS image links
    ├── context/
    │   └── ShopContext.tsx       # React Context API with LocalStorage sync
    ├── components/
    │   ├── Navbar.tsx            # Navigation header with live search & cart counter
    │   ├── HeroBanner.tsx        # Hero banner with promo code shortcuts
    │   ├── CategoryBar.tsx       # Scrollable category pills with icon indicators
    │   ├── FilterSidebar.tsx     # Price slider, Rating, Stock & Discount filters
    │   ├── ProductCard.tsx       # Product card with out-of-stock overlay & wishlist heart
    │   ├── ProductGrid.tsx       # Responsive product grid & pagination
    │   ├── ProductDetailModal.tsx# Quick view modal with specs & reviews
    │   ├── CartDrawer.tsx        # Slide-out cart drawer with promo code application
    │   ├── WishlistDrawer.tsx    # Saved wishlist drawer
    │   ├── CheckoutModal.tsx     # Checkout wizard & receipt step
    │   ├── NotificationToast.tsx # Toast alerts for cart and admin actions
    │   └── Footer.tsx            # E-commerce footer
    └── components/admin/
        ├── AdminDashboard.tsx    # Admin metrics overview & statistics
        ├── AdminProductList.tsx  # Interactive product management table with quick toggles
        ├── AddEditProductModal.tsx# Product creation/editing form with image preview
        ├── OffersManager.tsx     # Promo coupon manager
        └── AdminLoginModal.tsx   # Admin login modal
```

---

## ⚡ Quick Start & Installation

### Prerequisites
Make sure you have **Node.js** (v16+) and **npm** installed on your system.

### Step 1: Open Terminal in Project Folder
Navigate to the project directory:
```bash
cd c:\Users\walia\OneDrive\Desktop\githubpush\Project
```

### Step 2: Install Dependencies
Run the following command to install all required npm packages:
```bash
npm install
```

### Step 3: Run the Development Server
Launch the local development server:
```bash
npm run dev
```

### Step 4: Open in Web Browser
Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)** *(or the port displayed in your terminal)*

---

## 🔑 Admin Login Credentials

To access the **Admin Studio**:
1. Click **Admin Login** in the top navigation bar.
2. Enter the following credentials:
   * **Username:** `admin`
   * **Password:** `admin123`
3. *(Or click the **Quick 1-Click Demo Admin Login** button inside the modal!)*

---

## 📜 Available NPM Scripts

* `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
* `npm run build`: Compiles TypeScript types and builds production static bundle in `dist/`.
* `npm run preview`: Locally previews the production build.

---

## 👤 Author & Credits

* **Built by:** Sayeed Alam
* **License:** ISC
