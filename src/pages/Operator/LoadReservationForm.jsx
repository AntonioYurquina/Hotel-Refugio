import React, { useState } from 'react';
import { validarReserva, esReservable } from '../../utils/reservas';
import { noches, sumarDias } from '../../utils/fechas';
import { aNumero, formatearPrecio, nombreCompleto } from '../../utils/formato';

export default function LoadReservationForm({ rooms, reservations, users, onSave, onCancel, initialData }) {
  const [form, setForm] = useState({
    id_usuario: '',
    id_habitacion: '',
    fecha_inicio: initialData?.fecha_inicio || '',
    fecha_fin: initialData?.fecha_fin || '',
    estado: 'confirmada',
  });
  const [enviando, setEnviando] = useState(false);
  const hayDirectorio = users.length > 0;
  const clientes = users.filter((u) => u.tipo_usuario === 'cliente');

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const datos = { ...form, id_usuario: Number(form.id_usuario), id_habitacion: Number(form.id_habitacion) };
  const completo = form.id_usuario && form.id_habitacion && form.fecha_inicio && form.fecha_fin;
  const problema = completo ? validarReserva(datos, reservations, rooms) : null;
  const habitacion = rooms.find((h) => h.id_habitacion === datos.id_habitacion);
  const cantidad = noches(form.fecha_inicio, form.fecha_fin);

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    await onSave(datos);
    setEnviando(false);
  };

  return (
    <form onSubmit={enviar}>
      <div className="row g-3">
        <div className="col-12">
          <label htmlFor="nueva-usuario" className="form-label">Cliente</label>
          {hayDirectorio ? (
            <select id="nueva-usuario" name="id_usuario" className="form-select" value={form.id_usuario} onChange={cambiar} required>
              <option value="">Seleccioná un cliente…</option>
              {clientes.map((u) => <option key={u.id_usuario} value={u.id_usuario}>{nombreCompleto(u)} (#{u.id_usuario})</option>)}
            </select>
          ) : (
            <>
              <input id="nueva-usuario" type="number" min="1" name="id_usuario" className="form-control" value={form.id_usuario} onChange={cambiar} placeholder="Ej: 6" required aria-describedby="ayuda-usuario" />
              <div id="ayuda-usuario" className="form-text">La API no tiene listado de usuarios: ingresá el ID del cliente.</div>
            </>
          )}
        </div>
        <div className="col-12">
          <label htmlFor="nueva-habitacion" className="form-label">Habitación</label>
          <select id="nueva-habitacion" name="id_habitacion" className="form-select" value={form.id_habitacion} onChange={cambiar} required>
            <option value="">Seleccioná una habitación…</option>
            {rooms.filter(esReservable).map((h) => <option key={h.id_habitacion} value={h.id_habitacion}>Hab. {h.numero} · {h.tipo} · {formatearPrecio(h.precio_noche)}/noche</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="nueva-inicio" className="form-label">Entrada</label>
          <input id="nueva-inicio" type="date" name="fecha_inicio" className="form-control" value={form.fecha_inicio} onChange={cambiar} required />
        </div>
        <div className="col-md-6">
          <label htmlFor="nueva-fin" className="form-label">Salida</label>
          <input id="nueva-fin" type="date" name="fecha_fin" className="form-control" min={form.fecha_inicio ? sumarDias(form.fecha_inicio, 1) : undefined} value={form.fecha_fin} onChange={cambiar} required />
        </div>
        <div className="col-12">
          <label htmlFor="nueva-estado" className="form-label">Estado inicial</label>
          <select id="nueva-estado" name="estado" className="form-select" value={form.estado} onChange={cambiar}>
            <option value="confirmada">Confirmada</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </div>
      </div>

      {problema && <div className="alert alert-warning mt-3 mb-0" role="alert">{problema}</div>}
      {!problema && habitacion && cantidad > 0 && (
        <div className="alert alert-light border mt-3 mb-0 text-center">{cantidad} {cantidad === 1 ? 'noche' : 'noches'} · {formatearPrecio(cantidad * aNumero(habitacion.precio_noche))}</div>
      )}

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={!completo || Boolean(problema) || enviando}>{enviando ? 'Guardando…' : 'Crear reserva'}</button>
      </div>
    </form>
  );
}
