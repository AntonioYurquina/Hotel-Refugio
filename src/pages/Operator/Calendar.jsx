import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTheme } from '../../context/ThemeContext';

const locales = { 'es': es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function OperatorCalendar({ reservations, onSelectEvent, onSelectSlot }) {
  const { theme } = useTheme();
  const [showArchived, setShowArchived] = useState(false);

  const events = useMemo(() => {
    if (!reservations) return [];
    
    const filteredReservations = showArchived
      ? reservations
      : reservations.filter(res => res.estado === 'confirmada' || res.estado === 'pendiente');

    return filteredReservations.map(res => ({
      title: `Reserva #${res.id_reserva} - Hab: ${res.id_habitacion}`,
      start: new Date(res.fecha_inicio),
      end: new Date(res.fecha_fin),
      allDay: true,
      resource: res,
    }));
  }, [reservations, showArchived]);

  const eventStyleGetter = (event) => {
    const status = event.resource.estado;
    const colors = {
      light: { confirmada: '#198754', pendiente: '#ffc107', cancelada: '#dc3545', finalizada: '#6c757d' },
      dark: { confirmada: '#20c997', pendiente: '#ffca2c', cancelada: '#fd7e14', finalizada: '#adb5bd' }
    };
    return {
      style: {
        backgroundColor: colors[theme][status] || colors[theme]['finalizada'],
        borderRadius: '5px',
        opacity: 0.8,
        color: status === 'pendiente' ? 'black' : 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <section>
      <div className="form-check form-switch mb-3">
        <input 
          className="form-check-input" 
          type="checkbox" 
          role="switch" 
          id="showArchivedSwitch"
          checked={showArchived}
          onChange={() => setShowArchived(!showArchived)}
        />
        <label className="form-check-label" htmlFor="showArchivedSwitch">Mostrar canceladas y finalizadas</label>
      </div>
      <div style={{ height: '600px' }} className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
          eventPropGetter={eventStyleGetter}
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            noEventsInRange: "No hay reservas en este rango.",
          }}
        />
      </div>
    </section>
  );
}
