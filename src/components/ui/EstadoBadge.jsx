import React from 'react';
import { capitalizar } from '../../utils/formato';

const CLASES = {
  confirmada: 'bg-success', pendiente: 'bg-warning text-dark', cancelada: 'bg-danger', finalizada: 'bg-secondary',
  disponible: 'bg-success', ocupada: 'bg-danger', mantenimiento: 'bg-warning text-dark', cerrada: 'bg-secondary',
};

export default function EstadoBadge({ estado, className = '' }) {
  return <span className={`badge ${CLASES[estado] ?? 'bg-light text-dark'} ${className}`}>{capitalizar(estado)}</span>;
}
