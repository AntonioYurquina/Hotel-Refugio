import React from 'react';

const getStatusBadge = (status) => {
  switch (status) {
    case 'disponible': return 'bg-success';
    case 'ocupada': return 'bg-danger';
    case 'mantenimiento': return 'bg-warning text-dark';
    case 'cerrada': return 'bg-secondary';
    default: return 'bg-light';
  }
};

export default function RoomsAdmin({ rooms, onAdd, onEdit, onDelete }) {
  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Habitaciones ({rooms.length})</h5>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>
          <i className="fa-solid fa-plus me-1"></i> Añadir Habitación
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Tipo</th>
              <th>Capacidad</th>
              <th>Precio/Noche</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room.id_habitacion}>
                <td><strong>{room.numero}</strong></td>
                <td>{room.tipo}</td>
                <td>{room.capacidad}</td>
                <td className="fw-bold text-brand-orange">${parseFloat(room.precio_noche).toFixed(2)}</td>
                <td><span className={`badge ${getStatusBadge(room.estado)}`}>{room.estado}</span></td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => onEdit(room)}>
                    <i className="fa-solid fa-pencil"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(room.id_habitacion)}>
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
