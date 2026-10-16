import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { useToast } from '../../context/toastContext';

export default function SupportModal({ user, onCancel }) {
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

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
        addToast('Mensaje de soporte enviado con éxito.', 'success');
        onCancel();
      }, (error) => {
        addToast('Hubo un error al enviar el mensaje. Intentá de nuevo más tarde.', 'error');
        console.error(error);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="soporte-asunto" className="form-label">Asunto</label>
        <input id="soporte-asunto" type="text" name="subject" className="form-control" value={formData.subject} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label htmlFor="soporte-mensaje" className="form-label">Describí tu problema</label>
        <textarea id="soporte-mensaje" name="message" className="form-control" rows="5" value={formData.message} onChange={handleChange} required></textarea>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar a Soporte'}
        </button>
      </div>
    </form>
  );
}
