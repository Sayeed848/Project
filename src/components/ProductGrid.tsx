import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types/ecommerce';
import { PackageSearch, RefreshCw } from 'lucide-react';

interface ProductGridProps {
  onQuickView: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

const ITEMS_PER_PAGE = 16;

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  onQuickView, 
  onEditProduct 
}) => {
  const { products, filters, resetFilters } = useShop();
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Category Filter
      if (filters.category !== 'All' && p.category !== filters.category) {
        return false;
      }
      // 2. Search Query Filter
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }
      // 3. Max Price Filter
      if (p.price > filters.maxPrice) {
        return false;
      }
      // 4. In Stock Only Filter
      if (filters.inStockOnly && (!p.inStock || p.stockQuantity <= 0)) {
        return false;
      }
      // 5. On Sale Only Filter
      if (filters.onSaleOnly && (!p.discountPercent || p.discountPercent <= 0)) {
        return false;
      }
      // 6. Minimum Rating Filter
      if (filters.minRating > 0 && p.rating < filters.minRating) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'discount':
          return (b.discountPercent || 0) - (a.discountPercent || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }, [products, filters]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div id="products-section">
      
      {/* Grid Header Info */}
      <div className="d-flex align-items-center justify-content-between mb-3 bg-white p-3 rounded-4 shadow-sm">
        <div className="small fw-bold text-dark">
          Showing <span className="text-warning font-mono fs-6">{visibleProducts.length}</span> of{' '}
          <span className="text-dark font-mono fs-6">{filteredProducts.length}</span> Products Found
          {filters.category !== 'All' && ` in "${filters.category}"`}
        </div>

        {filteredProducts.length > 0 && (
          <span className="small text-muted d-none d-sm-inline">
            Catalog Total: {products.length} Items
          </span>
        )}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm my-4 px-3">
          <PackageSearch size={54} className="text-muted mb-3 opacity-50" />
          <h4 className="fw-bold text-dark">No Products Matched Your Criteria</h4>
          <p className="text-muted max-w-md mx-auto mb-4">
            We couldn't find any items matching your current filters or search term "{filters.searchQuery}". Try broadening your search or resetting filters.
          </p>
          <button 
            className="btn btn-warning fw-bold px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2"
            onClick={resetFilters}
          >
            <RefreshCw size={16} /> Reset All Filters
          </button>
        </div>
      ) : (
        <>
          {/* Product Cards Grid */}
          <div className="row g-3 g-md-4">
            {visibleProducts.map(product => (
              <div key={product.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <ProductCard
                  product={product}
                  onQuickView={onQuickView}
                  onEditProduct={onEditProduct}
                />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredProducts.length && (
            <div className="text-center mt-4 pt-3">
              <button
                className="btn btn-outline-dark fw-bold px-5 py-2 rounded-pill shadow-sm"
                onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
              >
                Load More Products ({filteredProducts.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};
