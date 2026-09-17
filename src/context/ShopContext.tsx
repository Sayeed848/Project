import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  PromoCoupon, 
  FilterState, 
  Order, 
  Notification, 
  Category 
} from '../types/ecommerce';
import { INITIAL_PRODUCTS, INITIAL_PROMOS } from '../data/productsData';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  promos: PromoCoupon[];
  appliedPromo: PromoCoupon | null;
  isAdminLoggedIn: boolean;
  filters: FilterState;
  notifications: Notification[];
  orders: Order[];
  
  // Filters State Actions
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  
  // Customer Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  placeOrder: (customer: { name: string; email: string; address: string; paymentMethod: string }) => Order | null;
  
  // Admin Actions
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
  toggleAdminMode: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updatedData: Partial<Product>) => void;
  toggleStockStatus: (id: string) => void;
  deleteProduct: (id: string) => void;
  resetToDefaultCatalog: () => void;
  addPromoCode: (promo: PromoCoupon) => void;
  deletePromoCode: (code: string) => void;
  
  // Toasts
  showNotification: (type: Notification['type'], message: string) => void;
  removeNotification: (id: string) => void;
}

const defaultFilters: FilterState = {
  category: 'All',
  searchQuery: '',
  maxPrice: 20000,
  minRating: 0,
  inStockOnly: false,
  onSaleOnly: false,
  sortBy: 'featured'
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. LocalStorage initialization
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('shopzone_products_v2');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopzone_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('shopzone_wishlist_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promos, setPromos] = useState<PromoCoupon[]>(() => {
    try {
      const saved = localStorage.getItem('shopzone_promos_v2');
      return saved ? JSON.parse(saved) : INITIAL_PROMOS;
    } catch {
      return INITIAL_PROMOS;
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<PromoCoupon | null>(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('shopzone_admin_logged') === 'true';
    } catch {
      return false;
    }
  });

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('shopzone_orders_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('shopzone_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('shopzone_cart_v2', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shopzone_wishlist_v2', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('shopzone_promos_v2', JSON.stringify(promos));
  }, [promos]);

  useEffect(() => {
    localStorage.setItem('shopzone_admin_logged', isAdminLoggedIn.toString());
  }, [isAdminLoggedIn]);

  useEffect(() => {
    localStorage.setItem('shopzone_orders_v2', JSON.stringify(orders));
  }, [orders]);

  // Toast System
  const showNotification = (type: Notification['type'], message: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeNotification(id);
    }, 3500);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Cart Functions
  const addToCart = (product: Product, quantity = 1) => {
    if (!product.inStock || product.stockQuantity <= 0) {
      showNotification('error', `"${product.name}" is currently out of stock.`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stockQuantity) {
          showNotification('warning', `Only ${product.stockQuantity} units available in stock.`);
          return prev;
        }
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity }];
    });

    showNotification('success', `Added "${product.name}" to your shopping cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showNotification('info', 'Item removed from cart.');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          if (quantity > item.product.stockQuantity) {
            showNotification('warning', `Cannot exceed available stock (${item.product.stockQuantity}).`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  // Wishlist Functions
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showNotification('info', `Removed "${product.name}" from wishlist.`);
        return prev.filter(item => item.id !== product.id);
      } else {
        showNotification('success', `Saved "${product.name}" to wishlist.`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  // Promo Code Functions
  const applyPromoCode = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    const found = promos.find(p => p.code === cleaned);

    if (!found) {
      showNotification('error', `Invalid promo code "${cleaned}".`);
      return false;
    }

    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    if (subtotal < found.minSpend) {
      showNotification('warning', `Code "${cleaned}" requires a minimum spend of ₹${found.minSpend}.`);
      return false;
    }

    setAppliedPromo(found);
    showNotification('success', `Coupon "${found.code}" applied! You save ${found.discountPercent}%.`);
    return true;
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showNotification('info', 'Promo code removed.');
  };

  // Reset Filters
  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Checkout Function
  const placeOrder = (customer: { name: string; email: string; address: string; paymentMethod: string }) => {
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discount = appliedPromo ? Math.round((subtotal * appliedPromo.discountPercent) / 100) : 0;
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal - discount + shipping;

    const newOrder: Order = {
      id: "ORD-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      subtotal,
      discount,
      shipping,
      total,
      customerName: customer.name,
      email: customer.email,
      address: customer.address,
      paymentMethod: customer.paymentMethod,
      status: 'Processing'
    };

    // Reduce stock quantities for purchased products
    setProducts(prev =>
      prev.map(p => {
        const cartItem = cart.find(ci => ci.product.id === p.id);
        if (cartItem) {
          const remaining = Math.max(0, p.stockQuantity - cartItem.quantity);
          return {
            ...p,
            stockQuantity: remaining,
            inStock: remaining > 0
          };
        }
        return p;
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    showNotification('success', `🎉 Order ${newOrder.id} placed successfully!`);
    return newOrder;
  };

  // Admin Auth
  const loginAdmin = (user: string, pass: string) => {
    if ((user === 'admin' && pass === 'admin123') || (user === 'admin' && pass === 'admin')) {
      setIsAdminLoggedIn(true);
      showNotification('success', 'Admin logged in successfully! Welcome to Admin Studio.');
      return true;
    }
    showNotification('error', 'Invalid credentials! Try user: "admin", pass: "admin123"');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    showNotification('info', 'Admin logged out.');
  };

  const toggleAdminMode = () => {
    setIsAdminLoggedIn(prev => {
      const next = !prev;
      showNotification(next ? 'success' : 'info', next ? 'Admin Mode Activated' : 'Customer Mode Activated');
      return next;
    });
  };

  // Admin Product Actions
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: "p_" + Date.now() + Math.random().toString(36).substring(2, 5)
    };
    setProducts(prev => [newProduct, ...prev]);
    showNotification('success', `Product "${newProduct.name}" added successfully!`);
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, ...updatedData };
          // Keep inStock boolean synced with stock quantity
          if (updatedData.stockQuantity !== undefined) {
            updated.inStock = updatedData.stockQuantity > 0;
          }
          return updated;
        }
        return p;
      })
    );
    showNotification('success', 'Product updated successfully!');
  };

  const toggleStockStatus = (id: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextStock = !p.inStock;
          return {
            ...p,
            inStock: nextStock,
            stockQuantity: nextStock ? (p.stockQuantity > 0 ? p.stockQuantity : 15) : 0
          };
        }
        return p;
      })
    );
    showNotification('info', 'Product stock status toggled.');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showNotification('warning', `Product "${prod?.name || id}" removed.`);
  };

  const resetToDefaultCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    setPromos(INITIAL_PROMOS);
    localStorage.removeItem('shopzone_products_v2');
    localStorage.removeItem('shopzone_promos_v2');
    showNotification('info', 'Dataset reset to default 105 catalog items.');
  };

  // Admin Promos
  const addPromoCode = (promo: PromoCoupon) => {
    setPromos(prev => [promo, ...prev]);
    showNotification('success', `New promo coupon "${promo.code}" created!`);
  };

  const deletePromoCode = (code: string) => {
    setPromos(prev => prev.filter(p => p.code !== code));
    showNotification('info', `Promo code "${code}" deleted.`);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        promos,
        appliedPromo,
        isAdminLoggedIn,
        filters,
        notifications,
        orders,
        setFilters,
        resetFilters,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyPromoCode,
        removePromoCode,
        placeOrder,
        loginAdmin,
        logoutAdmin,
        toggleAdminMode,
        addProduct,
        updateProduct,
        toggleStockStatus,
        deleteProduct,
        resetToDefaultCatalog,
        addPromoCode,
        deletePromoCode,
        showNotification,
        removeNotification
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
