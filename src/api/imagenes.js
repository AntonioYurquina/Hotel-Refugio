// Fotos de las habitaciones: viven en /public/rooms, así el sitio no depende de ningún servicio externo.
// Hay tres fotos por tipo (simple, doble, familiar, suite).

const TIPOS = ['simple', 'doble', 'familiar', 'suite'];

export const normalizar = (texto) =>
  String(texto || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();

export function claveDeTipo(tipo, id = 0) {
  const t = normalizar(tipo);
  if (TIPOS.includes(t)) return t;
  const parecido = TIPOS.find((clave) => t.includes(clave));
  // Un tipo que el admin inventó: se reparte entre los existentes de forma estable.
  return parecido || TIPOS[Math.abs(Number(id) || 0) % TIPOS.length];
}

export function fotosHabitacion(habitacion) {
  const clave = claveDeTipo(habitacion?.tipo, habitacion?.id_habitacion);
  // Se rota el orden según la habitación para que dos "Simple" no muestren la misma foto primero.
  const giro = Math.abs(Number(habitacion?.id_habitacion) || 0) % 3;
  return [0, 1, 2].map((i) => `${import.meta.env.BASE_URL}rooms/${clave}-${((i + giro) % 3) + 1}.jpg`);
}
