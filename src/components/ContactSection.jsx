import React, { useRef, useState } from 'react';
import emailjs from 'emailjs-com';

export default function ContactSection() {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.sendForm(
      "service_r4nbki4",     // Reemplaza con tu Service ID de EmailJS
      "template_0q6td97",    // Reemplaza con tu Template ID de EmailJS para contacto
      form.current,
      "cy-3jjDdw9Sr3ZLyU"    // Reemplaza con tu Public Key (User ID)
    )
    .then(() => {
      setIsSubmitted(true);
      form.current.reset();
    }, (error) => {
      console.error("Error al enviar el correo:", error.text);
      alert("Hubo un error al enviar el mensaje. Por favor, intente más tarde.");
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <section id="contact-section" className="py-5 bg-body-secondary rounded">
      <div className="container">
        <div className="row">
          <div className="col-lg-5 text-center text-lg-start mb-4 mb-lg-0">
            <h2 className="h3">¿Preguntas?</h2>
            <p className="lead text-muted">
              Nuestro equipo está disponible para ayudarte. Contáctanos por correo para cualquier consulta.
            </p>
          </div>
          <div className="col-lg-7">
            {isSubmitted ? (
              <div className="alert alert-success text-center">
                ¡Mensaje enviado! Gracias por contactarnos.
              </div>
            ) : (
              <form ref={form} onSubmit={sendEmail}>
                <div className="mb-3">
                  <label htmlFor="from_name" className="form-label">Tu Nombre</label>
                  <input type="text" name="from_name" id="from_name" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="reply_to" className="form-label">Tu Email</label>
                  <input type="email" name="reply_to" id="reply_to" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Mensaje</label>
                  <textarea name="message" id="message" className="form-control" rows="4" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
