import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types/ecommerce';
import { 
  Search, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Package,
  Layers,
  Tag
} from 'lucide-react';

interface AdminProductListProps {
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
}

export const AdminProductList: React.FC<AdminProductListProps> = ({
  onOpenAddProduct,
  onEditProduct
}) => {
  const { products, toggleStockStatus, deleteProduct, resetToDefaultCatalog } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = products.filter(p => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
      
      {/* Header Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom pb-3 mb-3">
        <div>
          <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <Layers className="text-warning" /> Catalog Product Management ({products.length} Total Items)
          </h5>
          <span className="small text-muted">Edit price, details, discount offers, and 1-click toggle stock availability</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 font-mono"
            onClick={() => {
              if (window.confirm('Reset all catalog modifications to default 105 products?')) {
                resetToDefaultCatalog();
              }
            }}
            title="Reset dataset to default 105 items"
          >
            <RotateCcw size={14} /> Reset 105 Dataset
          </button>

          <button 
            className="btn btn-warning fw-bold btn-sm d-flex align-items-center gap-1"
            onClick={onOpenAddProduct}
          >
            <PlusCircle size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Filter controls */}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-light"><Search size={16} /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Filter products by title or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-6">
          <select 
            className="form-select form-select-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories ({products.length})</option>
            <option value="Fashion">Fashion</option>
            <option value="Electronics">Electronics</option>
            <option value="Home & Living">Home & Living</option>
            <option value="Sports & Fitness">Sports & Fitness</option>
            <option value="Footwear">Footwear</option>
            <option value="Beauty & Care">Beauty & Care</option>
            <option value="Accessories">Accessories</option>
            <option value="Watches & Jewelry">Watches & Jewelry</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr className="small text-uppercase">
              <th>Product</th>
              <th>Category</th>
              <th>Selling Price</th>
              <th>MRP / Offer %</th>
              <th>Stock Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">
                  No items found matching "{searchTerm}".
                </td>
              </tr>
            ) : (
              filtered.map(p => {
                const isOut = !p.inStock || p.stockQuantity <= 0;

                return (
                  <tr key={p.id}>
                    
                    {/* Title & Image */}
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img 
                          src={p.imageUrl} 
                          alt={p.name} 
                          className="rounded border object-cover" 
                          style={{ width: '45px', height: '45px' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div>
                          <div className="fw-bold small text-dark text-truncate" style={{ maxWidth: '220px' }}>
                            {p.name}
                          </div>
                          <span className="x-small font-mono text-muted">ID: {p.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="badge bg-light text-dark border small">
                        {p.category}
                      </span>
                    </td>

                    {/* Selling Price */}
                    <td className="fw-bold font-mono text-dark">
                      ₹{p.price.toLocaleString()}
                    </td>

                    {/* Offer / Discount */}
                    <td>
                      {p.discountPercent ? (
                        <span className="badge bg-danger text-white">
                          -{p.discountPercent}% OFF
                        </span>
                      ) : (
                        <span className="small text-muted">-</span>
                      )}
                    </td>

                    {/* Stock Status Toggle */}
                    <td>
                      <button
                        className={`btn btn-xs fw-bold rounded-pill px-3 ${
                          isOut ? 'btn-danger' : 'btn-success'
                        }`}
                        onClick={() => toggleStockStatus(p.id)}
                        title="Click to toggle Stock Status"
                      >
                        {isOut ? (
                          <span className="d-flex align-items-center gap-1">
                            <XCircle size={12} /> OUT OF STOCK
                          </span>
                        ) : (
                          <span className="d-flex align-items-center gap-1">
                            <CheckCircle2 size={12} /> IN STOCK ({p.stockQuantity})
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <button 
                          className="btn btn-sm btn-outline-primary p-1 px-2"
                          onClick={() => onEditProduct(p)}
                          title="Edit Details / Price"
                        >
                          <Edit3 size={14} /> Edit
                        </button>

                        <button 
                          className="btn btn-sm btn-outline-danger p-1 px-2"
                          onClick={() => {
                            if (window.confirm(`Delete "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
