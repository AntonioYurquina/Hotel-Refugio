import React, { useState } from 'react';

export default function RoomEditForm({ room, onSave, onCancel }) {
  const [formData, setFormData] = useState(room);

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
          <label className="form-label">Número</label>
          <input type="number" name="numero" className="form-control" value={formData.numero} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Tipo</label>
          <input type="text" name="tipo" className="form-control" value={formData.tipo} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Capacidad</label>
          <input type="number" name="capacidad" className="form-control" value={formData.capacidad} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Precio/Noche</label>
          <input type="number" step="0.01" name="precio_noche" className="form-control" value={formData.precio_noche} onChange={handleChange} required />
        </div>
        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea name="descripcion" className="form-control" value={formData.descripcion} onChange={handleChange} rows="3"></textarea>
        </div>
      </div>
      <div className="modal-footer mt-4 px-0">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </div>
    </form>
  );
}
