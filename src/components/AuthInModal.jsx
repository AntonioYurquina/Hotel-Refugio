import React, { useState } from 'react';
import RegisterForm from '../pages/RegisterForm';

// Acceso dentro del modal de reserva: ingresar o crear una cuenta de cliente sin salir de la página.
export default function AuthInModal({ login, registrarUsuario }) {
  const [creando, setCreando] = useState(false);
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [enviando, setEnviando] = useState(false);

  const entrar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    await login(email, contraseña);
    setEnviando(false);
  };

  return (
    <div className="p-2">
      <h6 className="text-center mb-1">{creando ? 'Crear cuenta' : 'Iniciar sesión'}</h6>
      <p className="text-center text-muted small mb-3">Para reservar necesitás una cuenta de cliente.</p>

      {creando ? (
        <RegisterForm onRegister={registrarUsuario} onSwitchToLogin={() => setCreando(false)} />
      ) : (
        <form onSubmit={entrar}>
          <div className="mb-3">
            <label htmlFor="modal-email" className="form-label">Email</label>
            <input id="modal-email" type="email" autoComplete="username" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="modal-clave" className="form-label">Contraseña</label>
            <input id="modal-clave" type="password" autoComplete="current-password" className="form-control" required value={contraseña} onChange={(e) => setContraseña(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={enviando}>{enviando ? 'Ingresando…' : 'Acceder'}</button>
          <div className="text-center mt-3">
            <button type="button" className="btn btn-link" onClick={() => setCreando(true)}>¿No tenés cuenta? Registrate</button>
          </div>
        </form>
      )}
    </div>
  );
}
