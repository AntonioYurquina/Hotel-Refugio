import React, { useMemo, useState } from 'react';
import { ESTADOS_RESERVA, validarReserva } from '../../utils/reservas';
import { aFechaApi, sumarDias } from '../../utils/fechas';
import { capitalizar } from '../../utils/formato';

export default function EditReservationForm({ reservation, rooms, reservations, onSave, onCancel }) {
  const [form, setForm] = useState({
    ...reservation,
    fecha_inicio: aFechaApi(reservation.fecha_inicio),
    fecha_fin: aFechaApi(reservation.fecha_fin),
  });
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'id_habitacion' ? Number(value) : value });
  };

  const problema = useMemo(
    () => validarReserva(form, reservations, rooms, { idExcluido: reservation.id_reserva }),
    [form, reservations, rooms, reservation.id_reserva],
  );

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    await onSave(form);
    setEnviando(false);
  };

  return (
    <form onSubmit={enviar}>
      <div className="row g-3">
        <div className="col-12">
          <label htmlFor="editar-habitacion" className="form-label">Habitación</label>
          <select id="editar-habitacion" name="id_habitacion" className="form-select" value={form.id_habitacion} onChange={cambiar}>
            {rooms.map((h) => <option key={h.id_habitacion} value={h.id_habitacion}>Hab. {h.numero} · {capitalizar(h.tipo)}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="editar-inicio" className="form-label">Entrada</label>
          <input id="editar-inicio" type="date" name="fecha_inicio" className="form-control" value={form.fecha_inicio} onChange={cambiar} required />
        </div>
        <div className="col-md-6">
          <label htmlFor="editar-fin" className="form-label">Salida</label>
          <input id="editar-fin" type="date" name="fecha_fin" className="form-control" min={form.fecha_inicio ? sumarDias(form.fecha_inicio, 1) : undefined} value={form.fecha_fin} onChange={cambiar} required />
        </div>
        <div className="col-12">
          <label htmlFor="editar-estado" className="form-label">Estado</label>
          <select id="editar-estado" name="estado" className="form-select" value={form.estado} onChange={cambiar}>
            {ESTADOS_RESERVA.map((e) => <option key={e} value={e}>{capitalizar(e)}</option>)}
          </select>
        </div>
      </div>
      {problema && <div className="alert alert-warning mt-3 mb-0" role="alert">{problema}</div>}
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={Boolean(problema) || enviando}>{enviando ? 'Guardando…' : 'Guardar cambios'}</button>
      </div>
    </form>
  );
}
