import React, { useState } from 'react';
import emailjs from 'emailjs-com';

export default function SupportModal({ user, onCancel }) {
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const templateParams = {
      to_name: "Soporte Técnico",
      from_name: `${user.datos.nombre} (Operador)`,
      reply_to: user.datos.email,
      message: `
        ASUNTO: ${formData.subject}
        --------------------------------
        MENSAJE:
        ${formData.message}
        --------------------------------
        Enviado por: ${user.datos.nombre} ${user.datos.apellido}
        ID de Usuario: ${user.datos.id_usuario}
      `,
    };

    emailjs.send("service_r4nbki4", "template_0q6td97", templateParams, "cy-3jjDdw9Sr3ZLyU")
      .then(() => {
        alert('Mensaje de soporte enviado con éxito.');
        onCancel();
      }, (error) => {
        alert('Hubo un error al enviar el mensaje.');
        console.error(error);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Asunto</label>
        <input type="text" name="subject" className="form-control" value={formData.subject} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Describe tu problema</label>
        <textarea name="message" className="form-control" rows="5" value={formData.message} onChange={handleChange} required></textarea>
      </div>
      <div className="modal-footer mt-4 px-0">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar a Soporte'}
        </button>
      </div>
    </form>
  );
}
