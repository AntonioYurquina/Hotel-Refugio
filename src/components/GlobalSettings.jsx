import React from 'react';

export default function GlobalSettings({ gpt5Enabled, setGpt5Enabled }) {
  const handleToggle = () => {
    const newState = !gpt5Enabled;
    setGpt5Enabled(newState);
    localStorage.setItem('hr_gpt5_enabled', JSON.stringify(newState));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5>Configuración Global</h5>
      </div>
      <div className="card-body">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="gpt5-switch"
            checked={gpt5Enabled}
            onChange={handleToggle}
          />
          <label className="form-check-label" htmlFor="gpt5-switch">
            Enable GPT-5 mini for all clients
          </label>
        </div>
        <small className="form-text text-muted">
          Activa el asistente de conserjería con IA en el portal de clientes.
        </small>
      </div>
    </div>
  );
}
