import React, { useState } from 'react';

export default function AuthInModal({ login, actualizarCredenciales, registrarUsuario }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ email: '', contraseña: '', nombre: '', apellido: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await actualizarCredenciales(formData.email, formData.contraseña);
    await login();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    await registrarUsuario({
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      contraseña: formData.contraseña,
    });
  };

  return (
    <div className="p-4">
      <h5 className="text-center mb-3">{isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta'}</h5>
      <p className="text-center text-muted small">Para continuar con tu reserva, por favor accede a tu cuenta.</p>
      
      <form onSubmit={isLoginView ? handleLogin : handleRegister}>
        {!isLoginView && (
          <>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input type="text" name="nombre" className="form-control" required onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Apellido</label>
              <input type="text" name="apellido" className="form-control" required onChange={handleInputChange} />
            </div>
          </>
        )}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" required onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" name="contraseña" className="form-control" required onChange={handleInputChange} />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {isLoginView ? 'Acceder' : 'Registrarse'}
        </button>
      </form>

      <div className="text-center mt-3">
        <button className="btn btn-link" onClick={() => setIsLoginView(!isLoginView)}>
          {isLoginView ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
        </button>
      </div>
    </div>
  );
}
