import React from 'react';
import { Link } from 'react-router-dom';
import { DEMO } from '../config';

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <div className="container">
        <p className="mb-1">&copy; 2025 Hotel Refugio. Todos los derechos reservados.</p>
        <small>
          <Link to="/login" className="text-white-50">Acceso Personal</Link>
          <span className="text-white-50 mx-2">|</span>
          <span className="text-white-50" title={DEMO ? 'Datos ficticios en memoria' : 'Datos reales del servidor'}>
            <i className={`fa-solid fa-circle me-1 ${DEMO ? 'text-info' : 'text-success'}`} aria-hidden="true"></i>
            {DEMO ? 'Modo demo' : 'Conectado a la API Hotel v1'}
          </span>
        </small>
      </div>
    </footer>
  );
}
