import React from 'react';
import Hero from '../components/Hero';
import RoomList from '../components/RoomList';

export default function Home({ rooms, addReservation }) {
  return (
    <>
      <Hero />
      <main className="container py-4">
        <section id="rooms-section" className="mb-4">
          <h2 className="h4 mb-4 text-center">Nuestras Habitaciones</h2>
          <RoomList rooms={rooms} addReservation={addReservation} />
        </section>

        <section className="text-center mt-5 p-4 bg-light rounded">
          <h3 className="h5">¿Preguntas?</h3>
          <p>Nuestro equipo está disponible para ayudarte. Contáctanos por correo para cualquier consulta.</p>
          <a href="mailto:contacto@hotelrefugio.example" className="btn btn-outline-primary">
            <i className="fa-solid fa-envelope me-2"></i> Enviar un email
          </a>
        </section>
      </main>
    </>
  );
}
