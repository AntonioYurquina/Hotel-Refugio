import React, { useState, useMemo } from 'react';

const getStatusBadge = (status) => {
  switch (status) {
    case 'confirmada': return 'bg-success';
    case 'pendiente': return 'bg-warning text-dark';
    case 'cancelada': return 'bg-danger';
    default: return 'bg-secondary';
  }
};

export default function ManagedReservations({ reservations, onEdit }) {
  const [statusFilter, setStatusFilter] = useState('todas'); // 'todas', 'confirmada', 'pendiente', etc.

  const managedReservations = useMemo(() => {
    const filtered = statusFilter === 'todas'
      ? reservations
      : reservations.filter(res => res.estado === statusFilter);
    
    return filtered.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
  }, [reservations, statusFilter]);

  const filterOptions = ['todas', 'confirmada', 'pendiente', 'cancelada', 'finalizada'];

  return (
    <>
      <div className="btn-group mb-3" role="group" aria-label="Filtro de estado de reservas">
        {filterOptions.map(option => (
          <button
            key={option}
            type="button"
            className={`btn btn-sm text-capitalize ${statusFilter === option ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setStatusFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {managedReservations.length === 0 ? (
        <p className="text-muted">No hay reservas que coincidan con el filtro seleccionado.</p>
      ) : (
        <div className="list-group">
          {managedReservations.map(res => (
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
      )}
    </>
  );
}
