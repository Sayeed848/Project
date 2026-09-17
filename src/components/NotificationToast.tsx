import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useShop();

  if (notifications.length === 0) return null;

  return (
    <div className="toast-container-custom">
      {notifications.map(n => (
        <div key={n.id} className={`toast-custom ${n.type}`}>
          {n.type === 'success' && <CheckCircle size={20} />}
          {n.type === 'error' && <AlertCircle size={20} />}
          {n.type === 'warning' && <AlertTriangle size={20} />}
          {n.type === 'info' && <Info size={20} />}
          
          <span className="small fw-semibold">{n.message}</span>
          
          <button 
            type="button" 
            className="btn-close btn-close-white ms-auto" 
            onClick={() => removeNotification(n.id)}
            style={{ fontSize: '0.7rem' }}
          />
        </div>
      ))}
    </div>
  );
};
