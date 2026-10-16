// La API recibe fechas como "YYYY-MM-DD" y las devuelve en ISO UTC (ej. "2026-10-20T03:00:00.000Z", que es el
// 20/10 a las 00:00 de Argentina). Todo se normaliza a "YYYY-MM-DD" en hora argentina para que el resultado no
// dependa de la zona horaria del navegador.
export const ZONA_HORARIA = 'America/Argentina/Buenos_Aires';

const DIA_MS = 86400000;
const SOLO_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const formatoISO = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_HORARIA, year: 'numeric', month: '2-digit', day: '2-digit' });
// Se formatea en UTC porque la entrada ya es un día calendario ("YYYY-MM-DD") convertido a medianoche UTC.
const formatoLocal = new Intl.DateTimeFormat('es-AR', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });

const aUTC = (aaaammdd) => {
  const [a, m, d] = aaaammdd.split('-').map(Number);
  return Date.UTC(a, m - 1, d);
};

export function aFechaApi(valor) {
  if (!valor) return '';
  if (typeof valor === 'string' && SOLO_FECHA.test(valor)) return valor;
  const fecha = valor instanceof Date ? valor : new Date(valor);
  return Number.isNaN(fecha.getTime()) ? '' : formatoISO.format(fecha);
}

export function formatearFecha(valor) {
  const fecha = aFechaApi(valor);
  return fecha ? formatoLocal.format(new Date(aUTC(fecha))) : '—';
}

export const hoyApi = () => aFechaApi(new Date());

export function sumarDias(valor, dias) {
  const base = aFechaApi(valor);
  return base ? new Date(aUTC(base) + dias * DIA_MS).toISOString().slice(0, 10) : '';
}

export function noches(inicio, fin) {
  const a = aFechaApi(inicio);
  const b = aFechaApi(fin);
  if (!a || !b) return 0;
  return Math.max(0, Math.round((aUTC(b) - aUTC(a)) / DIA_MS));
}

// Convierte "YYYY-MM-DD" en un Date a mediodía local, apto para librerías de calendario que usan Date.
export function aDateLocal(valor) {
  const [a, m, d] = aFechaApi(valor).split('-').map(Number);
  return new Date(a, m - 1, d, 12);
}
