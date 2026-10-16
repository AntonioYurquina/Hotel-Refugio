import React, { useMemo, useState } from 'react';
import EstadoBadge from '../../components/ui/EstadoBadge';
import { ESTADOS_RESERVA, etiquetaUsuario } from '../../utils/reservas';
import { formatearFecha } from '../../utils/fechas';

const MAXIMO = 8;

export default function ManagedReservations({ reservations, rooms, users, currentUser, onEdit }) {
  const [filtro, setFiltro] = useState('todas');

  const ultimas = useMemo(
    () =>
      reservations
        .filter((r) => filtro === 'todas' || r.estado === filtro)
        .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
        .slice(0, MAXIMO),
    [reservations, filtro],
  );

  return (
    <>
      <div className="btn-group btn-group-sm flex-wrap mb-3" role="group" aria-label="Filtrar reservas por estado">
        {['todas', ...ESTADOS_RESERVA].map((opcion) => (
          <button key={opcion} type="button" className={`btn text-capitalize ${filtro === opcion ? 'btn-primary' : 'btn-outline-secondary'}`} aria-pressed={filtro === opcion} onClick={() => setFiltro(opcion)}>
            {opcion}
          </button>
        ))}
      </div>

      {ultimas.length === 0 ? (
        <p className="text-muted mb-0">No hay reservas con ese estado.</p>
      ) : (
        <div className="list-group">
          {ultimas.map((r) => (
            <div key={r.id_reserva} className="list-group-item d-flex justify-content-between align-items-center gap-2">
              <div>
                <strong>#{r.id_reserva} · Hab. {rooms.find((h) => h.id_habitacion === r.id_habitacion)?.numero ?? r.id_habitacion}</strong>
                <EstadoBadge estado={r.estado} className="ms-2" />
                <small className="d-block text-muted">{etiquetaUsuario(users, r.id_usuario, currentUser)} · {formatearFecha(r.fecha_inicio)} – {formatearFecha(r.fecha_fin)}</small>
              </div>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(r)} aria-label={`Editar la reserva ${r.id_reserva}`}>
                <i className="fa-solid fa-pencil" aria-hidden="true"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
