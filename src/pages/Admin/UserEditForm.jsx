import React, { useState } from 'react';

export default function UserEditForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Apellido</label>
          <input type="text" name="apellido" className="form-control" value={formData.apellido} onChange={handleChange} required />
        </div>
        <div className="col-12">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Teléfono</label>
          <input type="tel" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Rol</label>
          <select name="tipo_usuario" className="form-select" value={formData.tipo_usuario} onChange={handleChange}>
            <option value="cliente">Cliente</option>
            <option value="operador">Operador</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <div className="modal-footer mt-4 px-0">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </div>
    </form>
  );
}
