import React, { useState, useCallback, useMemo } from 'react';
import { ToastContext } from './toastContext';

const DURACION_MS = { error: 8000, warning: 8000 };
const MAXIMO_VISIBLES = 3;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }].slice(-MAXIMO_VISIBLES));
    setTimeout(() => removeToast(id), DURACION_MS[type] ?? 5000);
  }, [removeToast]);

  const value = useMemo(() => ({ addToast, toasts, removeToast }), [addToast, toasts, removeToast]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
