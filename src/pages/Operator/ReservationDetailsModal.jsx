import React from 'react';

const getStatusBadge = (status) => {
  switch (status) {
    case 'confirmada': return 'bg-success';
    case 'pendiente': return 'bg-warning text-dark';
    case 'cancelada': return 'bg-danger';
    case 'finalizada': return 'bg-secondary';
    default: return 'bg-light';
  }
};

export default function ReservationDetailsModal({ reservation, room, user, onEdit, onDelete, onClose }) {
  if (!reservation || !room || !user) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalles de Reserva #{reservation.id_reserva}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p><strong>Estado:</strong> <span className={`badge ${getStatusBadge(reservation.estado)}`}>{reservation.estado}</span></p>
            <p><strong>Habitación:</strong> {room.numero} ({room.tipo})</p>
            <p><strong>Cliente:</strong> {user.nombre} {user.apellido} ({user.email})</p>
            <p><strong>Fechas:</strong> {new Date(reservation.fecha_inicio).toLocaleDateString()} al {new Date(reservation.fecha_fin).toLocaleDateString()}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={() => onDelete(reservation.id_reserva)}>Eliminar</button>
            <button type="button" className="btn btn-primary" onClick={() => onEdit(reservation)}>Editar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
