import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { NotificationToast } from './components/NotificationToast';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AddEditProductModal } from './components/admin/AddEditProductModal';
import { Product } from './types/ecommerce';
import { SlidersHorizontal, X } from 'lucide-react';

const ShopAppContent: React.FC = () => {
  const { isAdminLoggedIn } = useShop();

  const [activeView, setActiveView] = useState<'store' | 'admin'>('store');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsAddProductOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsAddProductOpen(true);
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      
      {/* Top Navigation */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAddProduct={handleOpenAddProduct}
        onToggleMobileFilter={() => setIsMobileFilterOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Body */}
      <main className="flex-grow-1">
        
        {activeView === 'admin' && isAdminLoggedIn ? (
          /* Admin Dashboard View */
          <AdminDashboard />
        ) : (
          /* Customer Storefront View */
          <>
            <HeroBanner />
            <CategoryBar />

            <div className="container-fluid max-w-7xl px-3 my-4">
              <div className="row g-4">
                
                {/* Desktop Filter Sidebar (3 cols) */}
                <aside className="col-lg-3 d-none d-lg-block">
                  <div className="sticky-top" style={{ top: '90px' }}>
                    <FilterSidebar />
                  </div>
                </aside>

                {/* Product Catalog Grid (9 cols) */}
                <section className="col-lg-9 col-12">
                  <ProductGrid
                    onQuickView={(product) => setQuickViewProduct(product)}
                    onEditProduct={handleOpenEditProduct}
                  />
                </section>

              </div>
            </div>
          </>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Filter Drawer Overlay */}
      {isMobileFilterOpen && (
        <div 
          className="modal fade show d-block d-lg-none" 
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', zIndex: 1080 }}
        >
          <div className="modal-dialog modal-dialog-scrollable ms-0 me-auto my-0 h-100" style={{ maxWidth: '320px' }}>
            <div className="modal-content h-100 border-0 rounded-0">
              <div className="modal-header bg-dark text-white py-3">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <SlidersHorizontal size={18} className="text-warning" /> Filter Catalog
                </h6>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setIsMobileFilterOpen(false)} 
                />
              </div>
              <div className="modal-body p-3">
                <FilterSidebar onCloseMobile={() => setIsMobileFilterOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawers and Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />

      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setActiveView('admin')}
      />

      <AddEditProductModal
        isOpen={isAddProductOpen}
        productToEdit={editingProduct}
        onClose={() => setIsAddProductOpen(false)}
      />

      <NotificationToast />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ShopProvider>
      <ShopAppContent />
    </ShopProvider>
  );
};

export default App;
