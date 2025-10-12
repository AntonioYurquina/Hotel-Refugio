import React from 'react';
import Hero from '../components/Hero';
import RoomCarousel from '../components/RoomCarousel'; // Importar el nuevo carrusel
import LocationMap from '../components/LocationMap';
import Testimonials from '../components/Testimonials';

export default function Home({ habitaciones, user }) {
  const adaptedRooms = habitaciones ? habitaciones.map(h => ({
    id: h.id_habitacion,
    name: `Habitación ${h.numero} (${h.tipo})`,
    price: parseFloat(h.precio_noche),
    capacity: parseInt(h.capacidad, 10),
    description: h.descripcion,
    images: [
      `https://robledo.website/patas/${h.id_habitacion}a.jpg`,
      `https://robledo.website/patas/${h.id_habitacion}b.jpg`,
      `https://robledo.website/patas/${h.id_habitacion}c.jpg`,
    ]
  })) : [];

  return (
    <>
      <Hero />
      <div className="container py-5">
        {/* Sección de Habitaciones con Carrusel */}
        <section className="mb-5">
          <h2 className="text-center mb-4">Nuestras Habitaciones</h2>
          <RoomCarousel rooms={adaptedRooms} />
        </section>

        {/* Sección de Servicios */}
        <section className="mb-5 pt-4 border-top">
          <h2 className="text-center mb-4">Nuestros Servicios</h2>
          <div className="row text-center">
            <div className="col-md-4"><i className="fa-solid fa-wifi fa-2x mb-2 text-primary"></i><p>Wi-Fi de Alta Velocidad</p></div>
            <div className="col-md-4"><i className="fa-solid fa-utensils fa-2x mb-2 text-primary"></i><p>Restaurante y Bar</p></div>
            <div className="col-md-4"><i className="fa-solid fa-person-swimming fa-2x mb-2 text-primary"></i><p>Piscina y Spa</p></div>
          </div>
          <p className="text-center text-muted mt-3 small">
            *Para solicitar servicios adicionales como spa, excursiones o eventos especiales, por favor, póngase en contacto con nuestra recepción. Estaremos encantados de asistirle.
          </p>
        </section>
      </div>

      {/* Nueva Sección de Testimonios */}
      <Testimonials />

      <div className="container py-5">
        {/* Nueva Sección de Ubicación */}
        <section className="pt-4">
          <h2 className="text-center mb-5">Encuéntranos</h2>
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <LocationMap />
            </div>
            <div className="col-lg-6">
              <h4>Un Refugio en el Corazón de la Naturaleza</h4>
              <p className="text-muted">
                Ubicado estratégicamente en un enclave privilegiado, Hotel Refugio ofrece un escape del bullicio de la ciudad sin sacrificar la comodidad y el acceso. Rodeado de paisajes imponentes y aire puro, nuestro hotel es el punto de partida perfecto para explorar las maravillas naturales de la región o simplemente para encontrar un momento de paz.
              </p>
              <p className="text-muted">
                A solo minutos de rutas de senderismo y miradores panorámicos, pero con fácil acceso desde la carretera principal, combinamos la serenidad de la naturaleza con la conveniencia que necesitas para una estadía perfecta.
              </p>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=-24.7909949,-65.4123956"
                className="btn btn-outline-primary mt-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-solid fa-map-location-dot me-2"></i>
                Cómo llegar
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
