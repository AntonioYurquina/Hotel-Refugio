import React, { useState } from 'react';
import Modal from './Modal';

export default function ConfirmDialog({ titulo, mensaje, textoConfirmar = 'Eliminar', onConfirm, onCancel }) {
  const [trabajando, setTrabajando] = useState(false);

  const confirmar = async () => {
    setTrabajando(true);
    try {
      await onConfirm();
    } finally {
      setTrabajando(false);
    }
  };

  return (
    <Modal
      titulo={titulo}
      onClose={onCancel}
      pie={
        <>
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={trabajando}>Cancelar</button>
          <button type="button" className="btn btn-danger" onClick={confirmar} disabled={trabajando}>
            {trabajando && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>}
            {textoConfirmar}
          </button>
        </>
      }
    >
      <p className="mb-0">{mensaje}</p>
    </Modal>
  );
}
