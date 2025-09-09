import React, { useState, useEffect } from 'react';
import type { INotification } from '../types/notification.type';
import { useNotification } from '../hooks/useNotification';

const NOTIFICATION_DELAY = 3000; // 3 segundos

interface NotificationProps {}

export const Notification: React.FC<NotificationProps> = () => {
  const [alerts, setAlerts] = useState<INotification[]>([]);
  const { notifications, setNotification } = useNotification();

  useEffect(() => {
    if (notifications.length > 0) {
      const filteredNotifications = notifications.filter(
        n => n.type === 'error' || n.type === 'info' || n.type === 'warning'
      );
      
      filteredNotifications.forEach(notif => {
        showNotification(notif);
      });

      const remaining = notifications.filter(
        n => !filteredNotifications.some(m => m.id === n.id)
      );
      setNotification(remaining);
    }
  }, [notifications, setNotification]);

  const showNotification = (notification: INotification) => {
    const { message, type, id } = notification;
    const createdAt = Date.now();
    
    if (!alerts.some(alert => alert.id === id)) {
      setAlerts(prev => [...prev, { id, message, type, createdAt }]);

      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== id));
      }, NOTIFICATION_DELAY);
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getRippleColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-2">
      {alerts.map(alert => (
        <div
          key={alert.id}
          className="relative bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[300px] max-w-md opacity-100 transition-all duration-300"
          role="alert"
        >
          {/* Ripple effect */}
          <div className={`absolute inset-0 rounded-lg opacity-10 ${getRippleColor(alert.type)}`}></div>
          
          <div className="flex items-start relative z-10">
            <div className={`flex-shrink-0 mt-0.5 ${getIconColor(alert.type)}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-800">{alert.message}</p>
            </div>
            
            <button
              onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Cerrar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
