import React, { useState } from 'react';
import { validarRegistro } from '../../utils/validaciones';

// Alta de personal o clientes desde gerencia (POST /registrar). La API no permite editar ni borrar usuarios.
export default function UserCreateForm({ onSave, onCancel }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', telefono: '', 'contraseña': '', confirmar: '', tipo_usuario: 'operador' });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    const encontrados = validarRegistro(form);
    setErrores(encontrados);
    if (Object.keys(encontrados).length) return;
    setEnviando(true);
    const { confirmar: _confirmar, ...datos } = form;
    await onSave(datos);
    setEnviando(false);
  };

  const campo = (id, etiqueta, nombre, props = {}) => (
    <>
      <label htmlFor={id} className="form-label">{etiqueta}</label>
      <input id={id} name={nombre} className={`form-control ${errores[nombre] ? 'is-invalid' : ''}`} value={form[nombre]} onChange={cambiar} {...props} />
      {errores[nombre] && <div className="invalid-feedback">{errores[nombre]}</div>}
    </>
  );

  return (
    <form onSubmit={enviar} noValidate>
      <div className="row g-3">
        <div className="col-md-6">{campo('usr-nombre', 'Nombre', 'nombre', { maxLength: 50 })}</div>
        <div className="col-md-6">{campo('usr-apellido', 'Apellido', 'apellido', { maxLength: 50 })}</div>
        <div className="col-12">{campo('usr-email', 'Email', 'email', { type: 'email', maxLength: 100 })}</div>
        <div className="col-md-6">{campo('usr-telefono', 'Teléfono (opcional)', 'telefono', { type: 'tel', maxLength: 20 })}</div>
        <div className="col-md-6">
          <label htmlFor="usr-rol" className="form-label">Rol</label>
          <select id="usr-rol" name="tipo_usuario" className="form-select" value={form.tipo_usuario} onChange={cambiar}>
            <option value="cliente">Cliente</option>
            <option value="operador">Operador</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div className="col-md-6">{campo('usr-clave', 'Contraseña', 'contraseña', { type: 'password', autoComplete: 'new-password' })}</div>
        <div className="col-md-6">{campo('usr-confirmar', 'Confirmar contraseña', 'confirmar', { type: 'password', autoComplete: 'new-password' })}</div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={enviando}>{enviando ? 'Creando…' : 'Crear usuario'}</button>
      </div>
    </form>
  );
}
