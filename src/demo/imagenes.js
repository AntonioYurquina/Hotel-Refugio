const paletas = [
  ['#e9e1d3', '#d8c9b0', '#b5543a'], ['#dfe7ea', '#c3d3d9', '#3f6f87'], ['#e8e4dc', '#d2cabb', '#6b7f4e'],
  ['#ece2e0', '#dcc6c1', '#8a4b5c'], ['#e3e8df', '#c9d5c3', '#40715e'], ['#e7e3ee', '#cfc8de', '#5b4e8c'],
];
const ANCHAS = [3, 4, 5, 8, 9, 10];

function svgHabitacion(id, variante) {
  const [pared, piso, acento] = paletas[(id + variante) % paletas.length];
  const ancha = ANCHAS.includes(id);
  const camaW = ancha ? 300 : 210;
  const bx = 300 - camaW / 2;
  const vx = variante === 0 ? 70 : 420;
  const ventana = variante === 1 ? '' :
    `<rect x="${vx}" y="70" width="110" height="130" rx="4" fill="#cfe6f5" stroke="#fff" stroke-width="8"/>` +
    `<path d="M${vx + 8} 192 L${vx + 42} 140 L${vx + 65} 168 L${vx + 86} 128 L${vx + 102} 192Z" fill="#7aa08b"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">` +
    `<rect width="600" height="400" fill="${pared}"/><rect y="270" width="600" height="130" fill="${piso}"/>` +
    `<rect y="266" width="600" height="8" fill="#00000012"/>${ventana}` +
    `<rect x="${bx - 8}" y="150" width="${camaW + 16}" height="120" rx="10" fill="#6d5442"/>` +
    `<rect x="${bx}" y="215" width="${camaW}" height="85" rx="8" fill="#fbfaf7"/>` +
    `<rect x="${bx}" y="248" width="${camaW}" height="52" rx="6" fill="${acento}"/>` +
    `<rect x="${bx + 16}" y="190" width="${ancha ? 110 : 150}" height="38" rx="14" fill="#fff"/>` +
    (ancha ? `<rect x="${bx + camaW - 126}" y="190" width="110" height="38" rx="14" fill="#fff"/>` : '') +
    `<rect x="${bx + camaW + 22}" y="236" width="48" height="64" rx="4" fill="#8a6a50"/>` +
    `<rect x="${bx + camaW + 42}" y="196" width="8" height="40" fill="#555"/>` +
    `<path d="M${bx + camaW + 28} 196 h36 l-8 -28 h-20z" fill="#f3d27a"/></svg>`;
}

export const imagenDemo = (id, variante) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgHabitacion(Number(id) || 0, variante))}`;
