import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function NavBar({ user, logout }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="fa-solid fa-mountain-sun me-2"></i>
          Hotel Refugio
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {user.ok ? (
              <>
                {user.datos.tipo_usuario === 'admin' && <li className="nav-item"><NavLink className="nav-link" to="/admin">Admin</NavLink></li>}
                {(user.datos.tipo_usuario === 'operador' || user.datos.tipo_usuario === 'admin') && <li className="nav-item"><NavLink className="nav-link" to="/operator">Operador</NavLink></li>}
                {user.datos.tipo_usuario === 'cliente' && <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Mi Panel</NavLink></li>}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i className="fa-solid fa-user me-1"></i> {user.datos.nombre}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><button className="dropdown-item" onClick={logout}>Cerrar Sesión</button></li>
                  </ul>
                </li>
                <li className="nav-item ms-lg-3">
                  <NavLink className="btn btn-primary btn-sm" to="/reserve">Reservar</NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item ms-lg-3">
                  <NavLink className="btn btn-primary btn-sm" to="/reserve">Reservar</NavLink>
                </li>
              </>
            )}
            <li className="nav-item ms-lg-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={toggleTheme}>
                <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
