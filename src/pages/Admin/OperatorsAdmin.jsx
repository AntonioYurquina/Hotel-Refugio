import React from 'react';

export default function OperatorsAdmin({ operators, deleteOperator }) {
  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Operadores ({operators.length})</h5>
        <button className="btn btn-primary btn-sm">
          <i className="fa-solid fa-plus me-1"></i> Añadir Operador
        </button>
      </div>
      <div className="list-group">
        {operators.map(op => (
          <div key={op.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{op.name}</strong>
              <span className="ms-2 text-muted">({op.role})</span>
            </div>
            <div>
              <button className="btn btn-sm btn-outline-secondary me-2">
                <i className="fa-solid fa-pencil"></i> Editar
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteOperator(op.id)}>
                <i className="fa-solid fa-trash-can"></i> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
