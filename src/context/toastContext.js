import { createContext, useContext } from 'react';

export const ToastContext = createContext({ addToast: () => {}, toasts: [], removeToast: () => {} });

export const useToast = () => useContext(ToastContext);
