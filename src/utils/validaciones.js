// Límites de la API: nombre y apellido 50, email 100, teléfono 20 (se aplican con maxLength en los formularios).
export function validarRegistro(f) {
  const e = {};
  if (!f.nombre.trim()) e.nombre = 'Ingresá tu nombre.';
  if (!f.apellido.trim()) e.apellido = 'Ingresá tu apellido.';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Ingresá un email válido.';
  if (f.contraseña.length < 6) e.contraseña = 'Usá al menos 6 caracteres.';
  if (f.contraseña !== f.confirmar) e.confirmar = 'Las contraseñas no coinciden.';
  return e;
}
