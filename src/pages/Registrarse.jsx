import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";

export default function Registrarse() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !email || !password) {
      alert("Por favor completa todos los campos");
      return;
    }

    alert(`Registrado:\nNombre: ${nombre}\nEmail: ${email}`);
    navigate("/login");
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="card shadow-lg p-4"
          style={{
            width: "100%",
            maxWidth: "420px",
            borderRadius: "15px",
            background: "white",
          }}
        >
          <h2
            className="text-center mb-4"
            style={{ color: "#000000ff", fontWeight: 700 }}
          >
            Registrarse
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label fw-semibold">
                Nombre completo
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="nombre"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Correo electrónico
              </label>
              <input
                type="email"
                className="form-control form-control-lg"
                id="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderRadius: "10px" }}
              />
            </div>

            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: "#ff7f32",
                color: "white",
                fontWeight: 600,
                borderRadius: "10px",
                padding: "12px",
                fontSize: "1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              Registrarse
            </button>
          </form>

          <p className="text-center mt-3 mb-0" style={{ fontSize: "0.95rem" }}>
            ¿Ya tenés cuenta?{" "}
            <Link
              to="/login"
              style={{
                color: "#ff7f32",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </>
  );
}
