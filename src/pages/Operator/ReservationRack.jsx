import React, { useMemo, useState } from 'react';
import { format, addDays, differenceInDays } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';

export default function ReservationRack({ rooms, reservations, onEditReservation }) {
  const { theme } = useTheme();
  const [showArchived, setShowArchived] = useState(false);

  const filteredReservations = useMemo(() => 
    showArchived
      ? reservations
      : reservations.filter(res => res.estado === 'confirmada' || res.estado === 'pendiente'), 
  [reservations, showArchived]);

  const { startDate, endDate, totalDays, daysArray } = useMemo(() => {
    const start = new Date();
    const end = addDays(start, 30);
    const count = differenceInDays(end, start) + 1;
    const days = Array.from({ length: count }, (_, i) => addDays(start, i));
    return {
      startDate: start,
      endDate: end,
      totalDays: count,
      daysArray: days,
    };
  }, []);

  const getReservationStyle = (res) => {
    const resStart = new Date(res.fecha_inicio);
    const resEnd = new Date(res.fecha_fin);

    const left = Math.max(0, differenceInDays(resStart, startDate));
    const right = Math.max(0, differenceInDays(endDate, resEnd));
    
    const leftPercent = (left / totalDays) * 100;
    const rightPercent = (right / totalDays) * 100;

    const status = res.estado;
    const colors = {
      light: { confirmada: '#198754', pendiente: '#ffc107', cancelada: '#dc3545', finalizada: '#6c757d' },
      dark: { confirmada: '#20c997', pendiente: '#ffca2c', cancelada: '#fd7e14', finalizada: '#adb5bd' }
    };

    return {
      position: 'absolute',
      left: `${leftPercent}%`,
      right: `${rightPercent}%`,
      top: '5px',
      bottom: '5px',
      backgroundColor: colors[theme][status] || colors[theme]['finalizada'],
      borderRadius: '5px',
      overflow: 'hidden',
      color: status === 'pendiente' ? 'black' : 'white',
      fontSize: '12px',
      padding: '0 5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      opacity: (status === 'cancelada' || status === 'finalizada') ? 0.6 : 1,
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
              {daysArray.map(day => (
                <th key={day.toString()} className="text-center">{format(day, 'd')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room.id_habitacion}>
                <td>{room.numero} ({room.tipo})</td>
                <td colSpan={totalDays} style={{ position: 'relative', padding: 0 }}>
                  {filteredReservations
                    .filter(res => res.id_habitacion === room.id_habitacion)
                    .map(res => (
                      <div 
                        key={res.id_reserva} 
                        style={getReservationStyle(res)} 
                        title={`Reserva #${res.id_reserva} (${res.estado})`}
                        onClick={() => onEditReservation(res)}
                      >
                        <span>ID: {res.id_reserva}</span>
                      </div>
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
