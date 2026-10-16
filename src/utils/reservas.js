import { aFechaApi, noches } from './fechas';

export const ESTADOS_RESERVA = ['pendiente', 'confirmada', 'cancelada', 'finalizada'];
export const ESTADOS_HABITACION = ['disponible', 'ocupada', 'mantenimiento', 'cerrada'];
export const TIPOS_HABITACION = ['simple', 'doble', 'suite'];
export const ROLES = ['cliente', 'operador', 'admin'];

// Estados de habitación en los que no se pueden tomar reservas nuevas. "ocupada" se refiere a hoy, así que
// la disponibilidad en otras fechas se decide solo por solapamiento con otras reservas.
const NO_RESERVABLES = ['mantenimiento', 'cerrada'];
export const esReservable = (habitacion) => !NO_RESERVABLES.includes(habitacion.estado);

// Intervalo semiabierto [inicio, fin): una reserva que termina el día en que otra empieza no se solapa.
export function seSolapan(a, b) {
  const [ai, af, bi, bf] = [a.fecha_inicio, a.fecha_fin, b.fecha_inicio, b.fecha_fin].map(aFechaApi);
  return ai < bf && af > bi;
}

export function habitacionLibre(idHabitacion, fecha_inicio, fecha_fin, reservas, idExcluido = null) {
  return !reservas.some(
    (r) =>
      r.id_habitacion === idHabitacion &&
      r.id_reserva !== idExcluido &&
      r.estado !== 'cancelada' &&
      seSolapan(r, { fecha_inicio, fecha_fin }),
  );
}

// La API no valida fechas ni solapamientos, así que se comprueban antes de enviar. Devuelve el texto del primer
// problema o null si la reserva es válida.
export function validarReserva(reserva, reservas, habitaciones, { idExcluido = null, validarFechas = true } = {}) {
  const { id_habitacion, id_usuario, fecha_inicio, fecha_fin, estado } = reserva;
  if (!id_usuario) return 'Falta indicar el usuario de la reserva.';
  if (!id_habitacion) return 'Elegí una habitación.';
  const inicio = aFechaApi(fecha_inicio);
  const fin = aFechaApi(fecha_fin);
  if (!inicio || !fin) return 'Completá las fechas de entrada y salida.';
  if (validarFechas && noches(inicio, fin) < 1) return 'La salida debe ser al menos un día posterior a la entrada.';
  const habitacion = habitaciones.find((h) => h.id_habitacion === id_habitacion);
  if (!habitacion) return 'La habitación elegida no existe.';
  if (estado !== 'cancelada' && !habitacionLibre(id_habitacion, inicio, fin, reservas, idExcluido)) {
    return `La habitación ${habitacion.numero} ya está reservada en esas fechas.`;
  }
  return null;
}

export const total = (habitacion, inicio, fin) => noches(inicio, fin) * Number(habitacion?.precio_noche ?? 0);

// Cuerpo exacto que espera POST/PUT /reservas: fechas "YYYY-MM-DD" y todos los campos presentes.
export const aCuerpoReserva = (r) => ({
  id_usuario: Number(r.id_usuario),
  id_habitacion: Number(r.id_habitacion),
  fecha_inicio: aFechaApi(r.fecha_inicio),
  fecha_fin: aFechaApi(r.fecha_fin),
  estado: r.estado,
});

export const etiquetaUsuario = (usuarios, id, usuarioActual) => {
  const u = usuarios?.find((x) => x.id_usuario === id) ?? (usuarioActual?.id_usuario === id ? usuarioActual : null);
  return u ? `${u.nombre} ${u.apellido}`.trim() : `Usuario #${id}`;
};
