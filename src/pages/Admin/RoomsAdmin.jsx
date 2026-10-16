import React from 'react';
import EstadoBadge from '../../components/ui/EstadoBadge';
import { ESTADOS_HABITACION } from '../../utils/reservas';
import { capitalizar, formatearPrecio } from '../../utils/formato';

export default function RoomsAdmin({ rooms, onAdd, onChangeState }) {
  return (
    <section aria-label="Habitaciones">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Habitaciones ({rooms.length})</h2>
        <button className="btn btn-primary btn-sm" onClick={onAdd}><i className="fa-solid fa-plus me-1" aria-hidden="true"></i> Añadir habitación</button>
      </div>
      <p className="small text-muted">La API Hotel v1 permite crear habitaciones y cambiar su estado; no tiene operaciones para editar otros datos ni para eliminarlas.</p>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead><tr><th>N.º</th><th>Tipo</th><th>Capacidad</th><th>Precio por noche</th><th>Estado</th><th style={{ minWidth: '170px' }}>Cambiar estado</th></tr></thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id_habitacion}>
                <td><strong>{room.numero}</strong></td>
                <td>{capitalizar(room.tipo)}</td>
                <td>{room.capacidad}</td>
                <td className="fw-bold text-brand-orange">{formatearPrecio(room.precio_noche)}</td>
                <td><EstadoBadge estado={room.estado} /></td>
                <td>
                  <select className="form-select form-select-sm" value={room.estado} aria-label={`Estado de la habitación ${room.numero}`} onChange={(e) => onChangeState(room.id_habitacion, e.target.value)}>
                    {ESTADOS_HABITACION.map((e) => <option key={e} value={e}>{capitalizar(e)}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
