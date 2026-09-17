export type Category = 
  | 'All' 
  | 'Fashion' 
  | 'Electronics' 
  | 'Home & Living' 
  | 'Sports & Fitness' 
  | 'Footwear' 
  | 'Beauty & Care' 
  | 'Accessories' 
  | 'Watches & Jewelry';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  description: string;
  specs: string[];
  inStock: boolean;
  stockQuantity: number;
  badge?: 'sale' | 'new' | 'hot' | 'trending' | 'limited';
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface PromoCoupon {
  code: string;
  discountPercent: number;
  description: string;
  minSpend: number;
}

export interface FilterState {
  category: Category;
  searchQuery: string;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'discount' | 'name';
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  customerName: string;
  email: string;
  address: string;
  paymentMethod: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
