// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="text-white text-center py-4" style={{ backgroundColor: "#222" }}>
      <div className="container">
        <p className="mb-2">&copy; 2025 Hotel Refugio. Todos los derechos reservados.</p>
        <p className="mb-0">
          Síguenos en: 
          <a href="#" className="text-white mx-2">Facebook</a> | 
          <a href="#" className="text-white mx-2">Instagram</a> | 
          <a href="#" className="text-white mx-2">Twitter</a>
        </p>
      </div>
    </footer>
  );
}
