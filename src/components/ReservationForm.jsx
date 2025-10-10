import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

export default function ReservationForm({ room, onClose, addReservation, user }) {
  const [form, setForm] = useState({
    user_name: '',
    user_email: '',
    checkin: '',
    checkout: '',
    guests: 1,
    room_name: room.name,
    room_price: room.price,
    total_price: 0,
    num_nights: 0,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Autocompletar si el usuario está logueado
  useEffect(() => {
    if (user && user.ok) {
      setForm(prev => ({
        ...prev,
        user_name: `${user.datos.nombre} ${user.datos.apellido}`,
        user_email: user.datos.email,
      }));
    }
  }, [user]);

  // Calcular noches y total
  useEffect(() => {
    if (form.checkin && form.checkout) {
      const checkinDate = new Date(form.checkin);
      const checkoutDate = new Date(form.checkout);
      if (checkoutDate > checkinDate) {
        const diffTime = Math.abs(checkoutDate - checkinDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const total = diffDays * room.price;
        setForm(prev => ({ ...prev, num_nights: diffDays, total_price: total }));
      } else {
        setForm(prev => ({ ...prev, num_nights: 0, total_price: 0 }));
      }
    }
  }, [form.checkin, form.checkout, room.price]);

  // Validaciones
  const validate = () => {
    const e = {};
    if (!form.user_name.trim()) e.name = 'Nombre requerido';
    if (!/^\S+@\S+\.\S+$/.test(form.user_email)) e.email = 'Email inválido';
    if (!form.checkin) e.checkin = 'Fecha check-in requerida';
    if (form.num_nights <= 0) e.checkout = 'Check-out debe ser posterior a check-in';
    if (form.guests < 1 || form.guests > room.capacity) e.guests = `Debe ser entre 1 y ${room.capacity}`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Envío del formulario por EmailJS
  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Mapeo de variables EXACTAS para EmailJS
    const templateParams = {
      to_name: "Hotel Refugio",
      from_name: form.user_name,
      reply_to: form.user_email,
      room_name: form.room_name,
      checkin: form.checkin,
      checkout: form.checkout,
      guests: form.guests,
      num_nights: form.num_nights,
      total_price: form.total_price.toFixed(2),
      message: `
        Nueva solicitud de reserva de:
        Nombre: ${form.user_name}
        Email: ${form.user_email}
        Huéspedes: ${form.guests}

        Detalles de la reserva:
        - Habitación: ${form.room_name}
        - Noches: ${form.num_nights} (Desde ${form.checkin} hasta ${form.checkout})
        - Total: $${form.total_price.toFixed(2)}
      `,
    };

    emailjs
      .send(
        "service_r4nbki4",     // ⚙️ ID del servicio (ajústalo si cambió)
        "template_0q6td97",    // ⚙️ ID de la plantilla
        templateParams,
        "cy-3jjDdw9Sr3ZLyU"    // ⚙️ Public Key (User ID)
      )
      .then(() => {
        setSubmitted(true);
        addReservation({
          id_habitacion: room.id,
          fecha_entrada: form.checkin,
          fecha_salida: form.checkout,
        });
      })
      .catch((error) => {
        console.error("Error al enviar el correo:", error.text);
        alert("Hubo un error al enviar la solicitud. Por favor, intente más tarde.");
      })
      .finally(() => setSubmitting(false));
  };

  // Pantalla de confirmación
  if (submitted) {
    return (
      <div className="text-center p-4">
        <i className="fa-solid fa-circle-check fa-3x text-success mb-3"></i>
        <h4>¡Solicitud Enviada!</h4>
        <p>
          Hemos recibido tu solicitud de reserva. Recibirás una confirmación por correo a{" "}
          <strong>{form.user_email}</strong> en breve.
        </p>
        <button className="btn btn-primary" onClick={onClose}>Cerrar</button>
      </div>
    );
  }

  // Formulario
  return (
    <form id="reserve" onSubmit={submit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre Completo</label>
          <input
            name="user_name"
            className="form-control"
            value={form.user_name}
            onChange={e => setForm({ ...form, user_name: e.target.value })}
          />
          {errors.name && <div className="text-danger small">{errors.name}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            name="user_email"
            type="email"
            className="form-control"
            value={form.user_email}
            onChange={e => setForm({ ...form, user_email: e.target.value })}
          />
          {errors.email && <div className="text-danger small">{errors.email}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Check-in</label>
          <input
            name="checkin"
            type="date"
            className="form-control"
            value={form.checkin}
            onChange={e => setForm({ ...form, checkin: e.target.value })}
          />
          {errors.checkin && <div className="text-danger small">{errors.checkin}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Check-out</label>
          <input
            name="checkout"
            type="date"
            className="form-control"
            value={form.checkout}
            onChange={e => setForm({ ...form, checkout: e.target.value })}
          />
          {errors.checkout && <div className="text-danger small">{errors.checkout}</div>}
        </div>

        <div className="col-md-4">
          <label className="form-label">Huéspedes</label>
          <input
            name="guests"
            type="number"
            className="form-control"
            value={form.guests}
            min="1"
            max={room.capacity}
            onChange={e => setForm({ ...form, guests: parseInt(e.target.value, 10) })}
          />
          {errors.guests && <div className="text-danger small">{errors.guests}</div>}
        </div>

        <div className="col-12">
          {form.num_nights > 0 && (
            <div className="alert alert-info text-center">
              Estadía de <strong>{form.num_nights} noches</strong>. Precio Total:{" "}
              <strong>${form.total_price.toFixed(2)}</strong>
            </div>
          )}
        </div>

        <div className="col-12 mt-3 d-flex justify-content-end">
          <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || form.num_nights <= 0}
            className="btn btn-primary"
          >
            {submitting ? 'Enviando Solicitud...' : 'Confirmar Solicitud'}
          </button>
        </div>
      </div>
    </form>
  );
}
