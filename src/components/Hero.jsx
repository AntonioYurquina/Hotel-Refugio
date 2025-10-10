import React from 'react';

export default function Hero() {
  return (
    <section className="hero mb-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-7 text-light">
            <h1 className="display-6">Hotel Refugio — Confort y excelencia</h1>
            <p className="lead">Reserva la habitación perfecta para tu próxima estadía. Experiencia cuidada y servicio 24/7.</p>
            <a href="#rooms" className="btn btn-outline-light me-2">Ver habitaciones</a>
            <a href="#reserve" className="btn btn-light">Reservar ahora</a>
          </div>
          <div className="col-md-5 d-none d-md-block text-end">
            {/* imagen en background via CSS */}
          </div>
        </div>
      </div>
    </section>
  );
}
