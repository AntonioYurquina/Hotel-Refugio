import React, { useMemo } from 'react';

const getStatusBadge = (status) => {
  switch (status) {
    case 'confirmada': return 'bg-success';
    case 'pendiente': return 'bg-warning text-dark';
    default: return 'bg-secondary';
  }
};

export default function ActiveReservations({ reservations, onEdit }) {
  const activeReservations = useMemo(() => {
    return reservations
      .filter(res => res.estado === 'confirmada' || res.estado === 'pendiente')
      .sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio));
  }, [reservations]);

  if (activeReservations.length === 0) {
    return <p className="text-muted">No hay reservas activas en este momento.</p>;
  }

  return (
    <div className="list-group">
      {activeReservations.map(res => (
        <div key={res.id_reserva} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>Reserva #{res.id_reserva} (Hab. {res.id_habitacion})</strong>
            <span className={`ms-2 badge ${getStatusBadge(res.estado)}`}>{res.estado}</span>
            <small className="d-block text-muted">
              {new Date(res.fecha_inicio).toLocaleDateString()} - {new Date(res.fecha_fin).toLocaleDateString()}
            </small>
          </div>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(res)}>
            <i className="fa-solid fa-pencil me-1"></i> Editar
          </button>
        </div>
      ))}
    </div>
  );
}
