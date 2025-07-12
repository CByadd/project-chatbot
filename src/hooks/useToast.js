import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', title = null, duration = 3000) => {
    const id = Date.now();
    const newToast = {
      id,
      message,
      type,
      title,
      duration,
      isOpen: true
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration + 300); // Add 300ms for animation
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, title = 'Success') => {
    showToast(message, 'success', title);
  }, [showToast]);

  const showError = useCallback((message, title = 'Error') => {
    showToast(message, 'error', title);
  }, [showToast]);

  const showWarning = useCallback((message, title = 'Warning') => {
    showToast(message, 'warning', title);
  }, [showToast]);

  const showInfo = useCallback((message, title = 'Info') => {
    showToast(message, 'info', title);
  }, [showToast]);

  return {
    toasts,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useToast;