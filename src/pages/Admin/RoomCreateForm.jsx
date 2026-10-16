import React, { useState } from 'react';
import { ESTADOS_HABITACION, TIPOS_HABITACION } from '../../utils/reservas';
import { capitalizar } from '../../utils/formato';

// El número de habitación es único en la API: un repetido produce un 500, así que se valida antes de enviar.
export default function RoomCreateForm({ existing, onSave, onCancel }) {
  const [form, setForm] = useState({ numero: '', tipo: 'doble', capacidad: 2, precio_noche: '', estado: 'disponible', descripcion: '' });
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const repetido = form.numero !== '' && existing.some((h) => h.numero === Number(form.numero));
  const invalido = !form.numero || repetido || !form.tipo.trim() || Number(form.capacidad) < 1 || !(Number(form.precio_noche) > 0);

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    await onSave(form);
    setEnviando(false);
  };

  return (
    <form onSubmit={enviar}>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="hab-numero" className="form-label">Número</label>
          <input id="hab-numero" type="number" min="1" name="numero" className={`form-control ${repetido ? 'is-invalid' : ''}`} value={form.numero} onChange={cambiar} required />
          {repetido && <div className="invalid-feedback">Ya existe una habitación con ese número.</div>}
        </div>
        <div className="col-md-6">
          <label htmlFor="hab-tipo" className="form-label">Tipo</label>
          <input id="hab-tipo" list="tipos-habitacion" name="tipo" maxLength={20} className="form-control" value={form.tipo} onChange={cambiar} required />
          <datalist id="tipos-habitacion">{TIPOS_HABITACION.map((t) => <option key={t} value={t} />)}</datalist>
        </div>
        <div className="col-md-4">
          <label htmlFor="hab-capacidad" className="form-label">Capacidad</label>
          <input id="hab-capacidad" type="number" min="1" name="capacidad" className="form-control" value={form.capacidad} onChange={cambiar} required />
        </div>
        <div className="col-md-4">
          <label htmlFor="hab-precio" className="form-label">Precio por noche ($)</label>
          <input id="hab-precio" type="number" min="1" step="0.01" name="precio_noche" className="form-control" value={form.precio_noche} onChange={cambiar} required />
        </div>
        <div className="col-md-4">
          <label htmlFor="hab-estado" className="form-label">Estado</label>
          <select id="hab-estado" name="estado" className="form-select" value={form.estado} onChange={cambiar}>
            {ESTADOS_HABITACION.map((e) => <option key={e} value={e}>{capitalizar(e)}</option>)}
          </select>
        </div>
        <div className="col-12">
          <label htmlFor="hab-descripcion" className="form-label">Descripción (opcional)</label>
          <textarea id="hab-descripcion" name="descripcion" className="form-control" rows="3" value={form.descripcion} onChange={cambiar}></textarea>
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={invalido || enviando}>{enviando ? 'Creando…' : 'Crear habitación'}</button>
      </div>
    </form>
  );
}
