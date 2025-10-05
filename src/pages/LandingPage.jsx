// src/pages/LandingPage.jsx
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import SearchForm from "../components/SearchForm";
import ContactanosSection from "../components/ContactanosSection";
import Footer from "../components/Footer";
import { ModalReserva } from "../components/ModalReserva";
import { useReservasActualizadas } from "../components/useReservas";

// 🧩 Diccionarios locales (modo offline)
const imagenesGenericas = [
  "https://robledo.website/patas/1.jpg",
  "https://robledo.website/patas/2.jpg",
  "https://robledo.website/patas/3.jpg",
  "https://robledo.website/patas/4.jpg",
  "https://robledo.website/patas/5.jpg",
];

const habitacionesSimuladas = [
  { id: 1, numero: 101, tipo: "Single", capacidad: 1, precio_noche: 45.0, estado: "disponible", descripcion: "Habitación sencilla con cama individual y escritorio.", imagenes: imagenesGenericas },
  { id: 2, numero: 102, tipo: "Doble", capacidad: 2, precio_noche: 75.0, estado: "disponible", descripcion: "Perfecta para parejas, equipada con cama matrimonial y balcón.", imagenes: imagenesGenericas },
  { id: 3, numero: 103, tipo: "Doble Twin", capacidad: 2, precio_noche: 70.0, estado: "ocupada", descripcion: "Cuenta con dos camas individuales, ideal para amigos o compañeros.", imagenes: imagenesGenericas },
  { id: 4, numero: 104, tipo: "Suite Junior", capacidad: 2, precio_noche: 120.0, estado: "disponible", descripcion: "Suite con sala pequeña y cama king size.", imagenes: imagenesGenericas },
];

// 🎯 Componente principal
export default function LandingPage() {
  const navigate = useNavigate();
  const { reservas, loading, error } = useReservasActualizadas();
  const [habitaciones, setHabitaciones] = useState([]);
  const [habitacionesFiltradas, setHabitacionesFiltradas] = useState([]);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);
  const [show, setShow] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [personas, setPersonas] = useState(1);

  // 🧠 Intentar traer habitaciones desde servidor, si falla usar simuladas
  useEffect(() => {
    const cargarHabitaciones = async () => {
      try {
        const res = await fetch("https://robledo.website/habitaciones");
        if (!res.ok) throw new Error("Error HTTP");
        const data = await res.json();
        setHabitaciones(data);
      } catch {
        console.warn("⚠️ Usando datos simulados de habitaciones");
        setHabitaciones(habitacionesSimuladas);
      }
    };
    cargarHabitaciones();
  }, []);

  // 🔢 Calcular noches
  const calcularNoches = (inicio, fin) => {
    if (!inicio || !fin) return 0;
    const diff = fin.getTime() - inicio.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // 🧩 Validar fechas
  const validarFechas = (inicio, fin) => {
    if (!inicio || !fin) return false;
    return fin > inicio;
  };

  // 🔍 Buscar habitaciones disponibles
  const buscarHabitaciones = () => {
    if (!validarFechas(checkIn, checkOut)) {
      alert("La fecha de check-out debe ser posterior a la de check-in.");
      return;
    }
    const disponibles = habitaciones.filter((hab) => {
      if (hab.capacidad < personas) return false;
      if (hab.estado !== "disponible") return false;
      for (let res of reservas.filter((r) => r.id_habitacion === hab.id)) {
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
  const handleReservar = () => navigate("/login");

  return (
    <div>
      {/* HERO */}
      <Hero
        onReservarClick={() => {
          const element = document.getElementById("busqueda");
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* FORMULARIO DE BÚSQUEDA */}
      <SearchForm
        checkIn={checkIn}
        checkOut={checkOut}
        personas={personas}
        onCheckInChange={(fecha) => setCheckIn(new Date(fecha))}
        onCheckOutChange={(fecha) => setCheckOut(new Date(fecha))}
        onPersonasChange={setPersonas}
        onSearchClick={buscarHabitaciones}
      />

      {/* RESULTADOS DE BÚSQUEDA */}
      <section className="container py-5">
        {loading ? (
          <p className="text-center">Cargando habitaciones...</p>
        ) : error ? (
          <p className="text-center text-danger">Error al conectar con el servidor</p>
        ) : habitacionesFiltradas.length > 0 ? (
          <div className="row">
            {habitacionesFiltradas.map((hab) => (
              <div className="col-md-4 mb-4" key={hab.id}>
                <div className="card shadow-sm">
                  <img
                    src={hab.imagenes?.[0] || imagenesGenericas[0]}
                    alt={hab.tipo}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5>{hab.tipo}</h5>
                    <p>{hab.descripcion}</p>
                    <Button
                      style={{ backgroundColor: "#ff7f32", border: "none" }}
                      onClick={() => handleShow(hab)}
                    >
                      Reservar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No hay habitaciones disponibles para esas fechas.</p>
        )}
      </section>

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

      {/* CONTACTO */}
      <ContactanosSection onClick={() => navigate("/contacto")} />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
