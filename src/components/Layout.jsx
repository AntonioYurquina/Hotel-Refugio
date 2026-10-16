import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import ScrollToTopButton from './ScrollToTopButton';
import BannerModo from './ui/BannerModo';
import { useToast } from '../context/toastContext';

const CLASES = {
  success: 'text-bg-success',
  error: 'text-bg-danger',
  warning: 'text-bg-warning',
  info: 'text-bg-info',
};

const Toast = ({ message, type, onClose }) => (
  <div className={`toast show align-items-center ${CLASES[type] ?? CLASES.info}`} role={type === 'error' ? 'alert' : 'status'} aria-atomic="true">
    <div className="d-flex">
      <div className="toast-body">{message}</div>
      <button type="button" className="btn-close me-2 m-auto" aria-label="Cerrar aviso" onClick={onClose}></button>
    </div>
  </div>
);

export default function Layout({ user, logout, children }) {
  const { toasts, removeToast } = useToast();

  return (
    <div className="d-flex flex-column min-vh-100">
      <BannerModo />
      <NavBar user={user} logout={logout} />
      <main className="flex-grow-1">{children}</main>
      <Footer />
      <ScrollToTopButton />
      <div className="toast-container position-fixed bottom-0 start-0 p-3" style={{ zIndex: 1100 }} aria-live="polite">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </div>
  );
}
