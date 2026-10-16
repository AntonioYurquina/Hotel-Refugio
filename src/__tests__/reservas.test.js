import { describe, expect, it } from 'vitest';
import { aCuerpoReserva, etiquetaUsuario, habitacionLibre, seSolapan, validarReserva } from '../utils/reservas';

const habitaciones = [
  { id_habitacion: 1, numero: 101, estado: 'disponible', precio_noche: '1500.00' },
  { id_habitacion: 2, numero: 102, estado: 'ocupada', precio_noche: '2500.00' },
];
const reservas = [
  { id_reserva: 10, id_habitacion: 1, id_usuario: 3, fecha_inicio: '2026-11-10T03:00:00.000Z', fecha_fin: '2026-11-15T03:00:00.000Z', estado: 'confirmada' },
  { id_reserva: 11, id_habitacion: 1, id_usuario: 4, fecha_inicio: '2026-12-01T03:00:00.000Z', fecha_fin: '2026-12-05T03:00:00.000Z', estado: 'cancelada' },
];
const nueva = (cambios) => ({ id_usuario: 3, id_habitacion: 1, fecha_inicio: '2026-11-20', fecha_fin: '2026-11-22', estado: 'pendiente', ...cambios });

describe('solapamiento', () => {
  it('detecta fechas que se pisan', () => {
    expect(seSolapan({ fecha_inicio: '2026-11-01', fecha_fin: '2026-11-05' }, { fecha_inicio: '2026-11-04', fecha_fin: '2026-11-08' })).toBe(true);
  });
  it('permite que una reserva empiece el día que otra termina', () => {
    expect(seSolapan({ fecha_inicio: '2026-11-01', fecha_fin: '2026-11-05' }, { fecha_inicio: '2026-11-05', fecha_fin: '2026-11-08' })).toBe(false);
  });
  it('ignora las reservas canceladas', () => {
    expect(habitacionLibre(1, '2026-12-02', '2026-12-04', reservas)).toBe(true);
  });
  it('excluye la propia reserva al editarla', () => {
    expect(habitacionLibre(1, '2026-11-11', '2026-11-12', reservas)).toBe(false);
    expect(habitacionLibre(1, '2026-11-11', '2026-11-12', reservas, 10)).toBe(true);
  });
});

describe('validarReserva', () => {
  it('acepta una reserva válida', () => {
    expect(validarReserva(nueva(), reservas, habitaciones)).toBeNull();
  });
  it('rechaza salida anterior o igual a la entrada', () => {
    expect(validarReserva(nueva({ fecha_fin: '2026-11-20' }), reservas, habitaciones)).toMatch(/posterior/);
    expect(validarReserva(nueva({ fecha_fin: '2026-11-19' }), reservas, habitaciones)).toMatch(/posterior/);
  });
  it('rechaza superposiciones con otra reserva', () => {
    expect(validarReserva(nueva({ fecha_inicio: '2026-11-12', fecha_fin: '2026-11-18' }), reservas, habitaciones)).toMatch(/101/);
  });
  it('permite omitir el orden de fechas al cambiar solo el estado de datos históricos', () => {
    const historica = nueva({ fecha_inicio: '2026-11-20', fecha_fin: '2026-11-20' });
    expect(validarReserva(historica, reservas, habitaciones)).toMatch(/posterior/);
    expect(validarReserva(historica, reservas, habitaciones, { validarFechas: false })).toBeNull();
  });
  it('exige usuario, habitación y fechas', () => {
    expect(validarReserva(nueva({ id_usuario: null }), reservas, habitaciones)).toMatch(/usuario/);
    expect(validarReserva(nueva({ id_habitacion: null }), reservas, habitaciones)).toMatch(/habitación/);
    expect(validarReserva(nueva({ fecha_inicio: '' }), reservas, habitaciones)).toMatch(/fechas/);
  });
});

describe('cuerpo de la API', () => {
  it('normaliza fechas ISO a YYYY-MM-DD y los ids a número', () => {
    expect(aCuerpoReserva({ ...reservas[0], id_usuario: '3', id_habitacion: '1' })).toEqual({
      id_usuario: 3, id_habitacion: 1, fecha_inicio: '2026-11-10', fecha_fin: '2026-11-15', estado: 'confirmada',
    });
  });
  it('etiqueta usuarios desconocidos por su id', () => {
    expect(etiquetaUsuario([], 7, null)).toBe('Usuario #7');
    expect(etiquetaUsuario([], 7, { id_usuario: 7, nombre: 'Ana', apellido: 'Paz' })).toBe('Ana Paz');
  });
});
