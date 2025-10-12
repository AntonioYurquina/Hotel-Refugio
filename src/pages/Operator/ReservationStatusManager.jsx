import React from 'react';

const getStatusSelectClass = (status) => {
  switch (status) {
    case 'confirmada': return 'status-select-success';
    case 'pendiente': return 'status-select-warning';
    case 'cancelada': return 'status-select-danger';
    case 'finalizada': return 'status-select-secondary';
    default: return '';
  }
};

export default function ReservationStatusManager({ reservations, onUpdateStatus }) {
  const handleStatusChange = (reservation, newStatus) => {
    onUpdateStatus({ ...reservation, estado: newStatus });
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>ID Reserva</th>
            <th>ID Usuario</th>
            <th>ID Hab.</th>
            <th>Fechas</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(res => (
            <tr key={res.id_reserva}>
              <td>#{res.id_reserva}</td>
              <td>{res.id_usuario}</td>
              <td>{res.id_habitacion}</td>
              <td>{new Date(res.fecha_inicio).toLocaleDateString()} - {new Date(res.fecha_fin).toLocaleDateString()}</td>
              <td>
                <select
                  className={`form-select form-select-sm ${getStatusSelectClass(res.estado)}`}
                  value={res.estado}
                  onChange={(e) => handleStatusChange(res, e.target.value)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="cancelada">Cancelada</option>
                  <option value="finalizada">Finalizada</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
