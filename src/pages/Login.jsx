import React, { useState } from 'react';
import RegisterForm from './RegisterForm';

export default function Login({ credenciales, actualizarCredenciales, handleLogin, registrarUsuario }) {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleInputChange = (e) => {
    actualizarCredenciales(
      e.target.name === 'email' ? e.target.value : credenciales.email,
      e.target.name === 'contraseña' ? e.target.value : credenciales.contraseña
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4">{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
          
          {isRegistering ? (
            <RegisterForm 
              onRegister={registrarUsuario} 
              onSwitchToLogin={() => setIsRegistering(false)} 
            />
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={credenciales.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  name="contraseña"
                  className="form-control"
                  value={credenciales.contraseña}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-3">
                Acceder
              </button>
              <p className="text-center mt-3">
                ¿No tienes una cuenta? <button type="button" className="btn btn-link p-0" onClick={() => setIsRegistering(true)}>Regístrate aquí</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
