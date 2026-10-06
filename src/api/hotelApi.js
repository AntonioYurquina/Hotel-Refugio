// Cliente REST de la base de demostración (Supabase / PostgREST).
//
// Devuelve las mismas formas de datos que usa toda la interfaz:
//   habitaciones y reservas → { ok, estado_tabla, datos }
//   login                   → { ok, datos }
//   usuarios                → [ ... ]
// Si algo falla lanza un ApiError con un mensaje listo para mostrar.

const URL_BASE = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const CLAVE = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const apiConfigurada = Boolean(URL_BASE && CLAVE);

export class ApiError extends Error {
  constructor(mensaje, status = 0) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Códigos de error de PostgreSQL → mensaje para el usuario
const MENSAJES = {
  '23P01': 'La habitación ya está reservada en esas fechas.',
  '23505': 'Ya existe una habitación con ese número.',
  '23514': 'Hay datos fuera de rango o inválidos (revisá fechas, capacidad y estado).',
  '23503': 'La referencia indicada no existe.',
  '23502': 'Falta completar un dato obligatorio.',
};

async function pedir(ruta, { method = 'GET', body } = {}) {
  if (!apiConfigurada) {
    throw new ApiError('La base de datos de demostración no está configurada.');
  }

  const headers = { apikey: CLAVE, 'Content-Type': 'application/json' };
  // Las claves nuevas (sb_publishable_...) viajan solo en "apikey"; las anteriores son JWT.
  if (CLAVE.startsWith('eyJ')) headers.Authorization = `Bearer ${CLAVE}`;
  if (method === 'POST' || method === 'PATCH') headers.Prefer = 'return=representation';

  let respuesta;
  try {
    respuesta = await fetch(`${URL_BASE}/rest/v1/${ruta}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('No se pudo conectar con la base de datos.');
  }

  const texto = await respuesta.text();
  let datos = null;
  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch {
      datos = null;
    }
  }

  if (!respuesta.ok) {
    const mensaje = MENSAJES[datos?.code] || datos?.message || `Error ${respuesta.status}`;
    throw new ApiError(mensaje, respuesta.status);
  }
  return datos;
}

// Las fechas llegan como "2026-10-06". new Date("2026-10-06") las interpreta en UTC y en
// Argentina cae el día anterior; con la hora local explícita se interpretan bien.
export const fechaLocal = (fecha) =>
  typeof fecha === 'string' && fecha.length === 10 ? `${fecha}T00:00:00` : fecha;

const normalizarReserva = (r) => ({
  ...r,
  fecha_inicio: fechaLocal(r.fecha_inicio),
  fecha_fin: fechaLocal(r.fecha_fin),
});

// La base no necesita control de versión; se conserva el campo por compatibilidad con la UI.
const conVersion = (extra) => ({ ok: true, estado_tabla: Date.now(), ...extra });

const elegir = (objeto, campos) =>
  Object.fromEntries(
    campos.filter((c) => objeto[c] !== undefined && objeto[c] !== '').map((c) => [c, objeto[c]])
  );

const enteroSeguro = (v) => {
  const n = Number(v);
  if (!Number.isInteger(n)) throw new ApiError('Identificador inválido.');
  return n;
};

// ---- Autenticación y usuarios -------------------------------------------------

export async function login(email, contraseña) {
  const r = await pedir('rpc/login', {
    method: 'POST',
    body: { p_email: email, p_contrasena: contraseña },
  });
  if (!r?.ok) throw new ApiError(r?.mensaje || 'Credenciales incorrectas', 401);
  return r;
}

export function listarUsuarios() {
  return pedir(
    'usuarios_publico?select=id_usuario,nombre,apellido,email,telefono,tipo_usuario,fecha_registro&order=id_usuario'
  );
}

// ---- Habitaciones -------------------------------------------------------------

export async function listarHabitaciones() {
  const datos = await pedir('habitaciones?select=*&order=id_habitacion');
  return conVersion({ datos });
}

const cuerpoHabitacion = (datos) => {
  const cuerpo = elegir(datos, ['numero', 'tipo', 'capacidad', 'precio_noche', 'descripcion', 'estado']);
  if (cuerpo.capacidad !== undefined) cuerpo.capacidad = Number(cuerpo.capacidad);
  if (cuerpo.precio_noche !== undefined) cuerpo.precio_noche = Number(cuerpo.precio_noche);
  return cuerpo;
};

export async function crearHabitacion(datos) {
  const [creada] = await pedir('habitaciones', { method: 'POST', body: cuerpoHabitacion(datos) });
  return conVersion({ datos: creada });
}

export async function actualizarHabitacion(id, datos) {
  const [actualizada] = await pedir(`habitaciones?id_habitacion=eq.${enteroSeguro(id)}`, {
    method: 'PATCH',
    body: cuerpoHabitacion(datos),
  });
  if (!actualizada) throw new ApiError('La habitación ya no existe.', 404);
  return conVersion({ datos: actualizada });
}

export async function cambiarEstadoHabitacion(id, estado) {
  const [actualizada] = await pedir(`habitaciones?id_habitacion=eq.${enteroSeguro(id)}`, {
    method: 'PATCH',
    body: { estado },
  });
  return conVersion({ datos: actualizada });
}

export async function eliminarHabitacion(id) {
  await pedir(`habitaciones?id_habitacion=eq.${enteroSeguro(id)}`, { method: 'DELETE' });
  return conVersion({});
}

// ---- Reservas -----------------------------------------------------------------

const CAMPOS_RESERVA = ['id_usuario', 'id_habitacion', 'fecha_inicio', 'fecha_fin', 'estado'];

export async function listarReservas() {
  const datos = await pedir('reservas?select=*&order=id_reserva');
  return conVersion({ datos: datos.map(normalizarReserva) });
}

export async function crearReserva(datos) {
  const [creada] = await pedir('reservas', { method: 'POST', body: elegir(datos, CAMPOS_RESERVA) });
  return conVersion({ datos: normalizarReserva(creada) });
}

export async function actualizarReserva(id, datos) {
  const [actualizada] = await pedir(`reservas?id_reserva=eq.${enteroSeguro(id)}`, {
    method: 'PATCH',
    body: elegir(datos, CAMPOS_RESERVA),
  });
  if (!actualizada) throw new ApiError('La reserva ya no existe.', 404);
  return conVersion({ datos: normalizarReserva(actualizada) });
}

export async function eliminarReserva(id) {
  await pedir(`reservas?id_reserva=eq.${enteroSeguro(id)}`, { method: 'DELETE' });
  return conVersion({});
}
