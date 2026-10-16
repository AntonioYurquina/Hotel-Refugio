import { API_URL } from '../config';
import { aCuerpoReserva } from '../utils/reservas';

// Cliente de la API Hotel v1. Cada función devuelve los datos ya extraídos de la respuesta y lanza ErrorApi si
// algo falla, de modo que la interfaz solo decide qué mostrar.

const MENSAJES_POR_ESTADO = {
  400: 'Faltan datos obligatorios.',
  401: 'Email o contraseña incorrectos.',
  404: 'No se encontró lo que buscabas.',
  409: 'Los datos cambiaron mientras trabajabas.',
  500: 'El servidor no pudo completar la operación. Revisá los datos e intentá de nuevo.',
};

export class ErrorApi extends Error {
  constructor(mensaje, { status = 0, estadoTabla = null, detalle = null } = {}) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.status = status;
    this.estadoTabla = estadoTabla;
    this.detalle = detalle;
  }

  get esConflicto() {
    return this.status === 409;
  }

  get esDeRed() {
    return this.status === 0;
  }
}

async function peticion(metodo, ruta, cuerpo) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: cuerpo === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
  } catch (causa) {
    throw new ErrorApi('No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.', { detalle: String(causa) });
  }

  let datos = null;
  try {
    datos = await respuesta.json();
  } catch {
    // Respuesta sin cuerpo JSON: se resuelve más abajo según el código HTTP.
  }

  if (!respuesta.ok || datos?.ok === false) {
    const status = respuesta.status;
    const delServidor = datos?.error ?? datos?.mensaje;
    // Los 500 traen el mensaje interno de PostgreSQL: se guarda como detalle y no se le muestra al usuario.
    const mensaje = status === 500 || !delServidor ? MENSAJES_POR_ESTADO[status] ?? 'Ocurrió un error inesperado.' : delServidor;
    throw new ErrorApi(mensaje, { status, estadoTabla: datos?.estado_tabla ?? null, detalle: delServidor ?? null });
  }
  return datos;
}

// Las rutas con control de concurrencia exigen la versión como número: un string produce siempre 409.
function versionNumerica(version) {
  if (!Number.isInteger(version)) throw new ErrorApi('Falta sincronizar los datos antes de modificarlos. Recargá la página.', { status: 409 });
  return version;
}

const tabla = (r) => ({ datos: r.datos, version: r.estado_tabla });

export const api = {
  async listarHabitaciones() {
    return tabla(await peticion('GET', '/habitaciones'));
  },

  async crearHabitacion({ numero, tipo, capacidad, precio_noche, estado = 'disponible', descripcion = '' }) {
    return tabla(
      await peticion('POST', '/habitaciones', {
        numero: Number(numero),
        tipo: tipo.trim().toLowerCase(),
        capacidad: Number(capacidad),
        precio_noche: Number(precio_noche),
        estado,
        descripcion,
      }),
    );
  },

  async cambiarEstadoHabitacion(id, nuevoEstado, version) {
    return tabla(await peticion('PUT', `/habitaciones/${id}`, { nuevo_estado: nuevoEstado, version: versionNumerica(version) }));
  },

  async listarReservas() {
    return tabla(await peticion('GET', '/reservas'));
  },

  async crearReserva(reserva, version) {
    return tabla(await peticion('POST', '/reservas', { ...aCuerpoReserva(reserva), version: versionNumerica(version) }));
  },

  // PUT exige todos los campos: los que falten quedan en null y la base los rechaza con 500.
  async modificarReserva(id, reserva, version) {
    return tabla(await peticion('PUT', `/reservas/${id}`, { ...aCuerpoReserva(reserva), version: versionNumerica(version) }));
  },

  async eliminarReserva(id, version) {
    return tabla(await peticion('DELETE', `/reservas/${id}`, { version: versionNumerica(version) }));
  },

  async iniciarSesion(email, contraseña) {
    const respuesta = await peticion('POST', '/login', { email: email.trim(), contraseña });
    return respuesta.datos;
  },

  // Responde { mensaje, id_usuario } y, en caso de error, { error } sin el campo ok.
  async registrar({ nombre, apellido, email, contraseña, telefono = '', tipo_usuario = 'cliente' }) {
    const cuerpo = { nombre: nombre.trim(), apellido: apellido.trim(), email: email.trim(), contraseña, tipo_usuario };
    if (telefono.trim()) cuerpo.telefono = telefono.trim();
    try {
      return await peticion('POST', '/registrar', cuerpo);
    } catch (error) {
      if (error instanceof ErrorApi && error.status === 500) {
        throw new ErrorApi('No se pudo crear la cuenta: es probable que ese email ya esté registrado.', { status: 500, detalle: error.detalle });
      }
      throw error;
    }
  },

  // Solo para el modo demo: en la API real GET /usuarios es una ruta de test que expone las contraseñas.
  async listarUsuarios() {
    return peticion('GET', '/usuarios');
  },
};
