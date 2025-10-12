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

export default function ReservationsAdmin({ reservations, onDelete }) {
  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Reservas ({reservations.length})</h5>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>ID Reserva</th>
              <th>ID Usuario</th>
              <th>ID Hab.</th>
              <th>Fechas</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(res => (
              <tr key={res.id_reserva}>
                <td>#{res.id_reserva}</td>
                <td>{res.id_usuario}</td>
                <td>{res.id_habitacion}</td>
                <td>{new Date(res.fecha_inicio).toLocaleDateString()} - {new Date(res.fecha_fin).toLocaleDateString()}</td>
                <td><span className={`badge ${getStatusBadge(res.estado)}`}>{res.estado}</span></td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(res.id_reserva)}>
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
