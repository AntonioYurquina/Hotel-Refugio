// src/pages/AdminPage.jsx
import React from 'react';
import { useHabitacionesActualizadas } from '../components/useHabitaciones';
import HabitacionCard from '../components/HabitacionCard';

export default function AdminPage({ user }) {
  const { habitaciones, loading, error } = useHabitacionesActualizadas();

  console.log('habitaciones recibidas:', habitaciones);

  return (
    <div className="container mt-5">
      <h1>Bienvenido Admin, {user.nombre}</h1>
      <p>Este es el contenido exclusivo para administradores.</p>

      <h2 className="mt-4">Habitaciones</h2>

      {loading && <p>Cargando habitaciones...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      {!loading && habitaciones.length === 0 && <p>No se obtuvieron habitaciones.</p>}

      <div className="row mt-3">
        {habitaciones.map((hab) => (
          <div className="col-md-4 mb-3" key={hab.id_habitacion}>
            <HabitacionCard habitacion={hab} />
          </div>
        ))}
      </div>
    </div>
  );
}
