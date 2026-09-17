import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Heart, 
  Search, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  SlidersHorizontal,
  PlusCircle,
  Tag
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAdminLogin: () => void;
  onOpenAddProduct: () => void;
  onToggleMobileFilter: () => void;
  activeView: 'store' | 'admin';
  setActiveView: (view: 'store' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenWishlist,
  onOpenAdminLogin,
  onOpenAddProduct,
  onToggleMobileFilter,
  activeView,
  setActiveView
}) => {
  const { 
    cart, 
    wishlist, 
    filters, 
    setFilters, 
    isAdminLoggedIn, 
    logoutAdmin 
  } = useShop();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = wishlist.length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-custom text-white">
        <div className="container-fluid max-w-7xl">
          <div className="d-flex align-items-center gap-3 w-100 justify-content-between">
            
            {/* Logo */}
            <div className="d-flex align-items-center gap-3">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setActiveView('store'); }}
                className="brand-logo"
              >
                <ShoppingBag className="text-warning" size={28} />
                <span>ShopZone</span>
              </a>

              {isAdminLoggedIn && (
                <span className="admin-badge-indicator d-none d-sm-inline-block">
                  <ShieldCheck size={12} className="me-1" />
                  Admin Panel Active
                </span>
              )}
            </div>

            {/* Live Search Bar */}
            {activeView === 'store' && (
              <div className="search-input-group d-none d-md-flex align-items-center">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search over 100+ items (e.g., Hoodie, Smart Watch, Serum)..."
                    value={filters.searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button className="btn btn-search" type="button">
                    <Search size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="d-flex align-items-center gap-2 gap-sm-3">
              
              {/* Mobile Filter Toggle */}
              {activeView === 'store' && (
                <button 
                  className="nav-icon-btn d-md-none" 
                  onClick={onToggleMobileFilter}
                  title="Filter Products"
                >
                  <SlidersHorizontal size={20} />
                </button>
              )}

              {/* View Mode Switcher for Admin */}
              {isAdminLoggedIn && (
                <div className="btn-group btn-group-sm me-1" role="group">
                  <button
                    type="button"
                    className={`btn ${activeView === 'store' ? 'btn-warning fw-bold' : 'btn-outline-light'}`}
                    onClick={() => setActiveView('store')}
                  >
                    Storefront
                  </button>
                  <button
                    type="button"
                    className={`btn ${activeView === 'admin' ? 'btn-warning fw-bold' : 'btn-outline-light'}`}
                    onClick={() => setActiveView('admin')}
                  >
                    Admin Dashboard
                  </button>
                </div>
              )}

              {/* Quick Admin Add Product button if logged in */}
              {isAdminLoggedIn && (
                <button
                  className="btn btn-sm btn-outline-warning d-none d-lg-flex align-items-center gap-1"
                  onClick={onOpenAddProduct}
                  title="Add New Product"
                >
                  <PlusCircle size={16} />
                  <span>+ Product</span>
                </button>
              )}

              {/* Wishlist Button */}
              <button 
                className="nav-icon-btn" 
                onClick={onOpenWishlist}
                title="View Wishlist"
              >
                <Heart size={20} />
                {totalWishlistCount > 0 && (
                  <span className="badge-counter">{totalWishlistCount}</span>
                )}
              </button>

              {/* Shopping Cart Button */}
              <button 
                className="nav-icon-btn" 
                onClick={onOpenCart}
                title="View Cart"
              >
                <ShoppingCart size={20} />
                {totalCartCount > 0 && (
                  <span className="badge-counter">{totalCartCount}</span>
                )}
              </button>

              {/* Admin Login / Logout */}
              {isAdminLoggedIn ? (
                <button
                  className="btn btn-sm btn-danger d-flex align-items-center gap-1 ms-1"
                  onClick={logoutAdmin}
                  title="Logout Admin"
                >
                  <LogOut size={16} />
                  <span className="d-none d-sm-inline">Logout</span>
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1 ms-1"
                  onClick={onOpenAdminLogin}
                  title="Admin Login"
                >
                  <LogIn size={16} />
                  <span className="d-none d-sm-inline">Admin Login</span>
                </button>
              )}
            </div>

          </div>

          {/* Mobile Search Bar Row */}
          {activeView === 'store' && (
            <div className="w-100 mt-2 d-md-none">
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Search 100+ products..."
                  value={filters.searchQuery}
                  onChange={handleSearchChange}
                />
                <button className="btn btn-warning" type="button">
                  <Search size={16} />
                </button>
              </div>
            </div>
          )}

        </div>
      </nav>
    </header>
  );
};
