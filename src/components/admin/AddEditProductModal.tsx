import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types/ecommerce';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES_WITH_ICONS } from '../CategoryBar';
import { PlusCircle, Edit3, Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';

interface AddEditProductModalProps {
  isOpen: boolean;
  productToEdit: Product | null;
  onClose: () => void;
}

export const AddEditProductModal: React.FC<AddEditProductModalProps> = ({
  isOpen,
  productToEdit,
  onClose
}) => {
  const { addProduct, updateProduct } = useShop();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Fashion');
  const [price, setPrice] = useState<number>(999);
  const [originalPrice, setOriginalPrice] = useState<number>(1499);
  const [discountPercent, setDiscountPercent] = useState<number>(33);
  const [imageUrl, setImageUrl] = useState('');
  const [stockQuantity, setStockQuantity] = useState<number>(20);
  const [inStock, setInStock] = useState<boolean>(true);
  const [description, setDescription] = useState('');
  const [specsText, setSpecsText] = useState('');
  const [badge, setBadge] = useState<Product['badge']>('new');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setOriginalPrice(productToEdit.originalPrice || Math.round(productToEdit.price * 1.4));
      setDiscountPercent(productToEdit.discountPercent || 30);
      setImageUrl(productToEdit.imageUrl);
      setStockQuantity(productToEdit.stockQuantity);
      setInStock(productToEdit.inStock);
      setDescription(productToEdit.description);
      setSpecsText(productToEdit.specs ? productToEdit.specs.join(', ') : '');
      setBadge(productToEdit.badge || undefined);
    } else {
      setName('');
      setCategory('Fashion');
      setPrice(1299);
      setOriginalPrice(1999);
      setDiscountPercent(35);
      setImageUrl('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80');
      setStockQuantity(25);
      setInStock(true);
      setDescription('Premium quality product designed for modern lifestyle.');
      setSpecsText('High grade material, Durable build, 1 Year warranty');
      setBadge('new');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handlePriceChange = (val: number) => {
    setPrice(val);
    if (originalPrice > val) {
      const calcDiscount = Math.round(((originalPrice - val) / originalPrice) * 100);
      setDiscountPercent(calcDiscount > 0 ? calcDiscount : 0);
    }
  };

  const handleOriginalPriceChange = (val: number) => {
    setOriginalPrice(val);
    if (val > price) {
      const calcDiscount = Math.round(((val - price) / val) * 100);
      setDiscountPercent(calcDiscount > 0 ? calcDiscount : 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !imageUrl) {
      alert('Please fill product name and image URL.');
      return;
    }

    const specsArray = specsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const productPayload = {
      name,
      category,
      price: Number(price),
      originalPrice: Number(originalPrice),
      discountPercent: Number(discountPercent),
      rating: productToEdit ? productToEdit.rating : 4.5,
      reviewsCount: productToEdit ? productToEdit.reviewsCount : 12,
      imageUrl,
      description,
      specs: specsArray,
      inStock: stockQuantity > 0 && inStock,
      stockQuantity: Number(stockQuantity),
      badge
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    onClose();
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex={-1} 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(5px)' }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          
          <div className="modal-header bg-dark text-white border-secondary border-opacity-25 py-3">
            <div className="d-flex align-items-center gap-2">
              {productToEdit ? <Edit3 size={20} className="text-warning" /> : <PlusCircle size={20} className="text-warning" />}
              <h5 className="modal-title fw-bold">
                {productToEdit ? `Edit Product: ${productToEdit.name}` : 'Add New Product to Catalog'}
              </h5>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose} 
              aria-label="Close" 
            />
          </div>

          <div className="modal-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                
                {/* Product Name */}
                <div className="col-12">
                  <label className="form-label small fw-bold">Product Title / Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Wireless Noise Cancelling Headphones"
                  />
                </div>

                {/* Category & Badge */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Category *</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                  >
                    {CATEGORIES_WITH_ICONS.filter(c => c.name !== 'All').map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Display Badge</label>
                  <select
                    className="form-select"
                    value={badge || ''}
                    onChange={(e) => setBadge((e.target.value as any) || undefined)}
                  >
                    <option value="">No Badge</option>
                    <option value="sale">SALE (Red)</option>
                    <option value="new">NEW (Green)</option>
                    <option value="hot">HOT (Amber)</option>
                    <option value="trending">TRENDING (Purple)</option>
                    <option value="limited">LIMITED (Blue)</option>
                  </select>
                </div>

                {/* Pricing Fields */}
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Current Selling Price (₹) *</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold">Original / MRP Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={originalPrice}
                    onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold">Discount % Offer</label>
                  <input
                    type="number"
                    className="form-control bg-light"
                    readOnly
                    value={discountPercent}
                  />
                </div>

                {/* Image URL & Live Preview */}
                <div className="col-md-8">
                  <label className="form-label small fw-bold">Direct Image Web Link (HTTPS URL) *</label>
                  <input
                    type="url"
                    className="form-control"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  <div className="form-text x-small">
                    Use clean, direct image URLs from Google search or Unsplash. (No base64).
                  </div>
                </div>

                <div className="col-md-4 text-center">
                  <label className="form-label small fw-bold">Image Preview</label>
                  <div className="border rounded p-2 bg-light d-flex align-items-center justify-content-center" style={{ height: '90px' }}>
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="img-fluid rounded max-h-100" 
                        style={{ maxHeight: '75px' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    ) : (
                      <ImageIcon size={32} className="text-muted" />
                    )}
                  </div>
                </div>

                {/* Stock Control */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Stock Quantity Count *</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    min="0"
                    value={stockQuantity}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      setStockQuantity(qty);
                      if (qty === 0) setInStock(false);
                      else setInStock(true);
                    }}
                  />
                </div>

                <div className="col-md-6 d-flex align-items-end">
                  <div className="form-check form-switch p-2 border rounded-3 w-100 bg-light">
                    <input
                      className="form-check-input ms-0 me-2"
                      type="checkbox"
                      id="inStockCheck"
                      checked={inStock}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setInStock(checked);
                        if (!checked) setStockQuantity(0);
                        else if (stockQuantity === 0) setStockQuantity(15);
                      }}
                    />
                    <label className="form-check-label small fw-bold text-dark cursor-pointer" htmlFor="inStockCheck">
                      {inStock ? '🟢 Available In Stock' : '🔴 Marked Out of Stock'}
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label small fw-bold">Detailed Product Description</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide description..."
                  />
                </div>

                {/* Specifications */}
                <div className="col-12">
                  <label className="form-label small fw-bold">Key Specifications (Comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={specsText}
                    onChange={(e) => setSpecsText(e.target.value)}
                    placeholder="e.g. 100% Cotton, Breathable Weave, Machine Wash"
                  />
                </div>

              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button type="button" className="btn btn-secondary fw-semibold" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-warning fw-bold px-4">
                  {productToEdit ? 'Save Changes' : 'Add Product to Store'}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
