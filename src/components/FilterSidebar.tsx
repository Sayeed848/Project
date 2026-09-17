import React from 'react';
import { useShop } from '../context/ShopContext';
import { SlidersHorizontal, RotateCcw, Star, CheckCircle, Tag } from 'lucide-react';

interface FilterSidebarProps {
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onCloseMobile }) => {
  const { filters, setFilters, resetFilters } = useShop();

  return (
    <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
        <div className="d-flex align-items-center gap-2 fw-bold text-dark">
          <SlidersHorizontal size={18} className="text-warning" />
          <span>Filters & Sort</span>
        </div>
        
        <button 
          className="btn btn-sm btn-link text-decoration-none text-muted p-0 d-flex align-items-center gap-1"
          onClick={resetFilters}
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By Option */}
      <div className="mb-4">
        <label className="form-label small fw-bold text-uppercase text-muted mb-2">Sort By</label>
        <select
          className="form-select form-select-sm rounded-3 border-secondary border-opacity-25"
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
        >
          <option value="featured">⭐ Featured & Popular</option>
          <option value="price-low">💰 Price: Low to High</option>
          <option value="price-high">💎 Price: High to Low</option>
          <option value="rating">★ Highest Rated</option>
          <option value="discount">🔥 Biggest Discount %</option>
          <option value="name">🔤 Alphabetical (A-Z)</option>
        </select>
      </div>

      {/* Price Range Slider */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label className="form-label small fw-bold text-uppercase text-muted mb-0">Max Price</label>
          <span className="fw-bold text-dark">₹{filters.maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          className="form-range"
          min="500"
          max="20000"
          step="500"
          value={filters.maxPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
        />
        <div className="d-flex justify-content-between text-muted x-small">
          <span>₹500</span>
          <span>₹20,000+</span>
        </div>
      </div>

      {/* Toggles */}
      <div className="mb-4">
        <label className="form-label small fw-bold text-uppercase text-muted mb-2">Availability & Offers</label>
        
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="inStockOnlyToggle"
            checked={filters.inStockOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
          />
          <label className="form-check-input-label small fw-semibold text-dark cursor-pointer ms-2" htmlFor="inStockOnlyToggle">
            In Stock Only
          </label>
        </div>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="onSaleOnlyToggle"
            checked={filters.onSaleOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, onSaleOnly: e.target.checked }))}
          />
          <label className="form-check-input-label small fw-semibold text-dark cursor-pointer ms-2" htmlFor="onSaleOnlyToggle">
            On Sale / Discounted Only
          </label>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="mb-3">
        <label className="form-label small fw-bold text-uppercase text-muted mb-2">Minimum Rating</label>
        <div className="d-flex flex-column gap-1">
          {[0, 4.5, 4.0, 3.5].map(rating => (
            <button
              key={rating}
              type="button"
              className={`btn btn-sm text-start rounded-3 d-flex align-items-center justify-content-between ${
                filters.minRating === rating ? 'btn-dark text-warning' : 'btn-light text-secondary'
              }`}
              onClick={() => setFilters(prev => ({ ...prev, minRating: rating }))}
            >
              <div className="d-flex align-items-center gap-1">
                <Star size={14} className="fill-warning text-warning" />
                <span>{rating === 0 ? 'All Ratings' : `${rating} Stars & Up`}</span>
              </div>
              {filters.minRating === rating && <CheckCircle size={14} />}
            </button>
          ))}
        </div>
      </div>

      {onCloseMobile && (
        <button 
          className="btn btn-warning w-100 fw-bold rounded-3 mt-3 d-md-none"
          onClick={onCloseMobile}
        >
          Apply Filters
        </button>
      )}
    </div>
  );
};
