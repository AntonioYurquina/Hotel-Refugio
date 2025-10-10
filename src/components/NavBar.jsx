import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar({ gpt5Enabled }) {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    const password = prompt(`Ingrese clave de ${role}:`);
    if (role === 'Operador' && password === 'admin2025') {
      navigate('/operator');
    } else if (role === 'Admin' && password === 'superadmin2026') {
      navigate('/admin');
    } else if (password) {
      alert('Clave incorrecta.');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="fa-solid fa-hotel me-2 text-primary"></i>Hotel Refugio
        </Link>
        <div className="d-flex align-items-center">
          {gpt5Enabled && (
            <span className="badge bg-info-subtle text-info-emphasis me-3" title="GPT-5 mini concierge is active for all clients">
              <i className="fa-solid fa-robot me-1"></i> AI Concierge
            </span>
          )}
          <div className="btn-group me-2">
            <button className="btn btn-outline-primary" onClick={() => handleLogin('Operador')}>
              <i className="fa-solid fa-key"></i> Operador
            </button>
            <button className="btn btn-outline-danger" onClick={() => handleLogin('Admin')}>
              <i className="fa-solid fa-user-shield"></i> Admin
            </button>
          </div>
          <a className="btn btn-primary" href="#rooms">Reservar</a>
        </div>
      </div>
    </nav>
  );
}
