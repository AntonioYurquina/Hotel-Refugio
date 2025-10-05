import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 👇 USUARIOS SIMULADOS
  const usuariosSimulados = [
    {
      email: "tonyuser@gmail.com",
      contraseña: "1234567890",
      nombre: "Tony",
      rol: "usuario",
      tipo_usuario: "cliente",
      apellido: "Prueba",
    },
    {
      email: "tonyadmin@gmail.com",
      contraseña: "1234567890",
      nombre: "Tony",
      rol: "admin",
      tipo_usuario: "administrador",
      apellido: "Prueba",
    },
    {
      email: "tonyoperario@gmail.com",
      contraseña: "1234567890",
      nombre: "Tony",
      rol: "operario",
      tipo_usuario: "operario",
      apellido: "Prueba",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔹 BUSCAR EN USUARIOS SIMULADOS
      const userSimulado = usuariosSimulados.find(
        (u) => u.email === email.trim() && u.contraseña === password
      );

      if (userSimulado) {
        // 👇 Construir objeto de usuario para app
        const userObj = {
          nombre: userSimulado.nombre,
          rol: userSimulado.rol,
        };

        setUser(userObj);
        localStorage.setItem("user", JSON.stringify(userObj));

        // 👇 Redireccionar según rol
        if (userObj.rol === "admin") navigate("/admin");
        else if (userObj.rol === "usuario") navigate("/usuario");
        else navigate("/usuario"); // operario puede usar rutas de usuario
      } else {
        // 🔹 Si no coincide ningún usuario local, opcionalmente probar API real
        /*
        const response = await fetch("https://robledo.website/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), contraseña: password }),
        });
        const data = await response.json();
        ...
        */
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      console.error(err);
      setError("Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "420px", borderRadius: "15px", background: "white" }}>
          <h2 className="text-center mb-4" style={{ color: "#ff7f32", fontWeight: 700 }}>Iniciar Sesión</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Correo electrónico</label>
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
              <label htmlFor="password" className="form-label fw-semibold">Contraseña</label>
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

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <button className="btn w-100" type="submit" disabled={loading} style={{ backgroundColor: "#ff7f32", color: "white", fontWeight: 600, borderRadius: "10px", padding: "12px", fontSize: "1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
              {loading ? "Ingresando..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-3 mb-0" style={{ fontSize: "0.95rem" }}>
            ¿No tienes cuenta?{" "}
            <Link to="/registrarse" style={{ color: "#ff7f32", fontWeight: 600, textDecoration: "none" }}>Registrarse</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
