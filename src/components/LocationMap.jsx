import React from 'react';

export default function LocationMap() {
  // Ubicación céntrica en Salta, Argentina. El mapa está centrado aquí.
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.132832599527!2d-65.4123956854154!3d-24.79099498408609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941bc3a3d4a05869%3A0x462c6b975458a255!2sPlaza%209%20de%20Julio!5e0!3m2!1ses!2sar!4v1678886400000";

  return (
    <div className="map-container">
      <iframe
        src={mapSrc}
        className="map-iframe"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ubicación del Hotel Refugio"
      ></iframe>
    </div>
  );
}
