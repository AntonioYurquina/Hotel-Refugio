<<<<<<< HEAD
// src/pages/LandingPage.jsx
=======
import React, { useState } from "react";
import SaltaImg from "../assets/salta.jpg"; 
import { Carousel, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { ModalReserva } from "../components/ModalReserva.jsx"; // Import nombrado
>>>>>>> adc7774 (fin del frontend)

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
<<<<<<< HEAD
  // Función dummy que no hace nada
  const dummyFunction = () => {};

  return (
    <div>
      {/* Hero: encabezado con imagen de fondo */}
      <Hero onReservarClick={dummyFunction} />
=======
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [personas, setPersonas] = useState(1);
  const [habitacionesFiltradas, setHabitacionesFiltradas] = useState([]);

  // Funciones auxiliares
  const calcularNoches = (inicio, fin) => {
    if (!inicio || !fin) return 0;
    const diff = fin.getTime() - inicio.getTime();
    const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return dias > 0 ? dias : 0;
  };

  const validarFechas = (inicio, fin) => {
    if (!inicio || !fin) return false;
    return fin > inicio;
  };

  const imagenesGenericas = [
  "https://robledo.website/patas/1.jpg",
  "https://robledo.website/patas/2.jpg",
  "https://robledo.website/patas/3.jpg",
  "https://robledo.website/patas/4.jpg",
  "https://robledo.website/patas/5.jpg",
];

 // Diccionarios de habitaciones y reservas
  const habitaciones = [
    {id:1,numero:101,tipo:"Single",capacidad:1,precio_noche:45.0,estado:"disponible",descripcion:"Habitación sencilla con cama individual y escritorio.",imagenes:imagenesGenericas},
    {id:2,numero:102,tipo:"Doble",capacidad:2,precio_noche:75.0,estado:"disponible",descripcion:"Perfecta para parejas, equipada con cama matrimonial y balcón.",imagenes:imagenesGenericas},
    {id:3,numero:103,tipo:"Doble Twin",capacidad:2,precio_noche:70.0,estado:"ocupada",descripcion:"Cuenta con dos camas individuales, ideal para amigos o compañeros.",imagenes:imagenesGenericas},
    {id:4,numero:104,tipo:"Suite Junior",capacidad:2,precio_noche:120.0,estado:"disponible",descripcion:"Suite con sala pequeña y cama king size.",imagenes:imagenesGenericas},
    {id:5,numero:105,tipo:"Familiar",capacidad:4,precio_noche:150.0,estado:"disponible",descripcion:"Habitación amplia con dos camas matrimoniales.",imagenes:imagenesGenericas},
    {id:6,numero:106,tipo:"Single",capacidad:1,precio_noche:40.0,estado:"mantenimiento",descripcion:"Compacta y económica, con todo lo necesario para descansar.",imagenes:imagenesGenericas},
    {id:7,numero:107,tipo:"Doble Deluxe",capacidad:2,precio_noche:95.0,estado:"disponible",descripcion:"Habitación de lujo para dos personas, con jacuzzi privado.",imagenes:imagenesGenericas},
    {id:8,numero:108,tipo:"Suite Presidencial",capacidad:3,precio_noche:250.0,estado:"ocupada",descripcion:"La mejor suite del hotel, con sala, comedor y terraza privada.",imagenes:imagenesGenericas},
    {id:9,numero:109,tipo:"Triple",capacidad:3,precio_noche:110.0,estado:"disponible",descripcion:"Ideal para grupos pequeños, con tres camas individuales.",imagenes:imagenesGenericas},
    {id:10,numero:110,tipo:"Single",capacidad:1,precio_noche:42.0,estado:"cerrada",descripcion:"Habitación individual fuera de servicio temporalmente.",imagenes:imagenesGenericas},
    {id:11,numero:201,tipo:"Suite Familiar",capacidad:5,precio_noche:180.0,estado:"disponible",descripcion:"Gran suite para familias, equipada con sala de estar.",imagenes:imagenesGenericas},
    {id:12,numero:202,tipo:"Doble",capacidad:2,precio_noche:78.0,estado:"ocupada",descripcion:"Cómoda habitación doble con diseño moderno.",imagenes:imagenesGenericas},
    {id:13,numero:203,tipo:"Doble Twin",capacidad:2,precio_noche:72.0,estado:"disponible",descripcion:"Dos camas individuales, vista al jardín.",imagenes:imagenesGenericas},
    {id:14,numero:204,tipo:"Suite Ejecutiva",capacidad:2,precio_noche:135.0,estado:"disponible",descripcion:"Perfecta para viajes de negocios, con escritorio amplio y wifi.",imagenes:imagenesGenericas},
    {id:15,numero:205,tipo:"Familiar Deluxe",capacidad:6,precio_noche:200.0,estado:"disponible",descripcion:"La más amplia de todas, con tres dormitorios y cocina equipada.",imagenes:imagenesGenericas}
  ];

  // Diccionario de reservas simuladas
  // Diccionario de reservas simuladas
  const reservas = [
    {id_reserva:1,id_habitacion:101,fecha_inicio:"2025-10-05",fecha_fin:"2025-10-08",estado:"confirmada"},
    {id_reserva:2,id_habitacion:102,fecha_inicio:"2025-10-03",fecha_fin:"2025-10-07",estado:"pendiente"},
    {id_reserva:3,id_habitacion:103,fecha_inicio:"2025-10-01",fecha_fin:"2025-10-04",estado:"finalizada"},
    {id_reserva:4,id_habitacion:104,fecha_inicio:"2025-10-10",fecha_fin:"2025-10-12",estado:"confirmada"},
    {id_reserva:5,id_habitacion:105,fecha_inicio:"2025-10-15",fecha_fin:"2025-10-18",estado:"pendiente"},
    {id_reserva:6,id_habitacion:106,fecha_inicio:"2025-10-01",fecha_fin:"2025-10-03",estado:"cancelada"},
    {id_reserva:7,id_habitacion:107,fecha_inicio:"2025-10-08",fecha_fin:"2025-10-11",estado:"confirmada"},
    {id_reserva:8,id_habitacion:108,fecha_inicio:"2025-10-05",fecha_fin:"2025-10-09",estado:"finalizada"},
    {id_reserva:9,id_habitacion:109,fecha_inicio:"2025-10-12",fecha_fin:"2025-10-14",estado:"confirmada"},
    {id_reserva:10,id_habitacion:110,fecha_inicio:"2025-10-02",fecha_fin:"2025-10-05",estado:"pendiente"},
    {id_reserva:11,id_habitacion:110,fecha_inicio:"2025-10-06",fecha_fin:"2025-10-09",estado:"cancelada"},
    {id_reserva:12,id_habitacion:110,fecha_inicio:"2025-10-10",fecha_fin:"2025-10-12",estado:"pendiente"},
    {id_reserva:13,id_habitacion:201,fecha_inicio:"2025-10-07",fecha_fin:"2025-10-11",estado:"confirmada"},
    {id_reserva:14,id_habitacion:202,fecha_inicio:"2025-10-03",fecha_fin:"2025-10-06",estado:"finalizada"},
    {id_reserva:15,id_habitacion:203,fecha_inicio:"2025-10-09",fecha_fin:"2025-10-13",estado:"confirmada"}
  ];
  const buscarHabitaciones = () => {
    if (!validarFechas(checkIn, checkOut)) {
      alert("La fecha de check-out debe ser posterior a la de check-in.");
      return;
    }

    const disponibles = habitaciones.filter(hab => {
      if (hab.capacidad < personas) return false;
      if (hab.estado !== "disponible") return false;
      for (let res of reservas.filter(r => r.id_habitacion === hab.id)) {
        const resInicio = new Date(res.fecha_inicio);
        const resFin = new Date(res.fecha_fin);
        if (checkIn < resFin && checkOut > resInicio) return false;
      }
      return true;
    });

    setHabitacionesFiltradas(disponibles);
  };

  const handleShow = (habitacion) => {
    setHabitacionSeleccionada(habitacion);
    setShow(true);
  };
  const handleClose = () => setShow(false);

  const handleReservar = () => {
    navigate("/login");
  };

  return (
    <div>
      {/* HERO */}
      <header
        className="text-white text-center position-relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(${SaltaImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="container p-5 rounded">
          <h1 style={{ fontWeight: 700, fontSize: "3rem", textShadow: "2px 2px 6px rgba(0,0,0,0.7)" }}>
            <span style={{ color: "#ff7f32" }}>Hotel Refugio</span>
          </h1>
          <p className="lead fs-4">Tu lugar ideal para descansar, disfrutar y crear recuerdos inolvidables.</p>
          <Button
            className="btn-lg mt-3"
            style={{ backgroundColor: "#ff7f32", border: "none" }}
            onClick={() => {
              const element = document.getElementById("busqueda");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Reservar Ahora
          </Button>
        </div>
      </header>
>>>>>>> adc7774 (fin del frontend)

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

<<<<<<< HEAD
      {/* Footer */}
=======
      {/* MODAL DE RESERVA */}
      {habitacionSeleccionada && (
        <ModalReserva
          show={show}
          handleClose={handleClose}
          habitacionSeleccionada={habitacionSeleccionada}
          checkIn={checkIn}
          checkOut={checkOut}
          setCheckIn={setCheckIn}
          setCheckOut={setCheckOut}
          handleReservar={handleReservar}
          calcularNoches={calcularNoches}
          validarFechas={validarFechas}
          user={JSON.parse(localStorage.getItem("user"))}
        />
      )}

      {/* SECCIÓN DE CONTACTO */}
      <section className="py-5" style={{ backgroundColor: "#ffffff" }}>
        <div className="container">
          <h2 className="text-center mb-4">Contáctanos</h2>
          <p className="text-center text-muted mb-5">
            Si tenés dudas o querés hacer una reserva directa, hacé clic en el botón para ir a nuestro formulario de contacto.
          </p>
          <div className="text-center">
            <Link 
              to="/contacto" 
              className="btn btn-lg" 
              style={{ backgroundColor: "#ff7f32", border: "none" }}
            >
              Ir a Contacto
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
>>>>>>> adc7774 (fin del frontend)
      <Footer />
    </div>
  );
}
