import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ credenciales, actualizarCredenciales, handleLogin }) {
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const user = await handleLogin();
    if (user && user.ok) {
      // Redirección basada en el rol del usuario
      switch (user.datos.tipo_usuario) {
        case 'administrador':
          navigate('/admin');
          break;
        case 'operador':
          navigate('/operator');
          break;
        default: // Para 'cliente' y cualquier otro rol
          navigate('/dashboard');
          break;
      }
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '400px' }}>
      <div className="card">
        <div className="card-body p-4">
          <h3 className="card-title text-center mb-4">Iniciar Sesión</h3>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={credenciales.email}
                onChange={(e) => actualizarCredenciales(e.target.value, credenciales.contraseña)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={credenciales.contraseña}
                onChange={(e) => actualizarCredenciales(credenciales.email, e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Acceder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
