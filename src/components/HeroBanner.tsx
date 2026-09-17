import React from 'react';
import { Tag, Sparkles, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const HeroBanner: React.FC = () => {
  const { applyPromoCode } = useShop();

  return (
    <div className="container-fluid max-w-7xl px-3 my-4">
      <div className="hero-wrapper">
        <div className="row align-items-center">
          
          <div className="col-lg-7 mb-4 mb-lg-0">
            <span className="badge bg-warning text-dark font-mono text-uppercase px-3 py-2 rounded-pill fw-bold mb-3 d-inline-flex align-items-center gap-1">
              <Sparkles size={14} /> NEW SEASON COLLECTION 2026
            </span>

            <h1 className="hero-title text-white mb-3">
              Discover Your <br />
              <span className="text-warning">Signature Style</span> & Tech
            </h1>

            <p className="hero-subtitle mb-4">
              Explore over <strong>100+ premium products</strong> spanning fashion, electronics, home decor, fitness, and beauty — curated for luxury living.
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
              <a href="#products-section" className="btn btn-gold">
                <Zap size={18} /> Shop 100+ Catalog
              </a>

              <div className="d-flex align-items-center gap-2 bg-dark bg-opacity-50 border border-secondary px-3 py-2 rounded-3">
                <Tag size={16} className="text-warning" />
                <span className="small text-white me-1">Use Code: <strong>SAVE30</strong></span>
                <button 
                  className="btn btn-xs btn-warning text-dark font-mono px-2 py-0 fw-bold rounded"
                  onClick={() => applyPromoCode('SAVE30')}
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="d-flex flex-wrap gap-4 pt-2 border-top border-secondary border-opacity-50">
              <div className="d-flex align-items-center gap-2 small text-light">
                <Truck size={18} className="text-warning" />
                <span>Free Express Shipping</span>
              </div>
              <div className="d-flex align-items-center gap-2 small text-light">
                <ShieldCheck size={18} className="text-warning" />
                <span>100% Authentic Quality</span>
              </div>
              <div className="d-flex align-items-center gap-2 small text-light">
                <RefreshCw size={18} className="text-warning" />
                <span>7-Day Easy Returns</span>
              </div>
            </div>

          </div>

          <div className="col-lg-5 text-center">
            <div className="position-relative d-inline-block">
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" 
                alt="ShopZone Hero Showcase"
                className="img-fluid rounded-4 shadow-lg border border-secondary border-opacity-25"
                style={{ maxHeight: '320px', objectFit: 'cover', width: '100%' }}
              />
              <div className="position-absolute bottom-0 start-0 m-3 bg-dark bg-opacity-75 backdrop-blur p-3 rounded-3 text-start border border-warning">
                <div className="small text-warning fw-bold text-uppercase">Trending This Week</div>
                <div className="text-white fw-bold">Up to 50% OFF Top Tech & Fashion</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
