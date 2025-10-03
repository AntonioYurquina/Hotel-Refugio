// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Servicios from "./pages/Servicios.jsx";
import Contacto from "./pages/Contacto.jsx";
import Login from "./pages/Login.jsx";
import Registrarse from "./pages/Registrarse.jsx";
import UsuarioPage from "./pages/Usuario.jsx";
import AdminPage from "./pages/AdminPage.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  const [user, setUser] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Guardar usuario en localStorage al cambiar
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  return (
    <BrowserRouter basename="/Hotel-Refugio">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Hotel Refugio</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/nosotros">Nosotros</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/servicios">Servicios</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>

              {!user && (
                <li className="nav-item dropdown">
                  <button className="btn btn-primary dropdown-toggle me-2" data-bs-toggle="dropdown">
                    Modo
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/usuario" onClick={() => setUser({nombre:"Usuario", rol:"usuario"})}>Usuario</Link></li>
                    <li><Link className="dropdown-item" to="/admin" onClick={() => setUser({nombre:"Admin", rol:"admin"})}>Admin</Link></li>
                  </ul>
                </li>
              )}

              {user && (
                <li className="nav-item dropdown">
                  <button className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
                    {user.nombre} ({user.rol})
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {user.rol === "usuario" && (
                      <>
                        <li><Link className="dropdown-item" to="/usuario">Perfil</Link></li>
                        <li><Link className="dropdown-item" to="/usuario/config">Configuración</Link></li>
                      </>
                    )}
                    {user.rol === "admin" && (
                      <>
                        <li><Link className="dropdown-item" to="/admin">Dashboard</Link></li>
                        <li><Link className="dropdown-item" to="/admin/config">Configuración Admin</Link></li>
                      </>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={() => setUser(null)}>Logout</button></li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Rutas */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/registrarse" element={<Registrarse />} />

        {/* Rutas protegidas */}
        <Route path="/usuario/*" element={user?.rol === "usuario" ? <UsuarioPage user={user} /> : <Navigate to="/login" />} />
        <Route path="/admin/*" element={user?.rol === "admin" ? <AdminPage user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

