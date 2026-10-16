import React, { useMemo, useState } from 'react';
import { useTheme } from '../../context/themeContext';
import { aFechaApi, hoyApi, noches, sumarDias } from '../../utils/fechas';

const DIAS = 31;
const COLORES = {
  light: { confirmada: '#198754', pendiente: '#ffc107', cancelada: '#dc3545', finalizada: '#6c757d' },
  dark: { confirmada: '#20c997', pendiente: '#ffca2c', cancelada: '#fd7e14', finalizada: '#adb5bd' },
};

export default function ReservationRack({ rooms, reservations, onEditReservation }) {
  const { theme } = useTheme();
  const [showArchived, setShowArchived] = useState(false);

  const inicio = hoyApi();
  const dias = useMemo(() => Array.from({ length: DIAS }, (_, i) => sumarDias(inicio, i)), [inicio]);

  const visibles = useMemo(
    () =>
      reservations.filter(
        (res) =>
          (showArchived || res.estado === 'confirmada' || res.estado === 'pendiente') &&
          aFechaApi(res.fecha_fin) >= inicio &&
          noches(inicio, res.fecha_inicio) < DIAS,
      ),
    [reservations, showArchived, inicio],
  );

  // Posición de cada barra dentro de la ventana de 31 días, recortada en los bordes.
  const estiloBarra = (res) => {
    const desde = Math.max(0, noches(inicio, res.fecha_inicio));
    const hasta = Math.min(DIAS, Math.max(desde + 1, noches(inicio, res.fecha_fin) + 1));
    return {
      position: 'absolute',
      left: `${(desde / DIAS) * 100}%`,
      width: `${((hasta - desde) / DIAS) * 100}%`,
      top: '5px',
      bottom: '5px',
      backgroundColor: COLORES[theme][res.estado] ?? COLORES[theme].finalizada,
      borderRadius: '5px',
      color: res.estado === 'pendiente' ? 'black' : 'white',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: 0,
      overflow: 'hidden',
      opacity: res.estado === 'cancelada' || res.estado === 'finalizada' ? 0.6 : 1,
    };
  };

  return (
    <>
      <div className="form-check form-switch mb-3">
        <input 
          className="form-check-input" 
          type="checkbox" 
          role="switch" 
          id="showArchivedRackSwitch"
          checked={showArchived}
          onChange={() => setShowArchived(!showArchived)}
        />
        <label className="form-check-label" htmlFor="showArchivedRackSwitch">Mostrar canceladas y finalizadas</label>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered rack-table">
          <thead>
            <tr>
              <th style={{ minWidth: '150px' }}>Habitación</th>
              {dias.map((day) => (
                <th key={day} className="text-center small">{Number(day.slice(8))}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id_habitacion}>
                <td className="text-nowrap">{room.numero} · {room.tipo}</td>
                <td colSpan={DIAS} style={{ position: 'relative', padding: 0 }}>
                  {visibles
                    .filter((res) => res.id_habitacion === room.id_habitacion)
                    .map((res) => (
                      <button
                        type="button"
                        key={res.id_reserva}
                        style={estiloBarra(res)}
                        title={`Reserva #${res.id_reserva} (${res.estado})`}
                        aria-label={`Ver la reserva ${res.id_reserva}, ${res.estado}`}
                        onClick={() => onEditReservation(res)}
                      >
                        #{res.id_reserva}
                      </button>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
