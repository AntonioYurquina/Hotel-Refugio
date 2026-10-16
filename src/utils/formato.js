const moneda = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

// La API devuelve precio_noche como string ("1500.00"): se convierte siempre con Number(...) antes de calcular.
export const aNumero = (valor) => {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
};

export const formatearPrecio = (valor) => moneda.format(aNumero(valor));

export const capitalizar = (texto = '') => texto.charAt(0).toUpperCase() + texto.slice(1);

export const nombreCompleto = (usuario) => (usuario ? `${usuario.nombre} ${usuario.apellido}`.trim() : '');
