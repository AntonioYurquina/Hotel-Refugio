// src/components/HabitacionCard.jsx
import React from 'react';

const HabitacionCard = React.memo(function HabitacionCard({ habitacion }) {
  // Colores pastel para los estados
  const estadoColors = {
    disponible: { background: "#c8e6c9", text: "#256029" }, // verde pastel
    ocupada: { background: "#bbdefb", text: "#0d47a1" },    // azul pastel
    cerrada: { background: "#ffcdd2", text: "#b71c1c" },    // rojo pastel
    mantenimiento: { background: "#fff9c4", text: "#827717" }, // amarillo pastel
    otro: { background: "#e0e0e0", text: "#424242" },       // gris claro
  };

  const estado = habitacion.estado?.toLowerCase();
  const estadoStyle = estadoColors[estado] || estadoColors.otro;

  // Generamos las 5 imágenes fijas
  const imagenes = [
    "https://robledo.website/patas/1.jpg",
    "https://robledo.website/patas/2.jpg",
    "https://robledo.website/patas/3.jpg",
    "https://robledo.website/patas/4.jpg",
    "https://robledo.website/patas/5.jpg",
  ];

  // ID único para el carrusel de cada habitación
  const carouselId = `carouselHabitacion${habitacion.id_habitacion}`;

  return (
    <div
      className="card mb-3 shadow-sm"
      style={{
        maxWidth: "900px",
        backgroundColor: "#f9f9f9", // fondo suave y único
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
      }}
    >
      <div className="row g-0">
        {/* Columna izquierda: carrusel */}
        <div className="col-md-5">
          <div id={carouselId} className="carousel slide h-100" data-bs-ride="carousel">
            <div className="carousel-inner h-100">
              {imagenes.map((img, idx) => (
                <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                  <img
                    src={img}
                    className="d-block w-100"
                    alt={`Habitación ${habitacion.numero} - img ${idx + 1}`}
                    style={{ height: "250px", objectFit: "cover", borderRadius: "12px 0 0 12px" }}
                  />
                </div>
              ))}
            </div>
            {/* Controles */}
            <button className="carousel-control-prev" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        </div>

        {/* Columna derecha: información */}
        <div className="col-md-7">
          <div className="card-body d-flex justify-content-between align-items-start">
            <div>
              <h5 className="card-title" style={{ color: "#37474f" }}>
                Habitación {habitacion.numero}
              </h5>
              <p className="card-text" style={{ color: "#616161" }}>
                {habitacion.descripcion}
              </p>
              <ul className="list-unstyled mb-0" style={{ color: "#424242" }}>
                <li><strong>Tipo:</strong> {habitacion.tipo}</li>
                <li><strong>Capacidad:</strong> {habitacion.capacidad}</li>
                <li><strong>Precio:</strong> ${habitacion.precio_noche}</li>
              </ul>
            </div>

            {/* Badge de estado con color pastel */}
            <span
              className="badge"
              style={{
                backgroundColor: estadoStyle.background,
                color: estadoStyle.text,
                fontSize: "0.9rem",
                padding: "8px 12px",
                borderRadius: "8px",
              }}
            >
              {habitacion.estado}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default HabitacionCard;
