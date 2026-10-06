// Formato de precios en pesos argentinos: 45000 → "$ 45.000"
const formato = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export const formatoPrecio = (valor) => formato.format(Number(valor) || 0);
