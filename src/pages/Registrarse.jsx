import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Registrarse() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica (puedes expandirla)
    if (!nombre || !email || !password) {
      alert("Por favor completa todos los campos");
      return;
    }

    // Aquí iría la lógica real de registro (API)
    alert(`Registrado:\nNombre: ${nombre}\nEmail: ${email}`);

    // Redirigir al login después de registrarse
    navigate("/login");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="nombre@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Registrarse</button>
      </form>

      <p className="text-center mt-3">
        ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </div>
  );
}

