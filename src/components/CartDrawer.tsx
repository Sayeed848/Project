import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onOpenCheckout 
}) => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    appliedPromo, 
    applyPromoCode, 
    removePromoCode,
    promos 
  } = useShop();

  const [couponInput, setCouponInput] = useState<string>('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = appliedPromo 
    ? Math.round((subtotal * appliedPromo.discountPercent) / 100) 
    : 0;
  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const finalTotal = subtotal - discountAmount + shippingFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyPromoCode(couponInput);
      setCouponInput('');
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex={-1} 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(3px)' }}
    >
      <div className="modal-dialog modal-dialog-scrollable ms-auto me-0 my-0 h-100" style={{ maxWidth: '420px' }}>
        <div className="modal-content border-0 h-100 rounded-0 shadow-lg">
          
          {/* Header */}
          <div className="modal-header bg-dark text-white border-secondary border-opacity-25 py-3">
            <div className="d-flex align-items-center gap-2">
              <ShoppingBag size={20} className="text-warning" />
              <h5 className="modal-title fw-bold">Your Shopping Cart</h5>
              <span className="badge bg-warning text-dark font-mono rounded-pill ms-2">
                {cart.reduce((a, b) => a + b.quantity, 0)} Items
              </span>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          {/* Cart Body */}
          <div className="modal-body p-3">
            
            {cart.length === 0 ? (
              <div className="text-center py-5">
                <ShoppingBag size={64} className="text-muted opacity-30 mb-3" />
                <h5 className="fw-bold text-dark">Your cart is empty</h5>
                <p className="text-muted small mb-4">Looks like you haven't added any products yet.</p>
                <button className="btn btn-warning fw-bold px-4 rounded-pill" onClick={onClose}>
                  Explore 100+ Catalog
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {cart.map(item => (
                  <div 
                    key={item.product.id} 
                    className="d-flex gap-3 align-items-center bg-light p-2 rounded-3 border"
                  >
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="rounded-2 object-cover" 
                      style={{ width: '65px', height: '65px' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80';
                      }}
                    />

                    <div className="flex-grow-1">
                      <h6 className="mb-1 text-dark fw-bold small text-truncate" style={{ maxWidth: '190px' }}>
                        {item.product.name}
                      </h6>
                      <div className="fw-bold text-dark mb-1">
                        ₹{item.product.price.toLocaleString()}
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <div className="input-group input-group-sm" style={{ width: '90px' }}>
                          <button 
                            className="btn btn-outline-secondary btn-xs p-1"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="form-control text-center p-0 fw-bold small bg-white d-flex align-items-center justify-content-center">
                            {item.quantity}
                          </span>
                          <button 
                            className="btn btn-outline-secondary btn-xs p-1"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="small text-muted ms-auto font-mono">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button 
                      className="btn btn-sm text-danger p-1"
                      onClick={() => removeFromCart(item.product.id)}
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Footer Summary & Coupon */}
          {cart.length > 0 && (
            <div className="modal-footer d-flex flex-column border-top p-3 bg-light">
              
              {/* Promo Code Form */}
              <div className="w-100 mb-2">
                {appliedPromo ? (
                  <div className="d-flex align-items-center justify-content-between bg-success-subtle border border-success p-2 rounded-3 text-success small fw-bold">
                    <span className="d-flex align-items-center gap-1">
                      <Tag size={14} /> Coupon "{appliedPromo.code}" Applied ({appliedPromo.discountPercent}% OFF)
                    </span>
                    <button 
                      className="btn btn-xs text-danger text-decoration-none fw-bold"
                      onClick={removePromoCode}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="input-group input-group-sm">
                    <input 
                      type="text" 
                      className="form-control text-uppercase" 
                      placeholder="Enter Promo Code (e.g. SAVE30)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <button className="btn btn-dark fw-bold" type="submit">
                      Apply
                    </button>
                  </form>
                )}

                {/* Available Promo Chips */}
                {!appliedPromo && (
                  <div className="d-flex flex-wrap gap-1 mt-2">
                    {promos.map(p => (
                      <button
                        key={p.code}
                        type="button"
                        className="badge bg-warning-subtle text-dark border border-warning font-mono cursor-pointer"
                        onClick={() => applyPromoCode(p.code)}
                      >
                        ⚡ {p.code} ({p.discountPercent}% OFF)
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Calculations */}
              <div className="w-100 small text-secondary d-flex flex-column gap-1 mb-3 pt-2 border-top">
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span className="fw-bold text-dark">₹{subtotal.toLocaleString()}</span>
                </div>

                {appliedPromo && (
                  <div className="d-flex justify-content-between text-success">
                    <span>Discount ({appliedPromo.discountPercent}%):</span>
                    <span className="fw-bold">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between">
                  <span>Delivery Charge:</span>
                  {shippingFee === 0 ? (
                    <span className="fw-bold text-success">FREE</span>
                  ) : (
                    <span className="fw-bold text-dark">₹{shippingFee}</span>
                  )}
                </div>

                <div className="d-flex justify-content-between fs-5 fw-extrabold text-dark pt-2 border-top">
                  <span>Total Amount:</span>
                  <span className="text-dark">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                className="btn btn-warning w-100 fw-bold py-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
