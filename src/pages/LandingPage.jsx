// src/pages/LandingPage.jsx

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Estilos de Bootstrap
import Hero from "../components/Hero";
import SearchForm from "../components/SearchForm";
import ContactanosSection from "../components/ContactanosSection";
import Footer from "../components/Footer";

/**
 * Componente: LandingPage
 * 
 * Versión estética:
 * - Muestra todos los componentes visualmente.
 * - No hay funcionalidad real.
 * - Todos los botones y formularios solo usan funciones dummy para que no rompa.
 */
export default function LandingPage() {
  // Función dummy que no hace nada
  const dummyFunction = () => {};

  return (
    <div>
      {/* Hero: encabezado con imagen de fondo */}
      <Hero onReservarClick={dummyFunction} />

      {/* Formulario de búsqueda (solo estética) */}
      <SearchForm
        checkIn={null}
        checkOut={null}
        personas={1}
        onCheckInChange={dummyFunction}
        onCheckOutChange={dummyFunction}
        onPersonasChange={dummyFunction}
        onSearchClick={dummyFunction}
      />

      {/* Sección de contacto (solo estética) */}
      <ContactanosSection onClick={dummyFunction} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
