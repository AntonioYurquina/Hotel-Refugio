// src/components/useReservas.jsx
import { useEffect, useState, useRef } from 'react';

export function useReservasActualizadas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reservasRef = useRef([]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch('https://robledo.website/reservas');
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();

        // Comparar y actualizar solo lo que cambió
        const actualizado = data.map((reserva) => {
          const existente = reservasRef.current.find(
            (r) => r.id_reserva === reserva.id_reserva
          );
          if (!existente) return reserva;

          const igual =
            existente.id_usuario === reserva.id_usuario &&
            existente.id_habitacion === reserva.id_habitacion &&
            existente.fecha_inicio === reserva.fecha_inicio &&
            existente.fecha_fin === reserva.fecha_fin &&
            existente.estado === reserva.estado &&
            existente.fecha_creacion === reserva.fecha_creacion;

          return igual ? existente : reserva;
        });

        // Ver si hay cambios
        const huboCambios =
          actualizado.length !== reservasRef.current.length ||
          actualizado.some((r, idx) => r !== reservasRef.current[idx]);

        if (huboCambios && mounted) {
          reservasRef.current = actualizado;
          setReservas(actualizado);

          // 🚀 Exponer a la consola para desarrollo
          window.reservas = actualizado;
          console.log('Reservas actualizadas:', actualizado);
        }
      } catch (err) {
        console.error('Error al obtener reservas:', err);
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

  return { reservas, loading, error };
}