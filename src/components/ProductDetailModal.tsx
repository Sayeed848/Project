import React, { useState } from 'react';
import { Product } from '../types/ecommerce';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Heart, 
  Check, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenCheckoutDirectly?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  onClose,
  onOpenCheckoutDirectly 
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) return null;

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = !product.inStock || product.stockQuantity <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex={-1} 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)' }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          
          {/* Header Close */}
          <div className="modal-header border-0 pb-0 justify-content-end">
            <button 
              type="button" 
              className="btn-close bg-light p-2 rounded-circle" 
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          <div className="modal-body p-4 pt-0">
            <div className="row g-4 align-items-center">
              
              {/* Product Image */}
              <div className="col-md-6 text-center">
                <div className="position-relative bg-light rounded-4 overflow-hidden p-3 border">
                  {product.badge && !isOutOfStock && (
                    <span className={`product-badge badge-${product.badge}`}>
                      {product.badge}
                    </span>
                  )}

                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="img-fluid rounded-3"
                    style={{ maxHeight: '360px', objectFit: 'contain', width: '100%' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="col-md-6">
                <span className="badge bg-dark text-warning uppercase font-mono mb-2">
                  {product.category}
                </span>

                <h4 className="fw-bold text-dark mb-2">{product.name}</h4>

                {/* Rating */}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="d-flex align-items-center text-warning">
                    <Star size={16} className="fill-warning" />
                    <span className="fw-bold ms-1 text-dark">{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted small">({product.reviewsCount} customer reviews)</span>
                </div>

                {/* Pricing */}
                <div className="d-flex align-items-baseline gap-3 mb-3">
                  <span className="fs-3 fw-extrabold text-dark">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="fs-6 text-muted text-decoration-line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {product.discountPercent && (
                    <span className="badge bg-danger text-white px-2 py-1">
                      Save {product.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-3">
                  {isOutOfStock ? (
                    <span className="badge bg-danger text-white px-3 py-2 fw-bold rounded-pill">
                      Out of Stock
                    </span>
                  ) : (
                    <span className="badge bg-success-subtle text-success px-3 py-2 fw-bold rounded-pill">
                      In Stock ({product.stockQuantity} available)
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-muted small mb-3">
                  {product.description}
                </p>

                {/* Specifications List */}
                {product.specs && product.specs.length > 0 && (
                  <div className="mb-4">
                    <div className="small fw-bold text-dark mb-1">Key Features & Specifications:</div>
                    <ul className="list-unstyled mb-0 row g-1">
                      {product.specs.map((spec, idx) => (
                        <li key={idx} className="col-6 small text-secondary d-flex align-items-center gap-1">
                          <Check size={12} className="text-success" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quantity & Actions */}
                {!isOutOfStock && (
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <span className="small fw-bold text-dark">Quantity:</span>
                    <div className="input-group input-group-sm" style={{ width: '120px' }}>
                      <button 
                        className="btn btn-outline-secondary" 
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      >
                        <Minus size={14} />
                      </button>
                      <input 
                        type="text" 
                        className="form-control text-center fw-bold" 
                        value={quantity} 
                        readOnly 
                      />
                      <button 
                        className="btn btn-outline-secondary" 
                        onClick={() => setQuantity(prev => Math.min(product.stockQuantity, prev + 1))}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-dark fw-bold px-4 py-2 flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={18} />
                    <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>

                  <button
                    className={`btn btn-outline-danger p-2 px-3 ${isFavorite ? 'active bg-danger text-white' : ''}`}
                    onClick={() => toggleWishlist(product)}
                    title="Toggle Wishlist"
                  >
                    <Heart size={20} className={isFavorite ? 'fill-white' : ''} />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="d-flex align-items-center justify-content-between pt-3 mt-3 border-top x-small text-muted">
                  <span className="d-flex align-items-center gap-1"><Truck size={14} /> Express Delivery</span>
                  <span className="d-flex align-items-center gap-1"><ShieldCheck size={14} /> Secure Checkout</span>
                  <span className="d-flex align-items-center gap-1"><RefreshCw size={14} /> Easy Returns</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
