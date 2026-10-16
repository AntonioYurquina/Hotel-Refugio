import React, { useEffect, useId, useRef } from 'react';

// Modal accesible: role="dialog", se cierra con Escape, devuelve el foco al cerrar y bloquea el scroll del fondo.
export default function Modal({ titulo, onClose, children, pie = null, tamano = '' }) {
  const idTitulo = useId();
  const dialogo = useRef(null);
  const cerrar = useRef(onClose);
  cerrar.current = onClose;

  useEffect(() => {
    const anterior = document.activeElement;
    const alTeclear = (e) => e.key === 'Escape' && cerrar.current();
    document.addEventListener('keydown', alTeclear);
    document.body.classList.add('modal-open');
    dialogo.current?.focus();
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.classList.remove('modal-open');
      anterior?.focus?.();
    };
  }, []);

  return (
    <div className="modal show d-block modal-fondo" role="presentation">
      <div ref={dialogo} tabIndex={-1} className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${tamano}`} role="dialog" aria-modal="true" aria-labelledby={idTitulo}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={idTitulo}>{titulo}</h5>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose}></button>
          </div>
          <div className="modal-body">{children}</div>
          {pie && <div className="modal-footer">{pie}</div>}
        </div>
      </div>
    </div>
  );
}
