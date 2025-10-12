import React, { useState } from 'react';

export default function EditRoomForm({ room, onSave, onCancel }) {
  const [formData, setFormData] = useState(room);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          <input type="text" name="numero" className="form-control" value={formData.numero} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Tipo</label>
          <input type="text" name="tipo" className="form-control" value={formData.tipo} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Precio por Noche</label>
          <input type="number" name="precio_noche" className="form-control" value={formData.precio_noche} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Capacidad</label>
          <input type="number" name="capacidad" className="form-control" value={formData.capacidad} onChange={handleChange} />
        </div>
        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea name="descripcion" className="form-control" rows="3" value={formData.descripcion} onChange={handleChange}></textarea>
        </div>
      </div>
      <div className="modal-footer mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </div>
    </form>
  );
}
