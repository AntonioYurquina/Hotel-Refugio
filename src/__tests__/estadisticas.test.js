import { describe, expect, it } from 'vitest';
import { indicadoresGerencia, indicadoresOperador, ingresoDe } from '../utils/estadisticas';
import { hoyApi, sumarDias } from '../utils/fechas';

const habitaciones = [
  { id_habitacion: 1, estado: 'ocupada', precio_noche: '1500.00' },
  { id_habitacion: 2, estado: 'disponible', precio_noche: '2500.00' },
  { id_habitacion: 3, estado: 'cerrada', precio_noche: '5000.00' },
  { id_habitacion: 4, estado: 'disponible', precio_noche: '2600.00' },
];

describe('estadísticas', () => {
  it('calcula el ingreso por noches y precio (string) de la habitación', () => {
    expect(ingresoDe({ id_habitacion: 2, fecha_inicio: '2026-11-01', fecha_fin: '2026-11-04' }, habitaciones)).toBe(7500);
    expect(ingresoDe({ id_habitacion: 99, fecha_inicio: '2026-11-01', fecha_fin: '2026-11-04' }, habitaciones)).toBe(0);
  });

  it('indicadores del operador: ocupación, llegadas y salidas de hoy, pendientes', () => {
    const hoy = hoyApi();
    const reservas = [
      { id_habitacion: 1, estado: 'confirmada', fecha_inicio: hoy, fecha_fin: sumarDias(hoy, 2) },
      { id_habitacion: 2, estado: 'confirmada', fecha_inicio: sumarDias(hoy, -2), fecha_fin: hoy },
      { id_habitacion: 4, estado: 'pendiente', fecha_inicio: sumarDias(hoy, 3), fecha_fin: sumarDias(hoy, 4) },
    ];
    expect(indicadoresOperador(habitaciones, reservas)).toEqual({ ocupacion: 25, disponibles: 2, llegadasHoy: 1, salidasHoy: 1, pendientes: 1 });
  });

  it('indicadores de gerencia solo cuentan reservas finalizadas', () => {
    const reservas = [
      { id_habitacion: 1, estado: 'finalizada', fecha_inicio: '2026-01-10', fecha_fin: '2026-01-12' },
      { id_habitacion: 2, estado: 'finalizada', fecha_inicio: '2026-02-01', fecha_fin: '2026-02-05' },
      { id_habitacion: 2, estado: 'confirmada', fecha_inicio: '2026-03-01', fecha_fin: '2026-03-05' },
    ];
    const r = indicadoresGerencia(habitaciones, reservas);
    expect(r.ingresos).toBe(2 * 1500 + 4 * 2500);
    expect(r.estadiaPromedio).toBe(3);
    expect(r.tarifaPromedio).toBe(r.ingresos / 2);
    expect(r.estadosHabitacion).toEqual({ ocupada: 1, disponible: 2, cerrada: 1 });
  });

  it('no divide por cero sin datos', () => {
    expect(indicadoresGerencia([], [])).toMatchObject({ ocupacion: 0, estadiaPromedio: 0, tarifaPromedio: 0 });
  });
});
