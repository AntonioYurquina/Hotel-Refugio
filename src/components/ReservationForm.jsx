import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

export default function ReservationForm({ room, onClose, user, initialData, registrarUsuario }) {
  const [form, setForm] = useState({
    user_name: '',
    user_email: '',
    password: '',
    confirmPassword: '',
    createAccount: false,
    checkin: initialData?.checkin || '',
    checkout: initialData?.checkout || '',
    guests: initialData?.guests || 1,
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
    
    if (form.createAccount) {
      if (form.password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres.';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Envío del formulario por EmailJS
  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Si el usuario quiere crear una cuenta, lo registramos primero.
    if (form.createAccount && !user.ok) {
      const nameParts = form.user_name.split(' ');
      const userData = {
        nombre: nameParts[0],
        apellido: nameParts.slice(1).join(' '),
        email: form.user_email,
        contraseña: form.password,
        telefono: '', // El teléfono no se pide en este formulario
      };
      await registrarUsuario(userData);
    }

    // Mapeo de variables EXACTAS para EmailJS
    const templateParams = {
      to_name: "Operador Hotel Refugio",
      from_name: form.user_name,
      reply_to: form.user_email,
      // Se consolida toda la información en el campo 'message' para máxima claridad.
      message: `
        ========================================
        NUEVA SOLICITUD DE RESERVA
        ========================================

        DATOS DEL CLIENTE:
        ----------------------------------------
        - ID de Usuario: ${user.datos.id_usuario}
        - Nombre: ${form.user_name}
        - Email: ${form.user_email}
        - Teléfono: ${user.datos.telefono || 'No especificado'}

        DETALLES DE LA SOLICITUD:
        ----------------------------------------
        - Habitación Solicitada: ${room.name} (ID: ${room.id})
        - Check-in: ${form.checkin}
        - Check-out: ${form.checkout}
        - Noches: ${form.num_nights}
        - Huéspedes: ${form.guests}

        CÁLCULO DE PRECIO:
        ----------------------------------------
        - Precio por Noche: $${room.price.toFixed(2)}
        - TOTAL ESTIMADO: $${form.total_price.toFixed(2)}

        ========================================
        Por favor, contactar al cliente para confirmar la reserva y procesar el pago.
      `,
    };

    emailjs
      .send(
        "service_r4nbki4",
        "template_0q6td97",
        templateParams,
        "cy-3jjDdw9Sr3ZLyU"
      )
      .then(() => {
        setSubmitted(true);
        // Se elimina la llamada a addReservation, ya que el cliente solo envía una solicitud.
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
        <i className="fa-solid fa-circle-check fa-3x text-primary mb-3"></i>
        <h4>¡Solicitud Enviada!</h4>
        <p>
          Hemos recibido tu solicitud. Un operador se pondrá en contacto contigo a{" "}
          <strong>{form.user_email}</strong> para confirmar la disponibilidad y el pago.
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
            disabled={user.ok}
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
            disabled={user.ok}
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

        {/* Sección de Registro para usuarios no logueados */}
        {!user.ok && (
          <div className="col-12 mt-4 pt-3 border-top">
            <div className="form-check mb-3">
              <input 
                type="checkbox" 
                className="form-check-input" 
                id="createAccountCheck"
                checked={form.createAccount}
                onChange={e => setForm({...form, createAccount: e.target.checked})}
              />
              <label className="form-check-label" htmlFor="createAccountCheck">
                Crear una cuenta para futuras reservas
              </label>
            </div>
            {form.createAccount && (
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                  />
                  {errors.password && <div className="text-danger small">{errors.password}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Confirmar Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={form.confirmPassword}
                    onChange={e => setForm({...form, confirmPassword: e.target.value})}
                  />
                  {errors.confirmPassword && <div className="text-danger small">{errors.confirmPassword}</div>}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="col-12">
          {form.num_nights > 0 && (
            <div className="alert alert-light text-center">
              Estadía de <strong>{form.num_nights} noches</strong>. Precio Total:{" "}
              <strong className="text-brand-orange">${form.total_price.toFixed(2)}</strong>
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
            {submitting ? 'Enviando Solicitud...' : 'Enviar Solicitud de Reserva'}
          </button>
        </div>
      </div>
    </form>
  );
}
