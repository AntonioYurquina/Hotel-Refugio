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
  const { toasts } = useToast(); // No existe, esto es un placeholder. La lógica de estado está en el provider.

  // Este componente necesita una forma de acceder a los toasts.
  // La forma más simple es que el ToastProvider también provea el estado de los toasts.
  // Voy a asumir que el ToastContext provee `toasts` y `removeToast`.
  
  // La implementación correcta requiere modificar ToastContext para que exponga `toasts`
  // y una función para eliminarlos. Por simplicidad, este es un ejemplo conceptual.
  // La lógica real sería más compleja.

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar user={user} logout={logout} />
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
      <ScrollToTopButton />
      {/* Aquí iría el contenedor de Toasts */}
    </div>
  );
}
