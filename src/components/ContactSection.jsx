import React from 'react';

export default function ContactSection() {
  return (
    <section className="text-center mt-5 p-4 bg-light rounded">
      <h3 className="h5">¿Preguntas?</h3>
      <p>Nuestro equipo está disponible para ayudarte. Contáctanos por correo para cualquier consulta.</p>
      <a href="mailto:contacto@hotelrefugio.example" className="btn btn-outline-primary">
        <i className="fa-solid fa-envelope me-2"></i> Enviar un email
      </a>
    </section>
  );
}
