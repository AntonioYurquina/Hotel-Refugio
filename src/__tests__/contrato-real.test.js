import { describe, expect, it } from 'vitest';
import { api, ErrorApi } from '../api/cliente';
import { DEMO } from '../config';

// Pruebas contra la API real. Se omiten en modo demo y se ejecutan con:
//   VITE_API_URL=<url base> npm test
// Todas son de solo lectura o usan una versión vieja a propósito (la API responde 409 sin modificar nada).
// Con VITE_API_REAL_ESCRIBIR=1 se agrega un ciclo crear + eliminar de una reserva de prueba en 2031.
describe.skipIf(DEMO)('contrato de la API real', () => {
  it('GET /habitaciones cumple el formato documentado', async () => {
    const { datos, version } = await api.listarHabitaciones();
    expect(Number.isInteger(version)).toBe(true);
    expect(datos.length).toBeGreaterThan(0);
    const [h] = datos;
    expect(typeof h.id_habitacion).toBe('number');
    expect(typeof h.numero).toBe('number');
    expect(typeof h.precio_noche).toBe('string');
    expect(['disponible', 'ocupada', 'mantenimiento', 'cerrada']).toContain(h.estado);
    const numeros = datos.map((x) => x.numero);
    expect(numeros).toEqual([...numeros].sort((a, b) => a - b));
  });

  it('GET /reservas devuelve fechas ISO UTC y estados válidos', async () => {
    const { datos, version } = await api.listarReservas();
    expect(Number.isInteger(version)).toBe(true);
    for (const r of datos) {
      expect(r.fecha_inicio).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(['pendiente', 'confirmada', 'cancelada', 'finalizada']).toContain(r.estado);
    }
  });

  it('POST /login con un usuario inexistente responde 401 con el mensaje de la API', async () => {
    const error = await api.iniciarSesion('no-existe@example.com', 'x').catch((e) => e);
    expect(error).toBeInstanceOf(ErrorApi);
    expect(error.status).toBe(401);
    expect(error.message).toBe('Usuario no encontrado');
  });

  it('una versión vieja produce 409 con la versión actual y no modifica nada', async () => {
    const antes = await api.listarReservas();
    const error = await api
      .crearReserva({ id_usuario: 1, id_habitacion: 1, fecha_inicio: '2031-01-10', fecha_fin: '2031-01-12', estado: 'pendiente' }, 1)
      .catch((e) => e);
    expect(error.esConflicto).toBe(true);
    expect(error.estadoTabla).toBe(antes.version);
    expect((await api.listarReservas()).datos).toHaveLength(antes.datos.length);

    const hab = await api.listarHabitaciones();
    const errorHab = await api.cambiarEstadoHabitacion(hab.datos[0].id_habitacion, hab.datos[0].estado, 1).catch((e) => e);
    expect(errorHab.esConflicto).toBe(true);
  });

  it.runIf(import.meta.env.VITE_API_REAL_ESCRIBIR === '1')('ciclo completo: crear y eliminar una reserva de prueba', async () => {
    const { version } = await api.listarReservas();
    const creada = await api.crearReserva({ id_usuario: 1, id_habitacion: 1, fecha_inicio: '2031-01-10', fecha_fin: '2031-01-12', estado: 'pendiente' }, version);
    expect(creada.version).toBe(version + 1);
    expect(creada.datos.fecha_inicio).toBe('2031-01-10T03:00:00.000Z');

    const cambiada = await api.modificarReserva(creada.datos.id_reserva, { ...creada.datos, estado: 'cancelada' }, creada.version);
    expect(cambiada.datos.estado).toBe('cancelada');

    const eliminada = await api.eliminarReserva(creada.datos.id_reserva, cambiada.version);
    expect(eliminada.datos.id_reserva).toBe(creada.datos.id_reserva);
    expect((await api.listarReservas()).datos.some((r) => r.id_reserva === creada.datos.id_reserva)).toBe(false);
  });
});
