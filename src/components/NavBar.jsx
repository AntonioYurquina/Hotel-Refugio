import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function NavBar({ user, logout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="fa-solid fa-hotel me-2 text-primary"></i>Hotel Refugio
        </Link>
        <div className="d-flex align-items-center">
          {user.ok ? (
            <div className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <i className="fa-solid fa-user-circle me-1"></i>
                {user.datos.nombre}
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                {user.datos.tipo_usuario === 'cliente' && (
                  <li><NavLink className="dropdown-item" to="/dashboard">Mi Panel</NavLink></li>
                )}
                {user.datos.tipo_usuario === 'operador' && (
                  <li><NavLink className="dropdown-item" to="/operator">Panel Operador</NavLink></li>
                )}
                {user.datos.tipo_usuario === 'admin' && (
                  <>
                    <li><NavLink className="dropdown-item" to="/admin">Panel Admin</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/operator">Panel Operador</NavLink></li>
                  </>
                )}
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={logout}>
                    <i className="fa-solid fa-right-from-bracket me-2"></i>Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link className="btn btn-outline-primary me-2" to="/login">Acceder</Link>
          )}
          <Link to="/reserve" className="btn btn-primary">Reservar</Link>
        </div>
      </div>
    </nav>
  );
}
