import React from 'react';
import { useShop } from '../context/ShopContext';
import { Category } from '../types/ecommerce';
import { 
  Grid, 
  Shirt, 
  Laptop, 
  Home, 
  Activity, 
  Footprints, 
  Sparkles, 
  Briefcase, 
  Watch 
} from 'lucide-react';

export const CATEGORIES_WITH_ICONS: { name: Category; icon: React.ReactNode }[] = [
  { name: 'All', icon: <Grid size={16} /> },
  { name: 'Fashion', icon: <Shirt size={16} /> },
  { name: 'Electronics', icon: <Laptop size={16} /> },
  { name: 'Home & Living', icon: <Home size={16} /> },
  { name: 'Sports & Fitness', icon: <Activity size={16} /> },
  { name: 'Footwear', icon: <Footprints size={16} /> },
  { name: 'Beauty & Care', icon: <Sparkles size={16} /> },
  { name: 'Accessories', icon: <Briefcase size={16} /> },
  { name: 'Watches & Jewelry', icon: <Watch size={16} /> },
];

export const CategoryBar: React.FC = () => {
  const { filters, setFilters, products } = useShop();

  const handleCategoryClick = (cat: Category) => {
    setFilters(prev => ({ ...prev, category: cat }));
  };

  const getCategoryCount = (catName: Category) => {
    if (catName === 'All') return products.length;
    return products.filter(p => p.category === catName).length;
  };

  return (
    <div className="container-fluid max-w-7xl px-3 my-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div>
          <h5 className="fw-bold mb-0 text-dark">Browse Categories</h5>
          <span className="small text-muted">Select a category to filter 100+ items</span>
        </div>

        <span className="badge bg-dark text-warning rounded-pill px-3 py-2 fw-semibold">
          {products.length} Products Total
        </span>
      </div>

      <div className="category-bar-scroll">
        {CATEGORIES_WITH_ICONS.map(cat => {
          const isActive = filters.category === cat.name;
          const count = getCategoryCount(cat.name);

          return (
            <button
              key={cat.name}
              className={`category-chip ${isActive ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.name)}
            >
              {cat.icon}
              <span>{cat.name}</span>
              <span className={`badge ${isActive ? 'bg-warning text-dark' : 'bg-light text-dark'} ms-1`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
