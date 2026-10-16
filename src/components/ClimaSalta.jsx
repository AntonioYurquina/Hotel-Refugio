import React, { useEffect, useState } from 'react';
import { obtenerClima } from '../api/clima';
import { formatearFecha } from '../utils/fechas';

const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const nombreDia = (fecha, indice) => (indice === 0 ? 'Hoy' : DIAS[new Date(`${fecha}T12:00:00`).getDay()]);

// Si el servicio del clima no responde, la sección se oculta: no es esencial para reservar.
export default function ClimaSalta() {
  const [clima, setClima] = useState(null);
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    let activo = true;
    obtenerClima().then((c) => activo && setClima(c)).catch(() => activo && setFallo(true));
    return () => { activo = false; };
  }, []);

  if (fallo) return null;
  if (!clima) {
    return <p className="text-center text-muted small" role="status">Consultando el clima de Salta…</p>;
  }

  const { actual, dias } = clima;
  return (
    <section className="mb-5 pt-4 border-top" aria-labelledby="titulo-clima">
      <h2 id="titulo-clima" className="text-center mb-4">El clima en Salta</h2>
      <div className="row g-4 align-items-stretch">
        <div className="col-lg-4">
          <div className="card h-100 shadow-sm text-center p-3">
            <i className={`fa-solid ${actual.icono} fa-3x text-brand-orange mb-2`} aria-hidden="true"></i>
            <div className="display-5 fw-bold">{actual.temperatura}°C</div>
            <div className="fs-5">{actual.texto}</div>
            <div className="text-muted small mt-2">
              <i className="fa-solid fa-droplet me-1" aria-hidden="true"></i>{actual.humedad}% humedad
              <span className="mx-2">·</span>
              <i className="fa-solid fa-wind me-1" aria-hidden="true"></i>{actual.viento} km/h
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="row row-cols-5 g-2 h-100">
            {dias.map((d, i) => (
              <div key={d.fecha} className="col">
                <div className="card h-100 shadow-sm text-center p-2" title={`${formatearFecha(d.fecha)}: ${d.texto}`}>
                  <div className="small fw-semibold text-capitalize">{nombreDia(d.fecha, i)}</div>
                  <i className={`fa-solid ${d.icono} fa-lg my-2 text-brand-orange`} aria-hidden="true"></i>
                  <div className="fw-bold">{d.maxima}°</div>
                  <div className="text-muted small">{d.minima}°</div>
                  <div className="small text-info mt-1"><i className="fa-solid fa-umbrella me-1" aria-hidden="true"></i>{d.lluvia}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-center text-muted small mt-3 mb-0">
        Datos de <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a>. Pronóstico para la zona del hotel, a 5 días.
      </p>
    </section>
  );
}
