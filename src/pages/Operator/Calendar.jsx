import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'es': es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function OperatorCalendar({ reservations, rooms, onCreateReservation }) {
  const [showModal, setShowModal] = useState(false);
  const [slotInfo, setSlotInfo] = useState(null);
  const [formData, setFormData] = useState({ id_habitacion: '', id_usuario: '' });

  const events = useMemo(() => {
    if (!reservations) return [];
    return reservations.map(res => ({
      title: `Reserva #${res.id_reserva} - Hab: ${res.id_habitacion}`,
      start: new Date(res.fecha_entrada),
      end: new Date(res.fecha_salida),
      allDay: true,
      resourceId: res.id_habitacion,
    }));
  }, [reservations]);

  const handleSelectSlot = (slot) => {
    setSlotInfo(slot);
    setFormData({ id_habitacion: '', id_usuario: '', fecha_entrada: format(slot.start, 'yyyy-MM-dd'), fecha_salida: format(slot.end, 'yyyy-MM-dd') });
    setShowModal(true);
  };

  const handleCreate = () => {
    if (!formData.id_habitacion || !formData.id_usuario) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    onCreateReservation(formData);
    setShowModal(false);
  };

  return (
    <section>
      <h5>Calendario de Reservas</h5>
      <p className="text-muted">Haz clic y arrastra en el calendario para crear una nueva reserva.</p>
      <div style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
          }}
        />
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Nueva Reserva</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Desde:</strong> {formData.fecha_entrada} <strong>Hasta:</strong> {formData.fecha_salida}</p>
                <div className="mb-3">
                  <label className="form-label">Habitación</label>
                  <select className="form-select" value={formData.id_habitacion} onChange={e => setFormData({...formData, id_habitacion: e.target.value})}>
                    <option value="">Seleccione una habitación</option>
                    {rooms.datos.filter(r => r.estado === 'disponible').map(r => (
                      <option key={r.id_habitacion} value={r.id_habitacion}>Habitación {r.numero} ({r.tipo})</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">ID de Usuario Cliente</label>
                  <input type="number" className="form-control" value={formData.id_usuario} onChange={e => setFormData({...formData, id_usuario: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleCreate}>Crear Reserva</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
