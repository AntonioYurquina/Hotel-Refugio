import React, { useMemo, useState } from 'react';
import EstadoBadge from '../../components/ui/EstadoBadge';
import { ESTADOS_RESERVA, etiquetaUsuario } from '../../utils/reservas';
import { formatearFecha, noches } from '../../utils/fechas';
import { aNumero, capitalizar, formatearPrecio } from '../../utils/formato';

export default function ReservationsAdmin({ reservations, rooms, users, currentUser, onDelete }) {
  const [estado, setEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  const filas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return [...reservations]
      .reverse()
      .filter((r) => estado === 'todas' || r.estado === estado)
      .map((r) => ({ r, habitacion: rooms.find((h) => h.id_habitacion === r.id_habitacion), cliente: etiquetaUsuario(users, r.id_usuario, currentUser) }))
      .filter(({ r, habitacion, cliente }) => !texto || `${r.id_reserva} ${habitacion?.numero ?? ''} ${cliente}`.toLowerCase().includes(texto));
  }, [reservations, rooms, users, currentUser, estado, busqueda]);

  return (
    <section aria-label="Reservas">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="h5 mb-0">Reservas ({filas.length})</h2>
        <div className="d-flex gap-2">
          <label htmlFor="admin-filtro-estado" className="visually-hidden">Filtrar por estado</label>
          <select id="admin-filtro-estado" className="form-select form-select-sm w-auto" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="todas">Todos los estados</option>
            {ESTADOS_RESERVA.map((e) => <option key={e} value={e}>{capitalizar(e)}</option>)}
          </select>
          <label htmlFor="admin-buscar-reserva" className="visually-hidden">Buscar reservas</label>
          <input id="admin-buscar-reserva" type="search" className="form-control form-control-sm" placeholder="Buscar…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
      </div>
      <div className="table-responsive" style={{ maxHeight: '480px' }}>
        <table className="table table-hover align-middle">
          <thead className="sticky-top bg-body"><tr><th>Reserva</th><th>Cliente</th><th>Hab.</th><th>Fechas</th><th className="text-end">Total</th><th>Estado</th><th className="text-end">Acciones</th></tr></thead>
          <tbody>
            {filas.map(({ r, habitacion, cliente }) => (
              <tr key={r.id_reserva}>
                <td>#{r.id_reserva}</td>
                <td>{cliente}</td>
                <td>{habitacion?.numero ?? `#${r.id_habitacion}`}</td>
                <td className="text-nowrap">{formatearFecha(r.fecha_inicio)} – {formatearFecha(r.fecha_fin)}</td>
                <td className="text-end">{habitacion ? formatearPrecio(noches(r.fecha_inicio, r.fecha_fin) * aNumero(habitacion.precio_noche)) : '—'}</td>
                <td><EstadoBadge estado={r.estado} /></td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(r)} aria-label={`Eliminar la reserva ${r.id_reserva}`}><i className="fa-solid fa-trash-can" aria-hidden="true"></i></button>
                </td>
              </tr>
            ))}
            {filas.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-4">No hay reservas que coincidan.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
