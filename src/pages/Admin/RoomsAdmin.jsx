import React from 'react';

export default function RoomsAdmin({ rooms, onAdd, onEdit, onDelete }) {
  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Habitaciones ({rooms ? rooms.length : 0})</h5>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>
          <i className="fa-solid fa-plus me-1"></i> Añadir Habitación
        </button>
      </div>
      <div className="list-group">
        {rooms && rooms.map(room => (
          <div key={room.id_habitacion} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>Habitación {room.numero} ({room.tipo})</strong>
              <span className="ms-2 text-muted">(${parseFloat(room.precio_noche).toFixed(2)}/noche, Cap: {room.capacidad})</span>
            </div>
            <div>
              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => onEdit(room)}>
                <i className="fa-solid fa-pencil"></i> Editar
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(room.id_habitacion)}>
                <i className="fa-solid fa-trash-can"></i> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
