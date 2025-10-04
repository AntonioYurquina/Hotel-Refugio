import React, { useState } from "react";
import SaltaImg from "../assets/salta.jpg"; 
import { Modal, Carousel, Button } from "react-bootstrap"; // Solo 1 import de Button
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom"; // Combinar imports de react-router-dom
import Footer from "../components/Footer.jsx";

export default function LandingPage() {
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

  // Diccionarios de habitaciones y reservas
  const habitaciones = [
    {id:1,numero:101,tipo:"Single",capacidad:1,precio_noche:45.0,estado:"disponible",descripcion:"Habitación sencilla con cama individual y escritorio.",imagenes:["https://robledo.website/patas/3.jpg","https://robledo.website/patas/4.jpg"]},
    {id:2,numero:102,tipo:"Doble",capacidad:2,precio_noche:75.0,estado:"disponible",descripcion:"Perfecta para parejas, equipada con cama matrimonial y balcón.",imagenes:["https://robledo.website/patas/3.jpg","https://robledo.website/patas/4.jpg"]},
    {id:3,numero:103,tipo:"Doble Twin",capacidad:2,precio_noche:70.0,estado:"ocupada",descripcion:"Cuenta con dos camas individuales, ideal para amigos o compañeros.",imagenes:["https://robledo.website/patas/1.jpg","https://robledo.website/patas/2.jpg"]},
    {id:4,numero:104,tipo:"Suite Junior",capacidad:2,precio_noche:120.0,estado:"disponible",descripcion:"Suite con sala pequeña y cama king size.",imagenes:["https://robledo.website/patas/3.jpg","https://robledo.website/patas/4.jpg"]},
    {id:5,numero:105,tipo:"Familiar",capacidad:4,precio_noche:150.0,estado:"disponible",descripcion:"Habitación amplia con dos camas matrimoniales.",imagenes:["https://robledo.website/patas/3.jpg","https://robledo.website/patas/4.jpg"]},
    {id:6,numero:106,tipo:"Single",capacidad:1,precio_noche:40.0,estado:"mantenimiento",descripcion:"Compacta y económica, con todo lo necesario para descansar.",imagenes:["https://robledo.website/patas/3.jpg","https://robledo.website/patas/4.jpg"]},
    {id:7,numero:107,tipo:"Doble Deluxe",capacidad:2,precio_noche:95.0,estado:"disponible",descripcion:"Habitación de lujo para dos personas, con jacuzzi privado.",imagenes:["https://robledo.website/patas/3.jpg","https://robledo.website/patas/4.jpg"]},
    {id:8,numero:108,tipo:"Suite Presidencial",capacidad:3,precio_noche:250.0,estado:"ocupada",descripcion:"La mejor suite del hotel, con sala, comedor y terraza privada.",imagenes:["https://robledo.website/patas/3.jpg","https://robledo.website/patas/4.jpg"]},
    {id:9,numero:109,tipo:"Triple",capacidad:3,precio_noche:110.0,estado:"disponible",descripcion:"Ideal para grupos pequeños, con tres camas individuales.",imagenes:["https://robledo.website/patas/3.jpg","https://robledo.website/patas/4.jpg"]},
    {id:10,numero:110,tipo:"Single",capacidad:1,precio_noche:42.0,estado:"cerrada",descripcion:"Habitación individual fuera de servicio temporalmente.",imagenes:["https://robledo.website/patas/5.jpg","https://robledo.website/patas/2.jpg"]},
    {id:11,numero:201,tipo:"Suite Familiar",capacidad:5,precio_noche:180.0,estado:"disponible",descripcion:"Gran suite para familias, equipada con sala de estar.",imagenes:["https://robledo.website/patas/5.jpg","https://robledo.website/patas/2.jpg"]},
    {id:12,numero:202,tipo:"Doble",capacidad:2,precio_noche:78.0,estado:"ocupada",descripcion:"Cómoda habitación doble con diseño moderno.",imagenes:["https://robledo.website/patas/5.jpg","https://robledo.website/patas/2.jpg"]},
    {id:13,numero:203,tipo:"Doble Twin",capacidad:2,precio_noche:72.0,estado:"disponible",descripcion:"Dos camas individuales, vista al jardín.",imagenes:["https://robledo.website/patas/5.jpg","https://robledo.website/patas/2.jpg"]},
    {id:14,numero:204,tipo:"Suite Ejecutiva",capacidad:2,precio_noche:135.0,estado:"disponible",descripcion:"Perfecta para viajes de negocios, con escritorio amplio y wifi.",imagenes:["https://robledo.website/patas/5.jpg","https://robledo.website/patas/2.jpg"]},
    {id:15,numero:205,tipo:"Familiar Deluxe",capacidad:6,precio_noche:200.0,estado:"disponible",descripcion:"La más amplia de todas, con tres dormitorios y cocina equipada.",imagenes:["https://robledo.website/patas/5.jpg","https://robledo.website/patas/2.jpg"]}
  ];

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
    // Redirige a la página de reserva o formulario
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
          <Button  className="btn-lg mt-3"  style={{ backgroundColor: "#ff7f32", border: "none" }}  onClick={() => {    const element = document.getElementById("busqueda");    if (element) element.scrollIntoView({ behavior: "smooth" });  }}>
            Reservar Ahora
          </Button>
        </div>
      </header>

      {/* FORMULARIO DE BÚSQUEDA */}
      <section id="busqueda" className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <h2 className="text-center mb-4">Buscar Habitaciones</h2>
          <div className="row mb-4 g-3">
            <div className="col-md-3">
              <label>Check-in</label>
              <input
                type="date"
                className="form-control"
                value={checkIn ? checkIn.toISOString().split("T")[0] : ""}
                onChange={e => setCheckIn(e.target.value ? new Date(e.target.value) : null)}
              />
            </div>
            <div className="col-md-3">
              <label>Check-out</label>
              <input
                type="date"
                className="form-control"
                value={checkOut ? checkOut.toISOString().split("T")[0] : ""}
                onChange={e => setCheckOut(e.target.value ? new Date(e.target.value) : null)}
              />
            </div>
            <div className="col-md-3">
              <label>Personas</label>
              <input
                type="number"
                className="form-control"
                min={1}
                value={personas}
                onChange={e => setPersonas(parseInt(e.target.value))}
              />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-lg w-100"
                style={{ backgroundColor: "#ff7f32", border: "none" }}
                onClick={buscarHabitaciones}
              >
                Buscar
              </button>
            </div>
          </div>

          {/* HABITACIONES FILTRADAS */}
          <div className="row g-4">
            {habitacionesFiltradas.length ? (
              habitacionesFiltradas.map(hab => {
                const noches = calcularNoches(checkIn, checkOut);
                return (
                  <div key={hab.id} className="col-12 col-md-6 col-lg-4">
                    <div className="card shadow-sm rounded-3 h-100 cursor-pointer" onClick={() => handleShow(hab)}>
                      <Carousel indicators={false} interval={3000}>
                        {hab.imagenes.map((img, idx) => (
                          <Carousel.Item key={idx}>
                            <img src={img} alt={`${hab.tipo} ${idx}`} className="d-block w-100" style={{ height: "220px", objectFit: "cover" }} />
                          </Carousel.Item>
                        ))}
                      </Carousel>
                      <div className="card-body">
                        <h5 className="card-title">{hab.tipo}</h5>
                        <p className="text-muted mb-1">Capacidad: {hab.capacidad} personas</p>
                        <p className="card-text" style={{ fontSize: "0.9rem" }}>{hab.descripcion}</p>
                        <p className="fw-bold mt-2">Precio por noche: ${hab.precio_noche.toFixed(2)}</p>
                        {noches > 0 && <p><strong>Total:</strong> ${(hab.precio_noche*noches).toFixed(2)}</p>}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center">
                <p className="text-muted fs-5">No se encontraron habitaciones disponibles para los criterios seleccionados.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MODAL DE RESERVA */}
      {habitacionSeleccionada && (
        <Modal show={show} onHide={handleClose} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{habitacionSeleccionada.tipo}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Carousel interval={2500}>
              {habitacionSeleccionada.imagenes.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    src={img}
                    alt={`${habitacionSeleccionada.tipo} ${idx}`}
                    className="d-block w-100"
                    style={{ height: "400px", objectFit: "cover", borderRadius: "10px" }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>

            <div className="mt-3">
              <p><strong>Capacidad:</strong> {habitacionSeleccionada.capacidad} personas</p>
              <p>{habitacionSeleccionada.descripcion}</p>

              <div className="d-flex gap-3 flex-wrap mt-3">
                <div className="form-group">
                  <label><strong>Check-in</strong></label>
                  <input
                    type="date"
                    className="form-control"
                    value={checkIn ? checkIn.toISOString().split("T")[0] : ""}
                    onChange={e => setCheckIn(e.target.value ? new Date(e.target.value) : null)}
                  />
                </div>
                <div className="form-group">
                  <label><strong>Check-out</strong></label>
                  <input
                    type="date"
                    className="form-control"
                    value={checkOut ? checkOut.toISOString().split("T")[0] : ""}
                    onChange={e => setCheckOut(e.target.value ? new Date(e.target.value) : null)}
                  />
                </div>
              </div>

              {validarFechas(checkIn, checkOut) ? (
                <div className="mt-3 p-3 bg-light rounded">
                  <p><strong>Noches:</strong> {calcularNoches(checkIn, checkOut)}</p>
                  <p><strong>Precio por noche:</strong> ${habitacionSeleccionada.precio_noche.toFixed(2)}</p>
                  <p><strong>Total estadía:</strong> ${(habitacionSeleccionada.precio_noche * calcularNoches(checkIn, checkOut)).toFixed(2)}</p>
                </div>
              ) : checkIn && checkOut ? (
                <p className="text-danger mt-2">¡La fecha de check-out debe ser posterior al check-in!</p>
              ) : null}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
            <Button
              style={{ backgroundColor: "#ff7f32", border: "none" }}
              disabled={!validarFechas(checkIn, checkOut)}
              onClick={handleReservar}
            >
              Reservar
            </Button>
          </Modal.Footer>
        </Modal>
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
      <Footer />
    </div>
  );
}