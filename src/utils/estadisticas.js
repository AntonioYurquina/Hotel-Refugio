import { aFechaApi, hoyApi, noches } from './fechas';
import { aNumero } from './formato';

export const ingresoDe = (reserva, habitaciones) => {
  const habitacion = habitaciones.find((h) => h.id_habitacion === reserva.id_habitacion);
  return habitacion ? noches(reserva.fecha_inicio, reserva.fecha_fin) * aNumero(habitacion.precio_noche) : 0;
};

export function indicadoresOperador(habitaciones, reservas) {
  const hoy = hoyApi();
  const ocupadas = habitaciones.filter((h) => h.estado === 'ocupada').length;
  return {
    ocupacion: habitaciones.length ? (ocupadas / habitaciones.length) * 100 : 0,
    disponibles: habitaciones.filter((h) => h.estado === 'disponible').length,
    llegadasHoy: reservas.filter((r) => r.estado === 'confirmada' && aFechaApi(r.fecha_inicio) === hoy).length,
    salidasHoy: reservas.filter((r) => r.estado === 'confirmada' && aFechaApi(r.fecha_fin) === hoy).length,
    pendientes: reservas.filter((r) => r.estado === 'pendiente').length,
  };
}

export function indicadoresGerencia(habitaciones, reservas) {
  const finalizadas = reservas.filter((r) => r.estado === 'finalizada');
  const ingresos = finalizadas.reduce((suma, r) => suma + ingresoDe(r, habitaciones), 0);
  const nochesTotales = finalizadas.reduce((suma, r) => suma + noches(r.fecha_inicio, r.fecha_fin), 0);
  const ocupadas = habitaciones.filter((h) => h.estado === 'ocupada').length;
  return {
    ingresos,
    ocupacion: habitaciones.length ? (ocupadas / habitaciones.length) * 100 : 0,
    estadiaPromedio: finalizadas.length ? nochesTotales / finalizadas.length : 0,
    tarifaPromedio: finalizadas.length ? ingresos / finalizadas.length : 0,
    estadosHabitacion: habitaciones.reduce((acc, h) => ({ ...acc, [h.estado]: (acc[h.estado] || 0) + 1 }), {}),
  };
}
