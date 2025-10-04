// src/components/ContactanosSection.jsx

/**
 * Componente: ContactanosSection
 * 
 * Props requeridas por el componente padre:
 * - onClick: función que se ejecuta al hacer clic en el botón "Ir a Contacto".
 * 
 * Uso:
 * <ContactanosSection onClick={handleIrAContacto} />
 */

import React from "react";

export default function ContactanosSection({ onClick }) {
  return (
    <section className="py-5" style={{ backgroundColor: "#ffffff" }}>
      <div className="container">
        <h2 className="text-center mb-4" style={{ color: "#37474f" }}>
          Contáctanos
        </h2>
        <p className="text-center text-muted mb-5">
          Si tenés dudas o querés hacer una reserva directa, hacé clic en el botón
          para ir a nuestro formulario de contacto.
        </p>
        <div className="text-center">
          <button
            className="btn btn-lg"
            style={{ backgroundColor: "#ff7f32", border: "none" }}
            onClick={onClick}
          >
            Ir a Contacto
          </button>
        </div>
      </div>
    </section>
  );
}
