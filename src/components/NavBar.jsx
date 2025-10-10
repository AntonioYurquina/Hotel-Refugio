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
            <div className="d-flex align-items-center">
              <NavLink className="btn btn-outline-info me-2" to="/dashboard">Mi Panel</NavLink>
              {user.datos.tipo_usuario === 'administrador' && (
                <NavLink className="btn btn-outline-danger me-2" to="/admin">Admin</NavLink>
              )}
              {(user.datos.tipo_usuario === 'operador' || user.datos.tipo_usuario === 'administrador') && (
                <NavLink className="btn btn-outline-primary me-2" to="/operator">Operador</NavLink>
              )}
              <span className="navbar-text me-3">Hola, {user.datos.nombre}</span>
              <button className="btn btn-secondary" onClick={logout}>Salir</button>
            </div>
          ) : (
            <Link className="btn btn-primary" to="/login">Acceder</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
