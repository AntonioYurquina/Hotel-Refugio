import React, { useState } from 'react';
import RegisterForm from './RegisterForm';
import { DEMO } from '../config';
import { CLAVE_DEMO } from '../demo/datos';

const CUENTAS_DEMO = [
  { rol: 'Cliente', email: 'cliente@example.com' },
  { rol: 'Operador', email: 'operador@example.com' },
  { rol: 'Administrador', email: 'admin@example.com' },
];

export default function Login({ login, registrarUsuario }) {
  const [registrando, setRegistrando] = useState(false);
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [enviando, setEnviando] = useState(false);

  const entrar = async (correo, clave) => {
    setEnviando(true);
    await login(correo, clave);
    setEnviando(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    entrar(email, contraseña);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg w-100" style={{ maxWidth: '500px' }}>
        <div className="card-body p-4 p-md-5">
          <h1 className="h2 card-title text-center mb-4">{registrando ? 'Crear cuenta' : 'Iniciar sesión'}</h1>

          {registrando ? (
            <RegisterForm onRegister={registrarUsuario} onSwitchToLogin={() => setRegistrando(false)} />
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="login-email" className="form-label">Email</label>
                <input id="login-email" type="email" autoComplete="username" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="login-clave" className="form-label">Contraseña</label>
                <input id="login-clave" type="password" autoComplete="current-password" className="form-control" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-2" disabled={enviando}>
                {enviando ? 'Ingresando…' : 'Acceder'}
              </button>
              <p className="text-center mt-3 mb-0">
                ¿No tenés una cuenta? <button type="button" className="btn btn-link p-0 align-baseline" onClick={() => setRegistrando(true)}>Registrate acá</button>
              </p>
            </form>
          )}

          {DEMO && !registrando && (
            <div className="border rounded p-3 mt-4 bg-body-tertiary">
              <p className="small text-muted mb-2">
                Demo con datos ficticios, sin servidor. Entrá con un clic o usá cualquiera de estas cuentas con la contraseña <code>{CLAVE_DEMO}</code>.
              </p>
              <div className="d-flex flex-wrap gap-2">
                {CUENTAS_DEMO.map(({ rol, email: correo }) => (
                  <button key={correo} type="button" className="btn btn-outline-secondary btn-sm" disabled={enviando} onClick={() => entrar(correo, CLAVE_DEMO)}>
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
