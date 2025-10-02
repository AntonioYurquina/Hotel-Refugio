// src/pages/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div>
      {/* HERO */}
      <header className="bg-dark text-white text-center py-5" style={{ backgroundImage: "url('/hero-hotel.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container bg-dark bg-opacity-50 p-5 rounded">
          <h1 className="display-4">Bienvenido a Hotel Refugio</h1>
          <p className="lead">Tu lugar ideal para descansar, disfrutar y crear recuerdos inolvidables.</p>
          <Link to="/servicios" className="btn btn-primary btn-lg mt-3">Ver Servicios</Link>
        </div>
      </header>

      {/* SECCIÓN DE NOSOTROS */}
      <section className="container my-5">
        <h2 className="text-center mb-4">¿Quiénes Somos?</h2>
        <p className="text-center">
          En Hotel Refugio nos dedicamos a ofrecer experiencias únicas, combinando confort, atención personalizada y un ambiente acogedor. Nuestro objetivo es que cada huésped se sienta como en casa mientras disfruta de nuestras instalaciones de primera calidad.
        </p>
      </section>

      {/* SECCIÓN DE SERVICIOS */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Nuestros Servicios</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <img src="/servicio1.jpg" className="card-img-top" alt="Servicio 1"/>
                <div className="card-body">
                  <h5 className="card-title">Habitaciones Confortables</h5>
                  <p className="card-text">Disfruta de habitaciones espaciosas, modernas y completamente equipadas para tu comodidad.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <img src="/servicio2.jpg" className="card-img-top" alt="Servicio 2"/>
                <div className="card-body">
                  <h5 className="card-title">Gastronomía Gourmet</h5>
                  <p className="card-text">Saborea platos exquisitos preparados por nuestro equipo de chefs con ingredientes locales de alta calidad.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <img src="/servicio3.jpg" className="card-img-top" alt="Servicio 3"/>
                <div className="card-body">
                  <h5 className="card-title">Spa & Relax</h5>
                  <p className="card-text">Relájate en nuestro spa y disfruta de masajes, sauna y otras terapias diseñadas para tu bienestar.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE CONTACTO */}
      <section className="container my-5">
        <h2 className="text-center mb-4">Contacto</h2>
        <p className="text-center">
          Para reservas o consultas, comunicate con nosotros: <br/>
          <strong>Tel:</strong> +54 387 123-4567 | <strong>Email:</strong> info@hotelrefugio.com
        </p>
      </section>

      <footer className="bg-dark text-white text-center py-3">
        &copy; {new Date().getFullYear()} Hotel Refugio. Todos los derechos reservados.
      </footer>
    </div>
  );
}

