import React from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Ana y Juan Pérez',
    quote: 'Una experiencia inolvidable. La tranquilidad del lugar y la atención del personal superaron todas nuestras expectativas. ¡Volveremos sin dudarlo!',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Carlos Gómez',
    quote: 'El lugar perfecto para desconectar del estrés de la ciudad. Las vistas desde la habitación eran espectaculares y el spa es de primer nivel.',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 3,
    name: 'Sofía Martínez',
    quote: 'Vine por un viaje de negocios y terminé sintiéndome de vacaciones. La conexión Wi-Fi es excelente y el ambiente es ideal para concentrarse y relajarse.',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
];

const TestimonialCard = ({ quote, name, avatar }) => (
  <div className="col-md-4">
    <div className="card h-100 text-center shadow-sm">
      <div className="card-body">
        <img src={avatar} alt={name} className="rounded-circle mb-3" width="80" height="80" />
        <p className="card-text fst-italic">"{quote}"</p>
      </div>
      <div className="card-footer">
        <small className="text-muted fw-bold">{name}</small>
      </div>
    </div>
  </div>
);

export default function Testimonials() {
  return (
    <section className="py-5 bg-body-tertiary">
      <div className="container">
        <h2 className="text-center mb-4">Lo que dicen nuestros huéspedes</h2>
        <div className="row g-4">
          {testimonials.map(t => <TestimonialCard key={t.id} {...t} />)}
        </div>
      </div>
    </section>
  );
}
