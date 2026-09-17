import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { ShieldCheck, Lock, User, KeyRound, Sparkles } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const { loginAdmin } = useShop();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = loginAdmin(username, password);
    if (success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg('Invalid admin credentials');
    }
  };

  const handleQuickDemoLogin = () => {
    setUsername('Sayeed');
    setPassword('Sayeed@4953');
    loginAdmin('Sayeed', 'Sayeed@4953');
    onSuccess();
    onClose();
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex={-1} 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)' }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden bg-dark text-white">
          
          <div className="modal-header border-secondary border-opacity-25 py-3">
            <div className="d-flex align-items-center gap-2">
              <ShieldCheck size={24} className="text-warning" />
              <h5 className="modal-title fw-bold text-white">Admin Studio Login</h5>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose} 
              aria-label="Close" 
            />
          </div>

          <div className="modal-body p-4">
            <p className="small text-secondary mb-4">
              Enter your admin credentials to add products, modify prices, set offer discounts, and toggle out of stock statuses.
            </p>

            {errorMsg && (
              <div className="alert alert-danger py-2 small mb-3">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-light">Admin Username</label>
                <div className="input-group">
                  <span className="input-group-text bg-secondary border-secondary text-white">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-light">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-secondary border-secondary text-white">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-warning w-100 fw-bold py-2 rounded-3 shadow-sm mb-3 d-flex align-items-center justify-content-center gap-2"
              >
                <KeyRound size={18} />
                <span>Login to Admin Panel</span>
              </button>

              <button 
                type="button" 
                className="btn btn-outline-light w-100 btn-sm font-mono d-flex align-items-center justify-content-center gap-1"
                onClick={handleQuickDemoLogin}
              >
                <Sparkles size={14} className="text-warning" />
                <span>Quick 1-Click Demo Admin Login</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
