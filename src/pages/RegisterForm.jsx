import React, { useState } from 'react';
import { DEMO } from '../config';
import { validarRegistro } from '../utils/validaciones';

const VACIO = { nombre: '', apellido: '', email: '', telefono: '', contraseña: '', confirmar: '' };

function Campo({ id, etiqueta, error, children }) {
  return (
    <>
      <label htmlFor={id} className="form-label">{etiqueta}</label>
      {children}
      {error && <div className="invalid-feedback d-block" id={`${id}-error`}>{error}</div>}
    </>
  );
}

export default function RegisterForm({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState(VACIO);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const encontrados = validarRegistro(formData);
    setErrors(encontrados);
    if (Object.keys(encontrados).length) return;
    setSubmitting(true);
    const { confirmar: _confirmar, ...datos } = formData;
    await onRegister(datos);
    setSubmitting(false);
  };

  const propsCampo = (nombre, maximo) => ({
    id: `registro-${nombre}`,
    name: nombre,
    className: `form-control ${errors[nombre] ? 'is-invalid' : ''}`,
    value: formData[nombre],
    onChange: handleChange,
    maxLength: maximo,
    'aria-describedby': errors[nombre] ? `registro-${nombre}-error` : undefined,
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <Campo id="registro-nombre" etiqueta="Nombre" error={errors.nombre}>
            <input type="text" autoComplete="given-name" {...propsCampo('nombre', 50)} />
          </Campo>
        </div>
        <div className="col-md-6">
          <Campo id="registro-apellido" etiqueta="Apellido" error={errors.apellido}>
            <input type="text" autoComplete="family-name" {...propsCampo('apellido', 50)} />
          </Campo>
        </div>
        <div className="col-12">
          <Campo id="registro-email" etiqueta="Email" error={errors.email}>
            <input type="email" autoComplete="email" {...propsCampo('email', 100)} />
          </Campo>
        </div>
        <div className="col-12">
          <Campo id="registro-telefono" etiqueta="Teléfono (opcional)">
            <input type="tel" autoComplete="tel" {...propsCampo('telefono', 20)} />
          </Campo>
        </div>
        <div className="col-md-6">
          <Campo id="registro-contraseña" etiqueta="Contraseña" error={errors.contraseña}>
            <input type="password" autoComplete="new-password" {...propsCampo('contraseña')} />
          </Campo>
        </div>
        <div className="col-md-6">
          <Campo id="registro-confirmar" etiqueta="Confirmar contraseña" error={errors.confirmar}>
            <input type="password" autoComplete="new-password" {...propsCampo('confirmar')} />
          </Campo>
        </div>
      </div>
      {!DEMO && (
        <p className="form-text mt-3 mb-0">
          <i className="fa-solid fa-triangle-exclamation me-1 text-warning" aria-hidden="true"></i>
          La API guarda las contraseñas sin cifrar: no uses una que ya uses en otros sitios.
        </p>
      )}
      <button type="submit" className="btn btn-primary w-100 mt-4" disabled={submitting}>
        {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>
      <p className="text-center mt-3 mb-0">
        ¿Ya tenés una cuenta? <button type="button" className="btn btn-link p-0 align-baseline" onClick={onSwitchToLogin}>Iniciá sesión</button>
      </p>
    </form>
  );
}
