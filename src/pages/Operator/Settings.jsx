import React from 'react';
import GlobalSettings from '../../components/GlobalSettings';

export default function Settings({ gpt5Enabled, setGpt5Enabled }) {
  return (
    <section>
      <div className="row g-3">
        <div className="col-md-6">
          <GlobalSettings gpt5Enabled={gpt5Enabled} setGpt5Enabled={setGpt5Enabled} />
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h5>Otras Acciones</h5></div>
            <div className="card-body">
              <p>Exporta los datos de la aplicación en formato JSON.</p>
              <button className="btn btn-secondary" onClick={() => alert('Función de exportación no implementada.')}>
                <i className="fa-solid fa-download me-2"></i>Exportar Datos
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
