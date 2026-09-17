import React from 'react';
import { useShop } from '../context/ShopContext';
import { Heart, Trash2, ShoppingCart, X } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  if (!isOpen) return null;

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex={-1} 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)' }}
    >
      <div className="modal-dialog modal-dialog-scrollable ms-auto me-0 my-0 h-100" style={{ maxWidth: '400px' }}>
        <div className="modal-content border-0 h-100 rounded-0 shadow-lg">
          
          {/* Header */}
          <div className="modal-header bg-dark text-white border-secondary border-opacity-25 py-3">
            <div className="d-flex align-items-center gap-2">
              <Heart size={20} className="text-danger fill-danger" />
              <h5 className="modal-title fw-bold">Saved Wishlist</h5>
              <span className="badge bg-danger text-white rounded-pill font-mono ms-2">
                {wishlist.length} Items
              </span>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          {/* Body */}
          <div className="modal-body p-3">
            {wishlist.length === 0 ? (
              <div className="text-center py-5">
                <Heart size={64} className="text-muted opacity-30 mb-3" />
                <h5 className="fw-bold text-dark">Your wishlist is empty</h5>
                <p className="text-muted small">Tap the heart icon on any product card to save it for later.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {wishlist.map(product => {
                  const isOutOfStock = !product.inStock || product.stockQuantity <= 0;

                  return (
                    <div 
                      key={product.id} 
                      className="d-flex gap-3 align-items-center bg-light p-2.5 rounded-3 border"
                    >
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="rounded-2 object-cover" 
                        style={{ width: '60px', height: '60px' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80';
                        }}
                      />

                      <div className="flex-grow-1">
                        <h6 className="mb-1 text-dark fw-bold small text-truncate" style={{ maxWidth: '170px' }}>
                          {product.name}
                        </h6>
                        <div className="fw-bold text-dark mb-1">
                          ₹{product.price.toLocaleString()}
                        </div>

                        {isOutOfStock ? (
                          <span className="badge bg-danger text-white x-small">Out of Stock</span>
                        ) : (
                          <span className="badge bg-success-subtle text-success x-small">In Stock</span>
                        )}
                      </div>

                      <div className="d-flex flex-column gap-1">
                        <button
                          className="btn btn-sm btn-dark p-1 px-2 d-flex align-items-center gap-1"
                          disabled={isOutOfStock}
                          onClick={() => {
                            addToCart(product);
                          }}
                          title="Add to Cart"
                        >
                          <ShoppingCart size={14} />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger p-1 text-center"
                          onClick={() => toggleWishlist(product)}
                          title="Remove from Wishlist"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
