// Ocupación: habitaciones ocupadas sobre las habilitadas para la venta
// (las que están en mantenimiento o cerradas no cuentan).
export function calcularOcupacion(habitaciones = []) {
  const habilitadas = habitaciones.filter(h => h.estado === 'disponible' || h.estado === 'ocupada');
  if (habilitadas.length === 0) return 0;
  return (habilitadas.filter(h => h.estado === 'ocupada').length / habilitadas.length) * 100;
}
