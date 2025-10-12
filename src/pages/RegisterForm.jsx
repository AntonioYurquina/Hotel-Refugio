import React, { useState } from 'react';

export default function RegisterForm({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contraseña: '',
    confirmPassword: '',
    telefono: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.nombre.trim()) e.nombre = 'Nombre requerido';
    if (!formData.apellido.trim()) e.apellido = 'Apellido requerido';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = 'Email inválido';
    if (formData.contraseña.length < 6) e.contraseña = 'La contraseña debe tener al menos 6 caracteres.';
    if (formData.contraseña !== formData.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await onRegister(formData);
    setSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
          {errors.nombre && <div className="text-danger small">{errors.nombre}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">Apellido</label>
          <input type="text" name="apellido" className="form-control" value={formData.apellido} onChange={handleChange} required />
          {errors.apellido && <div className="text-danger small">{errors.apellido}</div>}
        </div>
        <div className="col-12">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          {errors.email && <div className="text-danger small">{errors.email}</div>}
        </div>
        <div className="col-12">
          <label className="form-label">Teléfono (Opcional)</label>
          <input type="tel" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Contraseña</label>
          <input type="password" name="contraseña" className="form-control" value={formData.contraseña} onChange={handleChange} required />
          {errors.contraseña && <div className="text-danger small">{errors.contraseña}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">Confirmar Contraseña</label>
          <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required />
          {errors.confirmPassword && <div className="text-danger small">{errors.confirmPassword}</div>}
        </div>
      </div>
      <button type="submit" className="btn btn-primary w-100 mt-4" disabled={submitting}>
        {submitting ? 'Registrando...' : 'Crear Cuenta'}
      </button>
      <p className="text-center mt-3">
        ¿Ya tienes una cuenta? <button type="button" className="btn btn-link p-0" onClick={onSwitchToLogin}>Inicia sesión</button>
      </p>
    </form>
  );
}
