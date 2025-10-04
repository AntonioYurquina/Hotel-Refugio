import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://robledo.website/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), contraseña: password }),
      });

      const data = await response.json();

      if (data.tipo_usuario) {
        const userObj = {
          nombre: `${data.nombre} ${data.apellido}`,
          rol: data.tipo_usuario === "cliente" ? "usuario" : "admin",
        };

        setUser(userObj);
        localStorage.setItem("user", JSON.stringify(userObj));

        if (userObj.rol === "admin") navigate("/admin");
        else navigate("/usuario");
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("Error inesperado del servidor");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión o CORS. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* CONTENEDOR LOGIN */}
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
            style={{ color: "#ff7f32", fontWeight: 700 }}
          >
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                className="form-control form-control-lg"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                style={{ borderRadius: "10px" }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="form-control form-control-lg"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ borderRadius: "10px" }}
              />
            </div>

            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}

            <button
              className="btn w-100"
              type="submit"
              disabled={loading}
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
              {loading ? "Ingresando..." : "Login"}
            </button>
          </form>

          <p
            className="text-center mt-3 mb-0"
            style={{ fontSize: "0.95rem" }}
          >
            ¿No tienes cuenta?{" "}
            <Link
              to="/registrarse"
              style={{
                color: "#ff7f32",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Registrarse
            </Link>
          </p>
        </div>
      </div>

      {/* FOOTER SIEMPRE ABAJO */}
      <Footer />
    </>
  );
}
