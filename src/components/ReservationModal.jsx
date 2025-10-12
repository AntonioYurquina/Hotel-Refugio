import React, { useState } from 'react';
import ReservationForm from './ReservationForm';
import LoginForm from './LoginForm';

export default function ReservationModal({ isOpen, onClose, room, user, initialFilters, login, actualizarCredenciales, registrarUsuario }) {
  const [showLogin, setShowLogin] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} aria-modal="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Reserva tu Estancia</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {showLogin ? (
              <div>
                <h6 className="mb-3">Iniciar Sesión</h6>
                <LoginForm 
                  onClose={onClose} 
                  login={login} 
                  actualizarCredenciales={actualizarCredenciales} 
                />
                <p className="text-center">
                  ¿No tienes una cuenta? 
                  <button className="btn btn-link" onClick={() => setShowLogin(false)}>
                    Regístrate aquí
                  </button>
                </p>
              </div>
            ) : (
              <div>
                <p className="text-center text-muted mb-4">
                  Para continuar, por favor inicia sesión con tu cuenta.
                </p>
                <div className="d-flex justify-content-center mb-3">
                  <button className="btn btn-primary me-2" onClick={() => setShowLogin(true)}>
                    Iniciar Sesión
                  </button>
                  <button className="btn btn-secondary" onClick={() => registrarUsuario(user)}>
                    Registrarse
                  </button>
                </div>
                <p className="text-muted">o continúa como invitado.</p>
              </div>
            )}
            <ReservationForm 
              room={room} 
              onClose={onClose} 
              user={user} 
              initialData={initialFilters}
              registrarUsuario={registrarUsuario}
            />
          </div>
        </div>
      </div>
    </div>
  );
}