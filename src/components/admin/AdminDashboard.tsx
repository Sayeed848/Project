import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types/ecommerce';
import { AdminProductList } from './AdminProductList';
import { OffersManager } from './OffersManager';
import { AddEditProductModal } from './AddEditProductModal';
import { 
  Package, 
  AlertTriangle, 
  DollarSign, 
  ShoppingBag, 
  Tag, 
  ShieldCheck,
  PlusCircle,
  BarChart3
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { products, promos, orders } = useShop();

  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * p.stockQuantity), 0);
  const outOfStockItems = products.filter(p => !p.inStock || p.stockQuantity <= 0);
  const lowStockItems = products.filter(p => p.inStock && p.stockQuantity < 10);
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  const handleOpenAdd = () => {
    setProductToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setProductToEdit(p);
    setIsAddEditOpen(true);
  };

  return (
    <div className="container-fluid max-w-7xl px-3 my-4">
      
      {/* Admin Title Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 bg-dark text-white p-4 rounded-4 shadow-sm border border-secondary border-opacity-25">
        <div>
          <span className="badge bg-danger font-mono text-uppercase px-3 py-1 mb-2">
            <ShieldCheck size={14} className="me-1" /> Admin Control Studio
          </span>
          <h2 className="fw-extrabold text-white mb-1">
            Store Management & Inventory Control
          </h2>
          <p className="text-secondary small mb-0">
            Manage your 100+ product catalog, edit prices & offers, toggle out of stock items, and monitor store analytics.
          </p>
        </div>

        <button 
          className="btn btn-warning fw-bold px-4 py-2 rounded-3 d-flex align-items-center gap-2 shadow-sm"
          onClick={handleOpenAdd}
        >
          <PlusCircle size={20} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        
        {/* Metric 1 */}
        <div className="col-6 col-md-3">
          <div className="admin-card-stat">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-bold text-uppercase">Total Catalog</span>
              <Package className="text-warning" size={22} />
            </div>
            <div className="fs-3 fw-extrabold text-dark font-mono">{products.length}</div>
            <div className="x-small text-muted">Active Storefront Items</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="col-6 col-md-3">
          <div className="admin-card-stat">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-bold text-uppercase">Inventory Value</span>
              <DollarSign className="text-success" size={22} />
            </div>
            <div className="fs-3 fw-extrabold text-dark font-mono">₹{(totalInventoryValue / 1000).toFixed(1)}k</div>
            <div className="x-small text-muted">Total Stock Valuation</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="col-6 col-md-3">
          <div className="admin-card-stat">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-bold text-uppercase">Out of Stock</span>
              <AlertTriangle className="text-danger" size={22} />
            </div>
            <div className="fs-3 fw-extrabold text-danger font-mono">{outOfStockItems.length}</div>
            <div className="x-small text-muted">{lowStockItems.length} items low stock</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="col-6 col-md-3">
          <div className="admin-card-stat">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small text-muted fw-bold text-uppercase">Sales Orders</span>
              <ShoppingBag className="text-primary" size={22} />
            </div>
            <div className="fs-3 fw-extrabold text-dark font-mono">{orders.length}</div>
            <div className="x-small text-success fw-bold">₹{totalRevenue.toLocaleString()} Revenue</div>
          </div>
        </div>

      </div>

      {/* Offers Manager Component */}
      <OffersManager />

      {/* Product List Table Component */}
      <AdminProductList
        onOpenAddProduct={handleOpenAdd}
        onEditProduct={handleOpenEdit}
      />

      {/* Add / Edit Product Modal */}
      <AddEditProductModal
        isOpen={isAddEditOpen}
        productToEdit={productToEdit}
        onClose={() => setIsAddEditOpen(false)}
      />

    </div>
  );
};
