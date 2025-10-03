// src/components/useHabitaciones.jsx
import { useEffect, useState, useRef } from 'react';

export function useHabitacionesActualizadas() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const habitacionesRef = useRef([]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch('https://robledo.website/habitaciones');
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();

        // Comparar y actualizar solo lo que cambió
        const actualizado = data.map((hab) => {
          const existente = habitacionesRef.current.find((h) => h.id_habitacion === hab.id_habitacion);
          if (!existente) return hab;
          const igual =
            existente.numero === hab.numero &&
            existente.tipo === hab.tipo &&
            existente.capacidad === hab.capacidad &&
            existente.precio_noche === hab.precio_noche &&
            existente.estado === hab.estado &&
            existente.descripcion === hab.descripcion;
          return igual ? existente : hab;
        });

        // Ver si hay cambios
        const huboCambios =
          actualizado.length !== habitacionesRef.current.length ||
          actualizado.some((h, idx) => h !== habitacionesRef.current[idx]);

        if (huboCambios && mounted) {
          habitacionesRef.current = actualizado;
          setHabitaciones(actualizado);
        }
      } catch (err) {
        console.error('Error al obtener habitaciones:', err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // fetch inicial + polling
    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { habitaciones, loading, error };
}
