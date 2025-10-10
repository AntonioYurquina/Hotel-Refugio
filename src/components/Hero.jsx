import React from 'react';
import heroImage from './image.png'; // Importar la imagen de fondo

export default function Hero() {
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '60vh', // Aumentar la altura para más verticalidad
  };

  return (
    <header 
      className="hero-section text-center text-white d-flex align-items-center justify-content-center"
      style={heroStyle}
    >
      <div>
        <h1 className="display-3 fw-bold">Bienvenido a Hotel Refugio</h1>
        <p className="lead">Tu escape perfecto hacia la tranquilidad y el confort.</p>
      </div>
    </header>
  );
}
