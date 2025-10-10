import React from 'react';
import Hero from '../components/Hero';
import RoomList from '../components/RoomList';
import ContactSection from '../components/ContactSection';

export default function Home({ habitaciones }) {
  // Adaptamos los datos de la API al formato que espera RoomCard
  const adaptedRooms = habitaciones.map(h => ({
    id: h.id_habitacion,
    name: `Habitación ${h.numero} (${h.tipo})`,
    price: parseFloat(h.precio_noche),
    capacity: parseInt(h.capacidad, 10),
    description: h.descripcion,
    open: h.estado === 'disponible',
    imgQuery: `${h.tipo},hotel-room`,
  }));

  return (
    <>
      <Hero />
      <main className="container py-4">
        <section id="rooms-section" className="mb-4">
          <h2 className="h4 mb-4 text-center">Nuestras Habitaciones</h2>
          <RoomList rooms={adaptedRooms} addReservation={() => {}} />
        </section>
        <ContactSection />
      </main>
    </>
  );
}
