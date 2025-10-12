import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <div className="container">
        <p className="mb-0">&copy; 2025 Hotel Refugio. Todos los derechos reservados.</p>
        <small>
          <Link to="/" className="text-white-50">Política de Privacidad</Link> | 
          <Link to="/" className="text-white-50"> Términos de Servicio</Link> | 
          <Link to="/" className="text-white-50"> Contacto</Link> | 
          <Link to="/login" className="text-white-50"> Acceso Personal</Link>
        </small>
      </div>
    </footer>
  );
}
