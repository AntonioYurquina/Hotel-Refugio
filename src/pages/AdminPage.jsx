// src/pages/AdminPage.jsx
import React from 'react';
import { useHabitacionesActualizadas } from '../components/useHabitaciones';
import HabitacionCard from '../components/HabitacionCard';

export default function AdminPage({ user }) {
  const { habitaciones, loading, error } = useHabitacionesActualizadas();

  // Colores suaves según estado
  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case "disponible":
        return "#c8e6c9"; // verde pastel
      case "ocupada":
        return "#bbdefb"; // azul pastel
      case "cerrada":
        return "#ffcdd2"; // rojo pastel
      default:
        return "#e0e0e0"; // gris claro
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4" style={{ color: "#37474f" }}>
        Bienvenido Admin, {user.nombre}
      </h1>
      <p className="text-center" style={{ color: "#607d8b" }}>
        Este es el contenido exclusivo para administradores.
      </p>

      <h2 className="mt-5 mb-3" style={{ color: "#455a64" }}>Habitaciones</h2>

      {loading && <p>Cargando habitaciones...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      {!loading && habitaciones.length === 0 && (
        <p>No se obtuvieron habitaciones.</p>
      )}

      {/* Agrupamos por estado */}
      {["disponible", "ocupada", "cerrada"].map((estado) => {
        const rooms = habitaciones.filter(
          (hab) => hab.estado.toLowerCase() === estado
        );
        if (rooms.length === 0) return null;

        return (
          <div
            key={estado}
            className="mb-5 p-3 rounded shadow-sm"
            style={{
              backgroundColor: getEstadoColor(estado),
            }}
          >
            <h3 className="mb-4 text-capitalize" style={{ color: "#37474f" }}>
              {estado}
            </h3>

            <div className="row">
              {rooms.map((hab) => (
                <div className="col-md-6 mb-4" key={hab.id_habitacion}>
                  <HabitacionCard habitacion={hab} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
