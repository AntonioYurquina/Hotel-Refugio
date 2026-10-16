import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatearFecha, hoyApi, noches, sumarDias } from '../utils/fechas';
import { formatearPrecio } from '../utils/formato';
import { habitacionLibre } from '../utils/reservas';

// Solicitud de reserva de un cliente: se crea en la API con estado "pendiente" y un operador la confirma.
export default function ReservationForm({ room, user, reservas, initialData, crearReserva, onClose }) {
  const [form, setForm] = useState({
    checkin: initialData?.checkin || '',
    checkout: initialData?.checkout || '',
    guests: Math.min(initialData?.guests || 1, room.capacity),
  });
  const [enviando, setEnviando] = useState(false);
  const [creada, setCreada] = useState(null);
  const hoy = hoyApi();

  const cantidadNoches = noches(form.checkin, form.checkout);
  const importe = cantidadNoches * room.price;

  const problema = useMemo(() => {
    if (!form.checkin || !form.checkout) return null;
    if (form.checkin < hoy) return 'La entrada no puede ser anterior a hoy.';
    if (cantidadNoches < 1) return 'La salida debe ser posterior a la entrada.';
    if (!habitacionLibre(room.id, form.checkin, form.checkout, reservas)) return 'La habitación ya está reservada en esas fechas. Probá con otras.';
    return null;
  }, [form, hoy, cantidadNoches, room.id, reservas]);

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'guests' ? Number(value) : value }));
  };

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    const r = await crearReserva({
      id_usuario: user.datos.id_usuario,
      id_habitacion: room.id,
      fecha_inicio: form.checkin,
      fecha_fin: form.checkout,
      estado: 'pendiente',
    });
    setEnviando(false);
    if (r.ok) setCreada(r.datos);
  };

  if (creada) {
    return (
      <div className="text-center p-3" role="status">
        <i className="fa-solid fa-circle-check fa-3x text-success mb-3" aria-hidden="true"></i>
        <h3 className="h4">¡Reserva #{creada.id_reserva} registrada!</h3>
        <p className="mb-1">{room.name}</p>
        <p className="mb-1">Del <strong>{formatearFecha(creada.fecha_inicio)}</strong> al <strong>{formatearFecha(creada.fecha_fin)}</strong> · {formatearPrecio(importe)}</p>
        <p className="text-muted">Quedó <strong>pendiente</strong>: un operador la confirmará. Podés seguirla en <Link to="/dashboard" onClick={onClose}>Mi panel</Link>.</p>
        <button type="button" className="btn btn-primary" onClick={onClose}>Cerrar</button>
      </div>
    );
  }

  const invalido = !form.checkin || !form.checkout || Boolean(problema) || form.guests < 1 || form.guests > room.capacity;

  return (
    <form onSubmit={enviar} noValidate>
      <p className="text-muted small">Reservás como <strong>{user.datos.nombre} {user.datos.apellido}</strong> ({user.datos.email}).</p>
      <div className="row g-3">
        <div className="col-md-4">
          <label htmlFor="reserva-entrada" className="form-label">Entrada</label>
          <input id="reserva-entrada" name="checkin" type="date" className="form-control" min={hoy} value={form.checkin} onChange={cambiar} required />
        </div>
        <div className="col-md-4">
          <label htmlFor="reserva-salida" className="form-label">Salida</label>
          <input id="reserva-salida" name="checkout" type="date" className="form-control" min={form.checkin ? sumarDias(form.checkin, 1) : hoy} value={form.checkout} onChange={cambiar} required />
        </div>
        <div className="col-md-4">
          <label htmlFor="reserva-huespedes" className="form-label">Huéspedes</label>
          <input id="reserva-huespedes" name="guests" type="number" className="form-control" value={form.guests} min="1" max={room.capacity} onChange={cambiar} />
          {form.guests > room.capacity && <div className="invalid-feedback d-block">Capacidad máxima: {room.capacity}.</div>}
        </div>
      </div>

      {problema && <div className="alert alert-warning mt-3 mb-0" role="alert">{problema}</div>}
      {!problema && cantidadNoches > 0 && (
        <div className="alert alert-light border text-center mt-3 mb-0">
          {cantidadNoches} {cantidadNoches === 1 ? 'noche' : 'noches'} · Total estimado <strong className="text-brand-orange">{formatearPrecio(importe)}</strong>
        </div>
      )}

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={invalido || enviando}>
          {enviando ? 'Enviando…' : 'Solicitar reserva'}
        </button>
      </div>
    </form>
  );
}
