import { describe, expect, it } from 'vitest';
import { aFechaApi, formatearFecha, noches, sumarDias } from '../utils/fechas';

describe('fechas', () => {
  it('convierte la medianoche argentina (03:00 UTC) al mismo día', () => {
    expect(aFechaApi('2026-10-20T03:00:00.000Z')).toBe('2026-10-20');
  });
  it('conserva las fechas ya normalizadas', () => {
    expect(aFechaApi('2026-11-01')).toBe('2026-11-01');
  });
  it('devuelve vacío ante valores inválidos', () => {
    expect(aFechaApi('')).toBe('');
    expect(aFechaApi('no es fecha')).toBe('');
  });
  it('formatea en es-AR sin correrse de día', () => {
    expect(formatearFecha('2026-10-20T03:00:00.000Z')).toBe('20/10/2026');
  });
  it('cuenta noches entre ISO y fechas simples', () => {
    expect(noches('2026-11-01', '2026-11-05T03:00:00.000Z')).toBe(4);
    expect(noches('2026-11-05', '2026-11-01')).toBe(0);
  });
  it('suma días cruzando meses', () => {
    expect(sumarDias('2026-10-30', 3)).toBe('2026-11-02');
  });
});
