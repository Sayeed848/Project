import React from 'react';
import { ShoppingBag, Heart, ShieldCheck, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-5 border-top border-secondary border-opacity-25">
      <div className="container-fluid max-w-7xl px-3">
        <div className="row g-4 mb-4">
          
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <ShoppingBag className="text-warning" size={28} />
              <span className="fs-4 fw-extrabold text-warning text-uppercase letter-spacing-1">SHOPZONE</span>
            </div>
            <p className="small text-secondary mb-3 max-w-sm">
              ShopZone is an advanced e-commerce platform built with React, TypeScript, Bootstrap 5, and HTML/CSS. Featuring 100+ product catalog items, live search, multi-filters, and a full Admin Control Studio.
            </p>
            <div className="d-flex align-items-center gap-2 text-warning small font-mono">
              <Sparkles size={16} /> Powered by SAYEED ALAM
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold text-white mb-3 text-uppercase small letter-spacing-1">Shop Categories</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li><a href="#" className="text-secondary text-decoration-none hover-warning">Fashion & Apparel</a></li>
              <li><a href="#" className="text-secondary text-decoration-none hover-warning">Electronics & Tech</a></li>
              <li><a href="#" className="text-secondary text-decoration-none hover-warning">Home & Living</a></li>
              <li><a href="#" className="text-secondary text-decoration-none hover-warning">Sports & Fitness</a></li>
              <li><a href="#" className="text-secondary text-decoration-none hover-warning">Footwear & Boots</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold text-white mb-3 text-uppercase small letter-spacing-1">Customer Support</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li><a href="#" className="text-secondary text-decoration-none">Track Order Status</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Shipping Policy</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Returns & Exchange</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Terms of Service</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold text-white mb-3 text-uppercase small letter-spacing-1">Contact Studio</h6>
            <div className="d-flex flex-column gap-2 small text-secondary">
              <div className="d-flex align-items-center gap-2">
                <MapPin size={16} className="text-warning" />
                <span>ShopZone E-Commerce HQ, Technology Park</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-warning" />
                <span>+91 9122312432</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-warning" />
                <span>support@shopzone.com</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-top border-secondary border-opacity-25 pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-center small text-secondary">
          <div>
            © 2026 <strong>ShopZone Advanced</strong> · Built by Sayeed Alam using React, TypeScript & Bootstrap.
          </div>
          <div className="d-flex align-items-center gap-3 mt-2 mt-sm-0">
            <span>React JS</span> · <span>TypeScript</span> · <span>Bootstrap 5</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
