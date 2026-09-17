import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types/ecommerce';
import { CheckCircle, ShoppingBag, ShieldCheck, ArrowRight, Printer } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, appliedPromo, placeOrder } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / GPay / PhonePe');

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = appliedPromo 
    ? Math.round((subtotal * appliedPromo.discountPercent) / 100) 
    : 0;
  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal - discountAmount + shippingFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !address) {
      alert('Please fill out all required fields.');
      return;
    }

    const order = placeOrder({
      name,
      email,
      address: `${address} | Contact: ${mobile}`,
      paymentMethod
    });

    if (order) {
      setConfirmedOrder(order);
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex={-1} 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(5px)' }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          
          {confirmedOrder ? (
            /* Step 2: Order Receipt / Confirmation Screen */
            <div className="modal-body p-4 text-center">
              <div className="my-3">
                <CheckCircle size={64} className="text-success mb-3" />
                <h3 className="fw-extrabold text-dark">Order Confirmed!</h3>
                <p className="text-muted small">
                  Thank you, <strong>{confirmedOrder.customerName}</strong>! Your order has been placed successfully.
                </p>
              </div>

              <div className="bg-light p-3 rounded-4 border text-start mb-4">
                <div className="d-flex justify-content-between border-bottom pb-2 mb-2 font-mono">
                  <span className="small text-muted">Order ID:</span>
                  <span className="fw-bold text-dark">{confirmedOrder.id}</span>
                </div>

                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                  <span className="small text-muted">Date:</span>
                  <span className="small text-dark fw-semibold">{confirmedOrder.date}</span>
                </div>

                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                  <span className="small text-muted">Payment Method:</span>
                  <span className="small text-dark fw-semibold">{confirmedOrder.paymentMethod}</span>
                </div>

                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                  <span className="small text-muted">Shipping Address:</span>
                  <span className="small text-dark fw-semibold">{confirmedOrder.address}</span>
                </div>

                <div className="mt-3">
                  <div className="small fw-bold text-dark mb-2">Items Ordered:</div>
                  {confirmedOrder.items.map(ci => (
                    <div key={ci.product.id} className="d-flex justify-content-between small text-secondary mb-1">
                      <span>{ci.product.name} x {ci.quantity}</span>
                      <span className="font-mono text-dark">₹{(ci.product.price * ci.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-top pt-2 mt-2 d-flex justify-content-between fw-bold fs-6 text-dark">
                  <span>Total Paid:</span>
                  <span className="text-success font-mono">₹{confirmedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button 
                  className="btn btn-warning fw-bold px-4 rounded-pill"
                  onClick={() => {
                    setConfirmedOrder(null);
                    onClose();
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Step 1: Checkout Form */
            <div className="modal-body p-4">
              <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                <h4 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <ShieldCheck className="text-warning" /> Complete Your Checkout
                </h4>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={onClose} 
                  aria-label="Close" 
                />
              </div>

              <form onSubmit={handleSubmitOrder}>
                <div className="row g-4">
                  
                  {/* Left Column: Form Details */}
                  <div className="col-md-7">
                    <h6 className="fw-bold text-dark mb-3">1. Shipping & Contact Details</h6>
                    
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Full Name *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required 
                        placeholder="e.g. Sayeed Alam"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-bold">Email Address *</label>
                        <input 
                          type="email" 
                          className="form-control" 
                          required 
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold">Mobile Phone *</label>
                        <input 
                          type="tel" 
                          className="form-control" 
                          required 
                          placeholder="9876543210"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">Delivery Address *</label>
                      <textarea 
                        className="form-control" 
                        rows={2} 
                        required 
                        placeholder="Street, Building, Flat No, City, Pincode"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <h6 className="fw-bold text-dark mb-3 pt-2 border-top">2. Select Payment Method</h6>
                    <div className="d-flex flex-column gap-2 mb-3">
                      {[
                        'UPI / GPay / PhonePe / Paytm',
                        'Credit / Debit Card (Visa, Mastercard, RuPay)',
                        'Net Banking',
                        'Cash on Delivery (COD)'
                      ].map(method => (
                        <div key={method} className="form-check border p-2 px-3 rounded-3">
                          <input 
                            className="form-check-input ms-0 me-2" 
                            type="radio" 
                            name="paymentOption" 
                            id={method} 
                            checked={paymentMethod === method}
                            onChange={() => setPaymentMethod(method)}
                          />
                          <label className="form-check-label small fw-semibold text-dark cursor-pointer" htmlFor={method}>
                            {method}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Order Summary */}
                  <div className="col-md-5">
                    <div className="bg-light p-3 rounded-4 border">
                      <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">Order Summary</h6>
                      
                      <div className="mb-3 overflow-auto" style={{ maxHeight: '180px' }}>
                        {cart.map(item => (
                          <div key={item.product.id} className="d-flex justify-content-between small mb-2">
                            <span className="text-truncate me-2" style={{ maxWidth: '160px' }}>
                              {item.product.name} (x{item.quantity})
                            </span>
                            <span className="fw-bold font-mono">
                              ₹{(item.product.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-top pt-2 small text-secondary d-flex flex-column gap-1">
                        <div className="d-flex justify-content-between">
                          <span>Subtotal:</span>
                          <span className="fw-bold text-dark">₹{subtotal.toLocaleString()}</span>
                        </div>

                        {appliedPromo && (
                          <div className="d-flex justify-content-between text-success">
                            <span>Promo ({appliedPromo.code}):</span>
                            <span className="fw-bold">-₹{discountAmount.toLocaleString()}</span>
                          </div>
                        )}

                        <div className="d-flex justify-content-between">
                          <span>Shipping:</span>
                          <span className="fw-bold text-success">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                        </div>

                        <div className="d-flex justify-content-between fs-5 fw-extrabold text-dark pt-2 border-top">
                          <span>Payable Total:</span>
                          <span className="text-dark font-mono">₹{total.toLocaleString()}</span>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-warning w-100 fw-bold py-2.5 mt-4 rounded-3 shadow-sm"
                      >
                        Confirm & Place Order (₹{total.toLocaleString()})
                      </button>
                    </div>
                  </div>

                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
