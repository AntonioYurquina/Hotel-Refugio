import React, { useState } from 'react';
import { DEMO } from '../../config';
import { simularCambioExterno } from '../../demo/api';
import { useToast } from '../../context/toastContext';

// Aviso visible solo en modo demo. El botón permite mostrar en vivo el control de concurrencia (409).
export default function BannerModo() {
  const [visible, setVisible] = useState(true);
  const { addToast } = useToast();
  if (!DEMO || !visible) return null;

  return (
    <div className="alert alert-info alert-dismissible rounded-0 mb-0 py-2 small" role="note">
      <div className="container d-flex flex-wrap align-items-center gap-2">
        <span><i className="fa-solid fa-flask me-2" aria-hidden="true"></i><strong>Modo demo:</strong> datos ficticios en memoria que simulan la API Hotel v1.</span>
        <button
          type="button"
          className="btn btn-sm btn-outline-info"
          onClick={() => {
            simularCambioExterno();
            addToast('Se simuló un cambio de otra persona. Probá crear o editar una reserva para ver el aviso de conflicto (409).', 'info');
          }}
        >
          Simular cambio de otro usuario
        </button>
      </div>
      <button type="button" className="btn-close" aria-label="Ocultar aviso" onClick={() => setVisible(false)}></button>
    </div>
  );
}
