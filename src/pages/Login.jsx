import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
    <div className="container mt-5" style={{ maxWidth: "420px" }}>
      <h2 className="text-center mb-4">Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo electrónico</label>
          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="nombre@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            id="password"
            type="password"
            className="form-control"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Login"}
        </button>
      </form>

      <p className="text-center mt-3">
        ¿No tienes cuenta? <Link to="/registrarse">Registrarse</Link>
      </p>
    </div>
  );
}

