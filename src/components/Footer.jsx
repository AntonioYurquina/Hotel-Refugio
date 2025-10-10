import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <div className="container text-center">
        <p className="mb-1">&copy; {new Date().getFullYear()} Hotel Refugio. Todos los derechos reservados.</p>
        <p className="small">
          <a href="#" className="text-white me-2">Política de Privacidad</a>|
          <a href="#" className="text-white mx-2">Términos de Servicio</a>|
          <a href="mailto:contacto@hotelrefugio.example" className="text-white ms-2">Contacto</a>
        </p>
      </div>
    </footer>
  );
}
