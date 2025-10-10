import React from 'react';

export default function RoomsAdmin({ rooms, deleteRoom }) {
  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Habitaciones ({rooms.length})</h5>
        <button className="btn btn-primary btn-sm">
          <i className="fa-solid fa-plus me-1"></i> Añadir Habitación
        </button>
      </div>
      <div className="list-group">
        {rooms.map(room => (
          <div key={room.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{room.name}</strong>
              <span className="ms-2 text-muted">(${room.price}/noche, Cap: {room.capacity})</span>
            </div>
            <div>
              <button className="btn btn-sm btn-outline-secondary me-2">
                <i className="fa-solid fa-pencil"></i> Editar
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteRoom(room.id)}>
                <i className="fa-solid fa-trash-can"></i> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
