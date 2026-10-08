import React, { useState } from 'react';
import RegisterForm from './RegisterForm';
import { DEMO } from '../config';
import { CLAVE_DEMO } from '../demo/datos';

const CUENTAS_DEMO = [
  { rol: 'Cliente', email: 'cliente@example.com' },
  { rol: 'Operador', email: 'operador@example.com' },
  { rol: 'Administrador', email: 'admin@example.com' },
];

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
          {DEMO && !isRegistering && (
            <div className="border rounded p-3 mt-4 bg-body-tertiary">
              <p className="small text-muted mb-2">
                Demo con datos ficticios, sin servidor. Entrá con un clic o usá cualquiera de estas cuentas con la contraseña <code>{CLAVE_DEMO}</code>.
              </p>
              <div className="d-flex flex-wrap gap-2">
                {CUENTAS_DEMO.map(({ rol, email }) => (
                  <button
                    key={email}
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleLogin({ email, contraseña: CLAVE_DEMO })}
                  >
                    Entrar como {rol.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
