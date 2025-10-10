import React, { useState } from 'react';

export default function ReservationForm({ room, onClose, addReservation }) {
  const [form, setForm] = useState({
    name: '', email: '', checkin: '', checkout: '', guests: 1
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nombre requerido';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Email inválido';
    if (!form.checkin) e.checkin = 'Fecha check-in requerida';
    if (!form.checkout) e.checkout = 'Fecha check-out requerida';
    if (form.checkin && form.checkout && new Date(form.checkin) >= new Date(form.checkout)) e.checkout = 'Check-out debe ser posterior a check-in';
    if (!form.guests || form.guests < 1) e.guests = 'Ingrese cantidad válida';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const reservation = {
      id: 'res_' + Date.now(),
      roomId: room.id,
      roomName: room.name,
      ...form,
      status: 'booked',
      paid: false,
      createdAt: new Date().toISOString()
    };
    // simular llamada a backend
    setTimeout(() => {
      addReservation(reservation);
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="text-center p-4">
        <i className="fa-solid fa-circle-check fa-3x text-success mb-3"></i>
        <h4>¡Reserva Confirmada!</h4>
        <p>Hemos enviado los detalles a <strong>{form.email}</strong>.</p>
        <button className="btn btn-primary" onClick={onClose}>Cerrar</button>
      </div>
    );
  }

  return (
    <form id="reserve" onSubmit={submit}>
      <div className="row g-2">
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input className="form-control" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">Check-in</label>
          <input type="date" className="form-control" value={form.checkin} onChange={e => setForm({...form, checkin: e.target.value})} />
          {errors.checkin && <div className="form-error">{errors.checkin}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">Check-out</label>
          <input type="date" className="form-control" value={form.checkout} onChange={e => setForm({...form, checkout: e.target.value})} />
          {errors.checkout && <div className="form-error">{errors.checkout}</div>}
        </div>
        <div className="col-md-4">
          <label className="form-label">Huéspedes</label>
          <input type="number" min="1" className="form-control" value={form.guests} onChange={e => setForm({...form, guests: Number(e.target.value)})} />
          {errors.guests && <div className="form-error">{errors.guests}</div>}
        </div>
        <div className="col-12 mt-3 d-flex justify-content-end">
          <button type="button" className="btn btn-secondary me-2" onClick={onClose}>Cancelar</button>
          <button type="submit" disabled={submitting} className="btn btn-primary">{submitting ? 'Reservando...' : 'Confirmar reserva'}</button>
        </div>
      </div>
    </form>
  );
}
