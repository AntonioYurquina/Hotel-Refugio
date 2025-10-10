import React, { useState, useMemo } from 'react';

export default function ReservationsAdmin({ reservations, onDelete }) {
  const [query, setQuery] = useState('');

  const filteredReservations = useMemo(() => {
    if (!reservations) return [];
    return reservations.filter(res =>
      String(res.id_habitacion).includes(query) ||
      String(res.id_usuario).includes(query)
    );
  }, [reservations, query]);

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Todas las Reservas ({filteredReservations.length})</h5>
        <input
          type="text"
          className="form-control form-control-sm w-auto"
          placeholder="Buscar por ID de habitación o usuario..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <div className="list-group">
        {filteredReservations.length > 0 ? filteredReservations.map(res => (
          <div key={res.id_reserva} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>Reserva #{res.id_reserva}</strong>
              <small className="d-block text-muted">
                Habitación: {res.id_habitacion} | Usuario: {res.id_usuario} | Desde: {new Date(res.fecha_entrada).toLocaleDateString()} | Hasta: {new Date(res.fecha_salida).toLocaleDateString()}
              </small>
            </div>
            <div>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(res.id_reserva)}>
                <i className="fa-solid fa-trash-can"></i> Eliminar
              </button>
            </div>
          </div>
        )) : (
          <p className="text-muted">No se encontraron reservas.</p>
        )}
      </div>
    </section>
  );
}
