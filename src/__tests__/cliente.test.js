import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, ErrorApi } from '../api/cliente';

const json = (cuerpo, status = 200) =>
  new Response(JSON.stringify(cuerpo), { status, headers: { 'Content-Type': 'application/json' } });

afterEach(() => vi.unstubAllGlobals());

const simular = (respuesta) => {
  const fetchFalso = vi.fn().mockResolvedValue(respuesta);
  vi.stubGlobal('fetch', fetchFalso);
  return fetchFalso;
};
const ultimaPeticion = (f) => {
  const [url, opciones] = f.mock.calls.at(-1);
  return { url, metodo: opciones.method, cuerpo: opciones.body ? JSON.parse(opciones.body) : undefined };
};

describe('cliente de la API', () => {
  it('lista habitaciones devolviendo datos y versión de la tabla', async () => {
    simular(json({ ok: true, estado_tabla: 331, datos: [{ id_habitacion: 1 }] }));
    expect(await api.listarHabitaciones()).toEqual({ datos: [{ id_habitacion: 1 }], version: 331 });
  });

  it('crea una reserva con fechas YYYY-MM-DD, ids y versión numéricos', async () => {
    const f = simular(json({ ok: true, estado_tabla: 74, datos: { id_reserva: 80 } }));
    await api.crearReserva({ id_usuario: '1', id_habitacion: '2', fecha_inicio: '2026-11-01T03:00:00.000Z', fecha_fin: '2026-11-05', estado: 'pendiente' }, 73);
    expect(ultimaPeticion(f)).toEqual({
      url: expect.stringMatching(/\/reservas$/),
      metodo: 'POST',
      cuerpo: { id_usuario: 1, id_habitacion: 2, fecha_inicio: '2026-11-01', fecha_fin: '2026-11-05', estado: 'pendiente', version: 73 },
    });
  });

  it('elimina una reserva enviando la versión en el cuerpo del DELETE', async () => {
    const f = simular(json({ ok: true, estado_tabla: 76, datos: {} }));
    await api.eliminarReserva(21, 75);
    expect(ultimaPeticion(f)).toMatchObject({ metodo: 'DELETE', cuerpo: { version: 75 } });
  });

  it('cambia el estado de una habitación con nuevo_estado y versión', async () => {
    const f = simular(json({ ok: true, estado_tabla: 332, datos: {} }));
    await api.cambiarEstadoHabitacion(1, 'ocupada', 331);
    expect(ultimaPeticion(f)).toMatchObject({ metodo: 'PUT', cuerpo: { nuevo_estado: 'ocupada', version: 331 } });
  });

  it('se niega a enviar una versión que no sea número', async () => {
    const f = simular(json({ ok: true }));
    await expect(api.eliminarReserva(1, '75')).rejects.toMatchObject({ status: 409 });
    expect(f).not.toHaveBeenCalled();
  });

  it('convierte un 409 en un conflicto con la versión nueva', async () => {
    simular(json({ ok: false, error: 'Datos desactualizados. La tabla Reserva cambió.', estado_tabla: 74 }, 409));
    const error = await api.crearReserva({ id_usuario: 1, id_habitacion: 1, fecha_inicio: '2026-11-01', fecha_fin: '2026-11-02', estado: 'pendiente' }, 73).catch((e) => e);
    expect(error).toBeInstanceOf(ErrorApi);
    expect(error.esConflicto).toBe(true);
    expect(error.estadoTabla).toBe(74);
  });

  it('no muestra al usuario el mensaje interno de PostgreSQL de un 500', async () => {
    simular(json({ ok: false, error: 'duplicate key value violates unique constraint "habitacion_numero_key"' }, 500));
    const error = await api.crearHabitacion({ numero: 101, tipo: 'simple', capacidad: 1, precio_noche: 1500 }).catch((e) => e);
    expect(error.message).not.toMatch(/duplicate key/);
    expect(error.detalle).toMatch(/duplicate key/);
  });

  it('inicia sesión y devuelve los datos del usuario', async () => {
    const f = simular(json({ ok: true, estado_tabla: 1, datos: { id_usuario: 1, tipo_usuario: 'cliente' } }));
    expect(await api.iniciarSesion(' a@b.com ', 'x')).toEqual({ id_usuario: 1, tipo_usuario: 'cliente' });
    expect(ultimaPeticion(f).cuerpo).toEqual({ email: 'a@b.com', 'contraseña': 'x' });
  });

  it('muestra el error de login que manda la API', async () => {
    simular(json({ ok: false, error: 'Contraseña incorrecta' }, 401));
    await expect(api.iniciarSesion('a@b.com', 'mal')).rejects.toThrow('Contraseña incorrecta');
  });

  it('registra sin ok en la respuesta y explica el 500 por email repetido', async () => {
    simular(json({ mensaje: 'Usuario registrado exitosamente', id_usuario: 12 }));
    expect(await api.registrar({ nombre: 'Lucía', apellido: 'F', email: 'l@x.com', 'contraseña': 'abc123' })).toMatchObject({ id_usuario: 12 });
    simular(json({ error: 'Error al registrar usuario' }, 500));
    await expect(api.registrar({ nombre: 'Lucía', apellido: 'F', email: 'l@x.com', 'contraseña': 'abc123' })).rejects.toThrow(/email/);
  });

  it('no manda telefono vacío y fuerza el rol cliente por defecto', async () => {
    const f = simular(json({ mensaje: 'ok', id_usuario: 1 }));
    await api.registrar({ nombre: 'A', apellido: 'B', email: 'a@b.com', 'contraseña': 'abc123', telefono: ' ' });
    expect(ultimaPeticion(f).cuerpo).not.toHaveProperty('telefono');
    expect(ultimaPeticion(f).cuerpo.tipo_usuario).toBe('cliente');
  });

  it('informa los errores de red', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fallo')));
    const error = await api.listarReservas().catch((e) => e);
    expect(error.esDeRed).toBe(true);
  });
});
