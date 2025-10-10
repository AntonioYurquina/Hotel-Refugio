import React from 'react';
import Hero from '../components/Hero';
import RoomList from '../components/RoomList';
import ContactSection from '../components/ContactSection';

export default function Home({ habitaciones, addReservation, user }) {
  // Adaptamos los datos de la API para que coincidan con la estructura que esperan los componentes
  const adaptedRooms = habitaciones ? habitaciones.map(h => ({
    id: h.id_habitacion,
    name: `Habitación ${h.numero} (${h.tipo})`,
    price: parseFloat(h.precio_noche),
    capacity: parseInt(h.capacidad, 10),
    description: h.descripcion,
    open: h.estado === 'disponible',
    amenities: ['WiFi', 'TV', 'Servicio a la habitación'], // Datos de ejemplo
    images: [ // Generamos las URLs de las imágenes
      `https://robledo.website/patas/${h.id_habitacion}a.jpg`,
      `https://robledo.website/patas/${h.id_habitacion}b.jpg`,
      `https://robledo.website/patas/${h.id_habitacion}c.jpg`,
    ]
  })) : [];

  const testimonials = [
    {
      quote: "Una estadía increíble. La atención al detalle y la amabilidad del personal hicieron que nuestro viaje fuera perfecto. ¡Volveremos!",
      author: "Ana y Juan"
    },
    {
      quote: "El mejor lugar para desconectar. Las vistas son espectaculares y las instalaciones de primer nivel. Lo recomiendo al 100%.",
      author: "Carlos Gómez"
    },
    {
      quote: "El desayuno buffet es simplemente espectacular. Variedad, calidad y un servicio impecable. Empezar el día así no tiene precio.",
      author: "Laura Fernández"
    }
  ];

  return (
    <>
      <Hero />
      <main className="container py-4">
        <section id="rooms-section" className="mb-5">
          <h2 className="h4 mb-4 text-center">Nuestras Habitaciones</h2>
          <RoomList rooms={adaptedRooms} addReservation={addReservation} user={user} />
        </section>

        <section id="services-section" className="mb-5">
          <h2 className="h4 mb-4 text-center">Nuestros Servicios</h2>
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="card h-100 p-3 shadow-sm">
                <i className="fa-solid fa-utensils fa-3x text-primary mb-3"></i>
                <h5>Restaurante Gourmet</h5>
                <p className="text-muted">Disfruta de una experiencia culinaria inolvidable con ingredientes locales frescos.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 p-3 shadow-sm">
                <i className="fa-solid fa-spa fa-3x text-primary mb-3"></i>
                <h5>Spa y Bienestar</h5>
                <p className="text-muted">Relájate y rejuvenece con nuestros tratamientos exclusivos y masajes terapéuticos.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 p-3 shadow-sm">
                <i className="fa-solid fa-person-swimming fa-3x text-primary mb-3"></i>
                <h5>Piscina Climatizada</h5>
                <p className="text-muted">Sumérgete en nuestra piscina con vistas panorámicas, disponible todo el año.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials-section" className="mb-5 bg-light p-5 rounded">
          <h2 className="h4 mb-4 text-center">Lo que dicen nuestros huéspedes</h2>
          <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner text-center" style={{ minHeight: '150px' }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <blockquote className="blockquote">
                    <p>"{testimonial.quote}"</p>
                    <footer className="blockquote-footer">{testimonial.author}</footer>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ContactSection />
      </main>
    </>
  );
}
