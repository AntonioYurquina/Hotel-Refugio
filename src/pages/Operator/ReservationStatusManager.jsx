import React, { useMemo, useState } from 'react';
import { ESTADOS_RESERVA, etiquetaUsuario } from '../../utils/reservas';
import { formatearFecha } from '../../utils/fechas';
import { capitalizar } from '../../utils/formato';

const CLASE_SELECT = {
  confirmada: 'status-select-success', pendiente: 'status-select-warning',
  cancelada: 'status-select-danger', finalizada: 'status-select-secondary',
};

export default function ReservationStatusManager({ reservations, rooms, users, currentUser, onUpdateStatus }) {
  const [busqueda, setBusqueda] = useState('');
  const [trabajando, setTrabajando] = useState(null);

  const filas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return [...reservations]
      .reverse()
      .map((r) => ({
        r,
        habitacion: rooms.find((h) => h.id_habitacion === r.id_habitacion),
        cliente: etiquetaUsuario(users, r.id_usuario, currentUser),
      }))
      .filter(({ r, habitacion, cliente }) => !texto || `${r.id_reserva} ${habitacion?.numero ?? ''} ${cliente}`.toLowerCase().includes(texto));
  }, [reservations, rooms, users, currentUser, busqueda]);

  const cambiar = async (reserva, estado) => {
    setTrabajando(reserva.id_reserva);
    await onUpdateStatus(reserva, estado);
    setTrabajando(null);
  };

  return (
    <>
      <label htmlFor="buscar-reserva" className="visually-hidden">Buscar reservas</label>
      <input id="buscar-reserva" type="search" className="form-control form-control-sm mb-3" placeholder="Buscar por número de reserva, habitación o cliente…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      <div className="table-responsive" style={{ maxHeight: '420px' }}>
        <table className="table table-hover align-middle mb-0">
          <thead className="sticky-top bg-body">
            <tr><th>Reserva</th><th>Cliente</th><th>Hab.</th><th>Fechas</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {filas.map(({ r, habitacion, cliente }) => (
              <tr key={r.id_reserva}>
                <td>#{r.id_reserva}</td>
                <td>{cliente}</td>
                <td>{habitacion?.numero ?? `#${r.id_habitacion}`}</td>
                <td className="text-nowrap">{formatearFecha(r.fecha_inicio)} – {formatearFecha(r.fecha_fin)}</td>
                <td>
                  <select
                    className={`form-select form-select-sm ${CLASE_SELECT[r.estado] ?? ''}`}
                    value={r.estado}
                    disabled={trabajando === r.id_reserva}
                    aria-label={`Estado de la reserva ${r.id_reserva}`}
                    onChange={(e) => cambiar(r, e.target.value)}
                  >
                    {ESTADOS_RESERVA.map((e) => <option key={e} value={e}>{capitalizar(e)}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {filas.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No hay reservas que coincidan con la búsqueda.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
