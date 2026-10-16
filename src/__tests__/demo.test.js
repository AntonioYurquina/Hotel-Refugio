import { beforeEach, describe, expect, it } from 'vitest';
import { crearServidorDemo } from '../demo/api';
import { CLAVE_DEMO } from '../demo/datos';

let servidor;
beforeEach(() => {
  servidor = crearServidorDemo();
});

const pedir = async (metodo, ruta, cuerpo) => {
  const r = await servidor.manejar(metodo, ruta, cuerpo);
  return { status: r.status, cuerpo: await r.json() };
};
const reserva = (cambios = {}) => ({ id_usuario: 3, id_habitacion: 1, fecha_inicio: '2027-01-10', fecha_fin: '2027-01-12', estado: 'pendiente', ...cambios });

describe('API simulada: contrato de la API Hotel v1', () => {
  it('responde con ok, estado_tabla numérico y datos ordenados por número', async () => {
    const { status, cuerpo } = await pedir('GET', '/habitaciones');
    expect(status).toBe(200);
    expect(cuerpo.ok).toBe(true);
    expect(typeof cuerpo.estado_tabla).toBe('number');
    const numeros = cuerpo.datos.map((h) => h.numero);
    expect(numeros).toEqual([...numeros].sort((a, b) => a - b));
    expect(typeof cuerpo.datos[0].precio_noche).toBe('string');
  });

  it('devuelve las fechas en ISO UTC', async () => {
    const { cuerpo } = await pedir('GET', '/reservas');
    expect(cuerpo.datos[0].fecha_inicio).toMatch(/T03:00:00\.000Z$/);
  });

  it('crea una reserva y sube la versión de la tabla en 1', async () => {
    const { cuerpo: antes } = await pedir('GET', '/reservas');
    const { status, cuerpo } = await pedir('POST', '/reservas', { ...reserva(), version: antes.estado_tabla });
    expect(status).toBe(200);
    expect(cuerpo.estado_tabla).toBe(antes.estado_tabla + 1);
    expect(cuerpo.datos.fecha_inicio).toBe('2027-01-10T03:00:00.000Z');
  });

  it('responde 409 con la versión nueva si la tabla cambió', async () => {
    const { cuerpo: antes } = await pedir('GET', '/reservas');
    servidor.simularCambioExterno();
    const { status, cuerpo } = await pedir('POST', '/reservas', { ...reserva(), version: antes.estado_tabla });
    expect(status).toBe(409);
    expect(cuerpo).toMatchObject({ ok: false, estado_tabla: antes.estado_tabla + 1 });
  });

  it('responde 409 si la versión llega como string', async () => {
    const { cuerpo: antes } = await pedir('GET', '/reservas');
    const { status } = await pedir('POST', '/reservas', { ...reserva(), version: String(antes.estado_tabla) });
    expect(status).toBe(409);
  });

  it('responde 400 si faltan datos obligatorios', async () => {
    const { status } = await pedir('POST', '/reservas', { id_usuario: 3, version: 1 });
    expect(status).toBe(400);
  });

  it('como la API real, no valida solapamientos de fechas', async () => {
    const { cuerpo: lista } = await pedir('GET', '/reservas');
    const existente = lista.datos.find((r) => r.estado === 'confirmada');
    const { status } = await pedir('POST', '/reservas', {
      ...reserva({ id_habitacion: existente.id_habitacion, fecha_inicio: existente.fecha_inicio.slice(0, 10), fecha_fin: existente.fecha_fin.slice(0, 10) }),
      version: lista.estado_tabla,
    });
    expect(status).toBe(200);
  });

  it('PUT exige todos los campos y devuelve 500 si falta alguno', async () => {
    const { cuerpo: lista } = await pedir('GET', '/reservas');
    const { status } = await pedir('PUT', `/reservas/${lista.datos[0].id_reserva}`, { estado: 'cancelada', version: lista.estado_tabla });
    expect(status).toBe(500);
  });

  it('DELETE lleva la versión en el cuerpo y responde 404 si el id no existe', async () => {
    const { cuerpo: lista } = await pedir('GET', '/reservas');
    expect((await pedir('DELETE', '/reservas/99999', { version: lista.estado_tabla })).status).toBe(404);
    expect((await pedir('DELETE', `/reservas/${lista.datos[0].id_reserva}`, { version: lista.estado_tabla })).status).toBe(200);
  });

  it('PUT de habitación cambia solo el estado y rechaza enums inválidos con 500', async () => {
    const { cuerpo: lista } = await pedir('GET', '/habitaciones');
    expect((await pedir('PUT', '/habitaciones/1', { nuevo_estado: 'volando', version: lista.estado_tabla })).status).toBe(500);
    const ok = await pedir('PUT', '/habitaciones/1', { nuevo_estado: 'cerrada', version: lista.estado_tabla });
    expect(ok.cuerpo.datos.estado).toBe('cerrada');
  });

  it('no tiene DELETE de habitaciones (la API v1 no lo ofrece)', async () => {
    expect((await pedir('DELETE', '/habitaciones/1', { version: 1 })).status).toBe(404);
  });

  it('POST /habitaciones no requiere versión y rechaza números repetidos con 500', async () => {
    const nueva = { numero: 999, tipo: 'doble', capacidad: 2, precio_noche: 2800, estado: 'disponible' };
    expect((await pedir('POST', '/habitaciones', nueva)).status).toBe(200);
    expect((await pedir('POST', '/habitaciones', nueva)).status).toBe(500);
  });

  it('login: 400 sin datos, 401 con usuario o clave incorrectos y ok con los datos del usuario', async () => {
    expect((await pedir('POST', '/login', { email: 'cliente@example.com' })).status).toBe(400);
    expect((await pedir('POST', '/login', { email: 'nadie@example.com', 'contraseña': 'x' })).cuerpo.error).toBe('Usuario no encontrado');
    expect((await pedir('POST', '/login', { email: 'cliente@example.com', 'contraseña': 'x' })).cuerpo.error).toBe('Contraseña incorrecta');
    const ok = await pedir('POST', '/login', { email: 'cliente@example.com', 'contraseña': CLAVE_DEMO });
    expect(ok.cuerpo.datos.tipo_usuario).toBe('cliente');
    expect(ok.cuerpo.datos).not.toHaveProperty('contraseña');
  });

  it('registrar: formato sin ok, 500 por email repetido y login posterior con la clave elegida', async () => {
    const nuevo = { nombre: 'Ana', apellido: 'Paz', email: 'ana@example.com', 'contraseña': 'secreta', tipo_usuario: 'cliente' };
    const alta = await pedir('POST', '/registrar', nuevo);
    expect(alta.cuerpo).toMatchObject({ mensaje: 'Usuario registrado exitosamente' });
    expect(alta.cuerpo).not.toHaveProperty('ok');
    expect((await pedir('POST', '/registrar', nuevo)).status).toBe(500);
    expect((await pedir('POST', '/login', { email: 'ana@example.com', 'contraseña': 'secreta' })).status).toBe(200);
  });
});
