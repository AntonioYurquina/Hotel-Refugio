import React, { useState } from 'react';

export default function EditReservationForm({ reservation, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    ...reservation,
    // Corregido: usar los nombres de campo correctos de la API
    fecha_inicio: reservation.fecha_inicio.split('T')[0],
    fecha_fin: reservation.fecha_fin.split('T')[0],
  });

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
          <label className="form-label">Check-in</label>
          <input type="date" name="fecha_inicio" className="form-control" value={formData.fecha_inicio} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Check-out</label>
          <input type="date" name="fecha_fin" className="form-control" value={formData.fecha_fin} onChange={handleChange} />
        </div>
        <div className="col-12">
          <label className="form-label">Estado de la Reserva</label>
          <select name="estado" className="form-select" value={formData.estado} onChange={handleChange}>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
            <option value="finalizada">Finalizada</option>
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
