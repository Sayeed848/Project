import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Tag, Plus, Trash2, Gift } from 'lucide-react';

export const OffersManager: React.FC = () => {
  const { promos, addPromoCode, deletePromoCode } = useShop();

  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [minSpend, setMinSpend] = useState<number>(499);
  const [description, setDescription] = useState('');

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addPromoCode({
      code: code.trim().toUpperCase(),
      discountPercent: Number(discountPercent),
      minSpend: Number(minSpend),
      description: description || `Flat ${discountPercent}% discount on minimum spend ₹${minSpend}`
    });

    setCode('');
    setDescription('');
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
      <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
        <div className="d-flex align-items-center gap-2">
          <Tag size={22} className="text-warning" />
          <h5 className="fw-bold text-dark mb-0">Storewide Offers & Promo Coupon Manager</h5>
        </div>
        <span className="badge bg-dark text-warning rounded-pill font-mono">
          {promos.length} Active Codes
        </span>
      </div>

      <div className="row g-4">
        
        {/* Create Coupon Form */}
        <div className="col-lg-5">
          <div className="bg-light p-3 rounded-4 border">
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-1">
              <Gift size={16} className="text-warning" /> Create New Promo Coupon
            </h6>

            <form onSubmit={handleCreateOffer}>
              <div className="mb-2">
                <label className="form-label small fw-bold">Coupon Code *</label>
                <input 
                  type="text" 
                  className="form-control text-uppercase font-mono fw-bold" 
                  required 
                  placeholder="e.g. SUPER50"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold">Discount % *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    required 
                    min="1"
                    max="90"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  />
                </div>

                <div className="col-6">
                  <label className="form-label small fw-bold">Min Spend (₹)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    required 
                    min="0"
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Offer Description</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Flat 50% discount for festive sale"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-warning w-100 fw-bold d-flex align-items-center justify-content-center gap-1">
                <Plus size={16} /> Add Promo Code
              </button>
            </form>
          </div>
        </div>

        {/* Existing Coupons List */}
        <div className="col-lg-7">
          <h6 className="fw-bold text-dark mb-3">Active Promotional Codes</h6>

          <div className="d-flex flex-column gap-2">
            {promos.map(p => (
              <div 
                key={p.code} 
                className="d-flex align-items-center justify-content-between bg-white border p-3 rounded-3 shadow-xs"
              >
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-dark text-warning font-mono fs-6 px-3 py-1">
                      {p.code}
                    </span>
                    <span className="badge bg-danger text-white fw-bold">
                      {p.discountPercent}% OFF
                    </span>
                  </div>
                  <div className="small text-secondary mt-1">
                    {p.description} (Min Spend: ₹{p.minSpend})
                  </div>
                </div>

                <button 
                  className="btn btn-sm btn-outline-danger p-1 px-2"
                  onClick={() => deletePromoCode(p.code)}
                  title="Delete Coupon"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
