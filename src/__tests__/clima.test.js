import { afterEach, describe, expect, it, vi } from 'vitest';
import { describirClima, interpretarClima, obtenerClima } from '../api/clima';

const respuestaApi = {
  current: { temperature_2m: 16.3, relative_humidity_2m: 62, weather_code: 3, wind_speed_10m: 7.4, is_day: 1 },
  daily: {
    time: ['2026-10-16', '2026-10-17'],
    weather_code: [53, 80],
    temperature_2m_max: [17.2, 15.1],
    temperature_2m_min: [10.5, 11.3],
    precipitation_probability_max: [76, 75],
  },
};

afterEach(() => vi.unstubAllGlobals());

describe('clima', () => {
  it('traduce los códigos WMO a texto e ícono, con variante nocturna', () => {
    expect(describirClima(0)).toEqual({ texto: 'Despejado', icono: 'fa-sun' });
    expect(describirClima(0, false).icono).toBe('fa-moon');
    expect(describirClima(81).texto).toBe('Lluvia');
    expect(describirClima(999).texto).toBe('Sin datos');
  });

  it('interpreta la respuesta redondeando temperaturas y viento', () => {
    const c = interpretarClima(respuestaApi);
    expect(c.actual).toMatchObject({ temperatura: 16, humedad: 62, viento: 7, texto: 'Nublado' });
    expect(c.dias).toHaveLength(2);
    expect(c.dias[0]).toMatchObject({ fecha: '2026-10-16', maxima: 17, minima: 11, lluvia: 76, texto: 'Llovizna' });
  });

  it('falla con claridad si el servicio responde con error', async () => {
    vi.stubGlobal('sessionStorage', { getItem: () => null, setItem: () => {} });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 503 })));
    await expect(obtenerClima()).rejects.toThrow('503');
  });

  it('consulta una vez y reutiliza el resultado guardado', async () => {
    const almacen = {};
    vi.stubGlobal('sessionStorage', { getItem: (k) => almacen[k] ?? null, setItem: (k, v) => { almacen[k] = v; } });
    const fetchFalso = vi.fn().mockResolvedValue(new Response(JSON.stringify(respuestaApi), { status: 200 }));
    vi.stubGlobal('fetch', fetchFalso);
    const primera = await obtenerClima();
    const segunda = await obtenerClima();
    expect(fetchFalso).toHaveBeenCalledTimes(1);
    expect(segunda).toEqual(primera);
  });
});
