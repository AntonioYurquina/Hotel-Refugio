import React, { useState } from 'react';

export default function LoadReservationForm({ rooms, onSave, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    id_usuario: '',
    id_habitacion: '',
    fecha_inicio: initialData?.fecha_inicio || '',
    fecha_fin: initialData?.fecha_fin || '',
    guests: 1,
    estado: 'confirmada'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id_usuario || !formData.id_habitacion || !formData.fecha_inicio || !formData.fecha_fin) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }
    // Asegurarse de que los IDs son números
    onSave({
      ...formData,
      id_usuario: parseInt(formData.id_usuario, 10),
      id_habitacion: parseInt(formData.id_habitacion, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">ID de Usuario</label>
          <input type="number" name="id_usuario" className="form-control" value={formData.id_usuario} onChange={handleChange} placeholder="Ej: 6" required />
        </div>
        <div className="col-12">
          <label className="form-label">Habitación Solicitada</label>
          <select name="id_habitacion" className="form-select" value={formData.id_habitacion} onChange={handleChange} required>
            <option value="">Seleccione una habitación...</option>
            {rooms.map(room => (
              <option key={room.id_habitacion} value={room.id_habitacion}>
                Hab. {room.numero} ({room.tipo})
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Check-in</label>
          <input type="date" name="fecha_inicio" className="form-control" value={formData.fecha_inicio} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Check-out</label>
          <input type="date" name="fecha_fin" className="form-control" value={formData.fecha_fin} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Huéspedes</label>
          <input type="number" name="guests" className="form-control" value={formData.guests} min="1" onChange={handleChange} required />
        </div>
      </div>
      <div className="modal-footer mt-4 px-0">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Crear Reserva</button>
      </div>
    </form>
  );
}
