// Pronóstico de Salta con Open-Meteo (https://open-meteo.com): gratuita, sin clave y con CORS abierto.
// Es un servicio de terceros: si falla, la pantalla de inicio sigue funcionando sin esta sección.
const URL_CLIMA =
  'https://api.open-meteo.com/v1/forecast?latitude=-24.7910&longitude=-65.4124' +
  '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
  '&timezone=America%2FArgentina%2FSalta&forecast_days=5';

const VIGENCIA_MS = 30 * 60 * 1000;
const CLAVE = 'clima-salta';

// Códigos WMO que devuelve Open-Meteo, agrupados en descripciones y íconos de Font Awesome.
const GRUPOS = [
  [[0], 'Despejado', 'fa-sun', 'fa-moon'],
  [[1, 2], 'Parcialmente nublado', 'fa-cloud-sun', 'fa-cloud-moon'],
  [[3], 'Nublado', 'fa-cloud', 'fa-cloud'],
  [[45, 48], 'Niebla', 'fa-smog', 'fa-smog'],
  [[51, 53, 55, 56, 57], 'Llovizna', 'fa-cloud-rain', 'fa-cloud-rain'],
  [[61, 63, 65, 66, 67, 80, 81, 82], 'Lluvia', 'fa-cloud-showers-heavy', 'fa-cloud-showers-heavy'],
  [[71, 73, 75, 77, 85, 86], 'Nieve', 'fa-snowflake', 'fa-snowflake'],
  [[95, 96, 99], 'Tormenta', 'fa-cloud-bolt', 'fa-cloud-bolt'],
];

export function describirClima(codigo, esDeDia = true) {
  const grupo = GRUPOS.find(([codigos]) => codigos.includes(codigo));
  return grupo ? { texto: grupo[1], icono: esDeDia ? grupo[2] : grupo[3] } : { texto: 'Sin datos', icono: 'fa-circle-question' };
}

// Convierte la respuesta de Open-Meteo en lo que muestra la pantalla.
export function interpretarClima(r) {
  const actual = r.current;
  return {
    actual: {
      temperatura: Math.round(actual.temperature_2m),
      humedad: actual.relative_humidity_2m,
      viento: Math.round(actual.wind_speed_10m),
      ...describirClima(actual.weather_code, actual.is_day === 1),
    },
    dias: r.daily.time.map((fecha, i) => ({
      fecha,
      maxima: Math.round(r.daily.temperature_2m_max[i]),
      minima: Math.round(r.daily.temperature_2m_min[i]),
      lluvia: r.daily.precipitation_probability_max[i],
      ...describirClima(r.daily.weather_code[i]),
    })),
  };
}

const leerCache = () => {
  try {
    const guardado = JSON.parse(sessionStorage.getItem(CLAVE));
    return guardado && Date.now() - guardado.hora < VIGENCIA_MS ? guardado.datos : null;
  } catch {
    return null;
  }
};

export async function obtenerClima() {
  const enCache = leerCache();
  if (enCache) return enCache;
  const respuesta = await fetch(URL_CLIMA);
  if (!respuesta.ok) throw new Error(`Open-Meteo respondió ${respuesta.status}`);
  const datos = interpretarClima(await respuesta.json());
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify({ hora: Date.now(), datos }));
  } catch {
    // Sin almacenamiento: se vuelve a consultar la próxima vez.
  }
  return datos;
}
