import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import ScrollToTopButton from './ScrollToTopButton';
import { useToast } from '../context/ToastContext'; // Importar el hook

// Componente para renderizar un solo Toast
const Toast = ({ message, type, onClose }) => {
  const toastTypeClasses = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    info: 'bg-info text-dark',
  };

  return (
    <div className={`toast show align-items-center ${toastTypeClasses[type]}`} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button type="button" className="btn-close me-2 m-auto" onClick={onClose}></button>
      </div>
    </div>
  );
};

export default function Layout({ user, logout, children }) {
  const { toasts, removeToast } = useToast();

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar user={user} logout={logout} />
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
      <ScrollToTopButton />
      <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </div>
  );
}
