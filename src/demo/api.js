import { API_URL } from '../config';
import { CLAVE_DEMO, crearDatosDemo } from './datos';

// API simulada en memoria con el mismo contrato que la API Hotel v1: formato { ok, estado_tabla, datos },
// control de concurrencia por versión (409), enums, códigos HTTP y fechas ISO. Como la API real, no valida
// solapamientos ni que la salida sea posterior a la entrada: eso lo hace el frontend.

const ESTADOS_HABITACION = ['disponible', 'ocupada', 'mantenimiento', 'cerrada'];
const ESTADOS_RESERVA = ['pendiente', 'confirmada', 'cancelada', 'finalizada'];
const ROLES = ['cliente', 'operador', 'admin'];

const respuesta = (cuerpo, status = 200) =>
  new Response(JSON.stringify(cuerpo), { status, headers: { 'Content-Type': 'application/json' } });
const error = (mensaje, status, extra = {}) => respuesta({ ok: false, error: mensaje, ...extra }, status);

const aISO = (aaaammdd) => `${aaaammdd}T03:00:00.000Z`;
const esFecha = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
const falta = (...valores) => valores.some((v) => v === undefined || v === null || v === '');

export function crearServidorDemo() {
  const db = crearDatosDemo();
  const claves = new Map(db.usuarios.map((u) => [u.id_usuario, CLAVE_DEMO]));
  let proximaReserva = Math.max(...db.reservas.map((r) => r.id_reserva)) + 1;
  let proximaHabitacion = Math.max(...db.habitaciones.map((h) => h.id_habitacion)) + 1;
  let proximoUsuario = Math.max(...db.usuarios.map((u) => u.id_usuario)) + 1;

  const ordenadas = () => [...db.habitaciones].sort((a, b) => a.numero - b.numero);
  const conflicto = (nombreTabla, version) =>
    error(`Datos desactualizados. La tabla ${nombreTabla} cambió.`, 409, { estado_tabla: version });
  const exito = (version, datos) => respuesta({ ok: true, estado_tabla: version, datos });

  function habitaciones(metodo, id, cuerpo) {
    if (id === null) {
      if (metodo === 'GET') return exito(db.version.habitaciones, ordenadas());
      if (metodo === 'POST') {
        const { numero, tipo, capacidad, precio_noche, estado, descripcion = '' } = cuerpo;
        if (falta(numero, tipo, capacidad, precio_noche, estado)) return error('Faltan datos obligatorios', 400);
        if (!ESTADOS_HABITACION.includes(estado) || String(tipo).length > 20) return error('Valor inválido para la habitación', 500);
        if (db.habitaciones.some((h) => h.numero === Number(numero))) return error('El número de habitación ya existe', 500);
        const nueva = {
          id_habitacion: proximaHabitacion++, numero: Number(numero), tipo, capacidad: Number(capacidad),
          precio_noche: Number(precio_noche).toFixed(2), estado, descripcion,
        };
        db.habitaciones.push(nueva);
        return exito(++db.version.habitaciones, nueva);
      }
    } else if (metodo === 'PUT') {
      const { nuevo_estado, version } = cuerpo;
      if (falta(nuevo_estado, version)) return error('Faltan datos obligatorios', 400);
      const habitacion = db.habitaciones.find((h) => h.id_habitacion === id);
      if (!habitacion) return error('Habitación no encontrada', 404);
      if (version !== db.version.habitaciones) return conflicto('Habitacion', db.version.habitaciones);
      if (!ESTADOS_HABITACION.includes(nuevo_estado)) return error('Estado de habitación inválido', 500);
      habitacion.estado = nuevo_estado;
      return exito(++db.version.habitaciones, habitacion);
    }
    return error('Ruta inexistente', 404);
  }

  function reservas(metodo, id, cuerpo) {
    const campos = ['id_usuario', 'id_habitacion', 'fecha_inicio', 'fecha_fin', 'estado'];
    const validar = () => {
      if (!ESTADOS_RESERVA.includes(cuerpo.estado)) return 'Estado de reserva inválido';
      if (!esFecha(cuerpo.fecha_inicio) || !esFecha(cuerpo.fecha_fin)) return 'Fecha inválida';
      if (!db.usuarios.some((u) => u.id_usuario === cuerpo.id_usuario)) return 'El usuario no existe';
      if (!db.habitaciones.some((h) => h.id_habitacion === cuerpo.id_habitacion)) return 'La habitación no existe';
      return null;
    };

    if (id === null) {
      if (metodo === 'GET') return exito(db.version.reservas, [...db.reservas].sort((a, b) => a.id_reserva - b.id_reserva));
      if (metodo === 'POST') {
        if (falta(...campos.map((c) => cuerpo[c]), cuerpo.version)) return error('Faltan datos obligatorios', 400);
        if (cuerpo.version !== db.version.reservas) return conflicto('Reserva', db.version.reservas);
        const invalido = validar();
        if (invalido) return error(invalido, 500);
        const nueva = {
          id_reserva: proximaReserva++, id_usuario: cuerpo.id_usuario, id_habitacion: cuerpo.id_habitacion,
          fecha_inicio: aISO(cuerpo.fecha_inicio), fecha_fin: aISO(cuerpo.fecha_fin), estado: cuerpo.estado,
          fecha_creacion: new Date().toISOString(),
        };
        db.reservas.push(nueva);
        return exito(++db.version.reservas, nueva);
      }
      return error('Ruta inexistente', 404);
    }

    const reserva = db.reservas.find((r) => r.id_reserva === id);
    if (metodo === 'PUT') {
      if (falta(cuerpo.version)) return error('Faltan datos obligatorios', 400);
      if (!reserva) return error('Reserva no encontrada', 404);
      if (cuerpo.version !== db.version.reservas) return conflicto('Reserva', db.version.reservas);
      if (campos.some((c) => cuerpo[c] === undefined)) return error('null value in column violates not-null constraint', 500);
      const invalido = validar();
      if (invalido) return error(invalido, 500);
      Object.assign(reserva, {
        id_usuario: cuerpo.id_usuario, id_habitacion: cuerpo.id_habitacion, estado: cuerpo.estado,
        fecha_inicio: aISO(cuerpo.fecha_inicio), fecha_fin: aISO(cuerpo.fecha_fin),
      });
      return exito(++db.version.reservas, reserva);
    }
    if (metodo === 'DELETE') {
      if (falta(cuerpo.version)) return error('Faltan datos obligatorios', 400);
      if (!reserva) return error('Reserva no encontrada', 404);
      if (cuerpo.version !== db.version.reservas) return conflicto('Reserva', db.version.reservas);
      db.reservas = db.reservas.filter((r) => r.id_reserva !== id);
      return exito(++db.version.reservas, reserva);
    }
    return error('Ruta inexistente', 404);
  }

  function usuarios(metodo, ruta, cuerpo) {
    if (ruta === '/login' && metodo === 'POST') {
      if (falta(cuerpo.email, cuerpo['contraseña'])) return error('Faltan email o contraseña', 400);
      const usuario = db.usuarios.find((u) => u.email.toLowerCase() === String(cuerpo.email).trim().toLowerCase());
      if (!usuario) return error('Usuario no encontrado', 401);
      if (claves.get(usuario.id_usuario) !== cuerpo['contraseña']) return error('Contraseña incorrecta', 401);
      return exito(1, usuario);
    }
    if (ruta === '/registrar' && metodo === 'POST') {
      const { nombre, apellido, email, tipo_usuario, telefono = null } = cuerpo;
      if (falta(nombre, apellido, email, cuerpo['contraseña'], tipo_usuario)) return respuesta({ error: 'Faltan datos obligatorios' }, 400);
      const repetido = db.usuarios.some((u) => u.email.toLowerCase() === String(email).trim().toLowerCase());
      if (repetido || !ROLES.includes(tipo_usuario)) return respuesta({ error: 'Error al registrar usuario' }, 500);
      const usuario = { id_usuario: proximoUsuario++, nombre, apellido, email, telefono, tipo_usuario };
      db.usuarios.push(usuario);
      claves.set(usuario.id_usuario, cuerpo['contraseña']);
      return respuesta({ mensaje: 'Usuario registrado exitosamente', id_usuario: usuario.id_usuario });
    }
    // Extensión del modo demo: la API real expone esta ruta solo para tests (y con las contraseñas).
    if (ruta === '/usuarios' && metodo === 'GET') return respuesta(db.usuarios);
    return null;
  }

  async function manejar(metodo, ruta, cuerpo = {}) {
    const delUsuario = usuarios(metodo, ruta, cuerpo);
    if (delUsuario) return delUsuario;
    const hab = ruta.match(/^\/habitaciones(?:\/(\d+))?$/);
    if (hab) return habitaciones(metodo, hab[1] ? Number(hab[1]) : null, cuerpo);
    const res = ruta.match(/^\/reservas(?:\/(\d+))?$/);
    if (res) return reservas(metodo, res[1] ? Number(res[1]) : null, cuerpo);
    return error('Ruta inexistente', 404);
  }

  // Imita que otra persona modificó las reservas: la próxima escritura con la versión anterior recibe 409.
  const simularCambioExterno = () => ++db.version.reservas;

  return { manejar, simularCambioExterno, db };
}

let servidor = null;
export const simularCambioExterno = () => servidor?.simularCambioExterno();

export function instalarApiDemo() {
  servidor = crearServidorDemo();
  const fetchReal = window.fetch.bind(window);

  window.fetch = async (entrada, opciones = {}) => {
    const url = typeof entrada === 'string' ? entrada : entrada.url;
    if (!url.startsWith(API_URL)) return fetchReal(entrada, opciones);
    const ruta = url.slice(API_URL.length).split('?')[0];
    const metodo = (opciones.method || 'GET').toUpperCase();
    let cuerpo = {};
    try {
      cuerpo = opciones.body ? JSON.parse(opciones.body) : {};
    } catch {
      return error('JSON inválido', 400);
    }
    await new Promise((resolver) => setTimeout(resolver, 120));
    return servidor.manejar(metodo, ruta, cuerpo);
  };
}
