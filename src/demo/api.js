import { API_URL } from '../config';
import { CLAVE_DEMO, crearDatosDemo } from './datos';

const respuesta = (cuerpo, status = 200) =>
  new Response(JSON.stringify(cuerpo), { status, headers: { 'Content-Type': 'application/json' } });

const solapan = (a, b) => a.fecha_inicio < b.fecha_fin && a.fecha_fin > b.fecha_inicio;

export function instalarApiDemo() {
  const db = crearDatosDemo();
  const fetchReal = window.fetch.bind(window);
  let proximaReserva = db.reservas.length + 1;
  let proximaHabitacion = db.habitaciones.length + 1;

  const tablaHabitaciones = () => ({ ok: true, estado_tabla: db.version.habitaciones, datos: db.habitaciones });
  const tablaReservas = () => ({ ok: true, estado_tabla: db.version.reservas, datos: db.reservas });

  async function manejar(metodo, ruta, cuerpo) {
    if (ruta === '/login' && metodo === 'POST') {
      const usuario = db.usuarios.find((u) => u.email.toLowerCase() === String(cuerpo.email).trim().toLowerCase());
      if (!usuario || cuerpo['contraseña'] !== CLAVE_DEMO) return respuesta({ ok: false, mensaje: 'Credenciales incorrectas' }, 401);
      return respuesta({ ok: true, datos: usuario });
    }
    if (ruta === '/usuarios' && metodo === 'GET') return respuesta(db.usuarios);

    if (ruta === '/habitaciones') {
      if (metodo === 'GET') return respuesta(tablaHabitaciones());
      if (metodo === 'POST') {
        const { version, ...datos } = cuerpo;
        const nueva = { estado: 'disponible', ...datos, id_habitacion: proximaHabitacion++ };
        db.habitaciones.push(nueva);
        db.version.habitaciones++;
        return respuesta({ ok: true, estado_tabla: db.version.habitaciones, datos: nueva }, 201);
      }
    }
    const hab = ruta.match(/^\/habitaciones\/(\d+)$/);
    if (hab) {
      const id = Number(hab[1]);
      const habitacion = db.habitaciones.find((h) => h.id_habitacion === id);
      if (!habitacion) return respuesta({ ok: false, mensaje: 'Habitación inexistente' }, 404);
      if (metodo === 'PUT') habitacion.estado = cuerpo.nuevo_estado;
      if (metodo === 'DELETE') db.habitaciones = db.habitaciones.filter((h) => h.id_habitacion !== id);
      db.version.habitaciones++;
      return respuesta({ ok: true, estado_tabla: db.version.habitaciones });
    }

    if (ruta === '/reservas') {
      if (metodo === 'GET') return respuesta(tablaReservas());
      if (metodo === 'POST') {
        const { version, ...datos } = cuerpo;
        if (!(datos.fecha_fin > datos.fecha_inicio)) {
          return respuesta({ ok: false, mensaje: 'La fecha de salida debe ser posterior a la de entrada.' }, 400);
        }
        const choque = db.reservas.some((r) => r.id_habitacion === datos.id_habitacion && r.estado !== 'cancelada' && solapan(r, datos));
        if (choque) return respuesta({ ok: false, mensaje: 'La habitación ya está reservada en esas fechas.' }, 409);
        const hoy = new Date().toISOString().slice(0, 10);
        const nueva = { estado: 'pendiente', fecha_creacion: hoy, ...datos, id_reserva: proximaReserva++ };
        db.reservas.push(nueva);
        db.version.reservas++;
        return respuesta({ ok: true, estado_tabla: db.version.reservas, datos: nueva }, 201);
      }
    }
    const res = ruta.match(/^\/reservas\/(\d+)$/);
    if (res) {
      const id = Number(res[1]);
      const reserva = db.reservas.find((r) => r.id_reserva === id);
      if (!reserva) return respuesta({ ok: false, mensaje: 'Reserva inexistente' }, 404);
      if (metodo === 'PUT') {
        const { version, ...cambios } = cuerpo;
        Object.assign(reserva, cambios);
      }
      if (metodo === 'DELETE') db.reservas = db.reservas.filter((r) => r.id_reserva !== id);
      db.version.reservas++;
      return respuesta({ ok: true, estado_tabla: db.version.reservas });
    }
    return respuesta({ ok: false, mensaje: 'Ruta inexistente' }, 404);
  }

  window.fetch = async (entrada, opciones = {}) => {
    const url = typeof entrada === 'string' ? entrada : entrada.url;
    if (!url.startsWith(API_URL)) return fetchReal(entrada, opciones);
    const ruta = url.slice(API_URL.length).split('?')[0];
    const metodo = (opciones.method || 'GET').toUpperCase();
    const cuerpo = opciones.body ? JSON.parse(opciones.body) : {};
    await new Promise((resolver) => setTimeout(resolver, 120));
    return manejar(metodo, ruta, cuerpo);
  };
}
