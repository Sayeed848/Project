import React from 'react';
import { Product } from '../types/ecommerce';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onQuickView,
  onEditProduct 
}) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    isAdminLoggedIn, 
    toggleStockStatus, 
    deleteProduct 
  } = useShop();

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = !product.inStock || product.stockQuantity <= 0;

  return (
    <div className="product-card">
      
      {/* Product Image Container */}
      <div className="product-img-container">
        
        {/* Badge */}
        {product.badge && !isOutOfStock && (
          <span className={`product-badge badge-${product.badge}`}>
            {product.badge}
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button 
          className={`wishlist-btn-corner ${isFavorite ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} className={isFavorite ? "fill-danger text-danger" : ""} />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="out-of-stock-overlay">
            <span className="out-of-stock-tag">
              Out of Stock
            </span>
          </div>
        )}

        {/* Product Image */}
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            // Fallback image if link breaks
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Quick View Button on Hover */}
        <button 
          className="btn btn-sm btn-light position-absolute bottom-0 start-50 translate-middle-x mb-2 shadow-sm rounded-pill px-3 py-1 fw-semibold opacity-90 d-flex align-items-center gap-1"
          onClick={() => onQuickView(product)}
          style={{ zIndex: 4 }}
        >
          <Eye size={14} /> Quick View
        </button>

      </div>

      {/* Card Body */}
      <div className="card-body-content">
        <span className="product-category-text">{product.category}</span>
        
        <h6 className="product-title-text" title={product.name}>
          {product.name}
        </h6>

        {/* Rating Stars */}
        <div className="rating-stars">
          <Star size={14} className="fill-warning text-warning" />
          <span className="fw-bold text-dark">{product.rating.toFixed(1)}</span>
          <span className="text-muted x-small">({product.reviewsCount})</span>

          {!isOutOfStock && product.stockQuantity < 10 && (
            <span className="badge bg-danger-subtle text-danger ms-auto x-small d-flex align-items-center gap-1">
              <AlertTriangle size={10} /> Only {product.stockQuantity} left
            </span>
          )}
        </div>

        {/* Price & Discount */}
        <div className="price-container">
          <span className="current-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
              {product.discountPercent && (
                <span className="discount-pill">-{product.discountPercent}%</span>
              )}
            </>
          )}
        </div>

        {/* Customer Action Button */}
        <button
          className="btn-add-cart mb-2"
          disabled={isOutOfStock}
          onClick={() => addToCart(product)}
        >
          <ShoppingCart size={16} />
          <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>

        {/* Admin Direct Controls Bar */}
        {isAdminLoggedIn && (
          <div className="mt-2 pt-2 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
            <button
              className={`btn btn-xs ${isOutOfStock ? 'btn-success' : 'btn-outline-danger'} d-flex align-items-center gap-1 font-mono`}
              onClick={() => toggleStockStatus(product.id)}
              title="Toggle Stock Availability"
            >
              {isOutOfStock ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
              <span>{isOutOfStock ? 'Make In Stock' : 'Make Out of Stock'}</span>
            </button>

            <div className="d-flex align-items-center gap-1">
              {onEditProduct && (
                <button
                  className="btn btn-xs btn-outline-primary p-1"
                  onClick={() => onEditProduct(product)}
                  title="Edit Product"
                >
                  <Edit3 size={14} />
                </button>
              )}
              <button
                className="btn btn-xs btn-outline-danger p-1"
                onClick={() => deleteProduct(product.id)}
                title="Delete Product"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
