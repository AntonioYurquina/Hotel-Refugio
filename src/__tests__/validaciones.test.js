import { describe, expect, it } from 'vitest';
import { validarRegistro } from '../utils/validaciones';

const valido = { nombre: 'Lucía', apellido: 'Fernández', email: 'lucia@email.com', telefono: '', 'contraseña': 'secreta', confirmar: 'secreta' };

describe('validarRegistro', () => {
  it('acepta un registro completo', () => {
    expect(validarRegistro(valido)).toEqual({});
  });
  it('detecta campos vacíos, email inválido y contraseñas distintas', () => {
    const e = validarRegistro({ ...valido, nombre: ' ', email: 'nope', 'contraseña': 'abc', confirmar: 'abd' });
    expect(Object.keys(e)).toHaveLength(4);
    expect(e).toHaveProperty('nombre');
    expect(e).toHaveProperty('email');
    expect(e).toHaveProperty('contraseña');
    expect(e).toHaveProperty('confirmar');
  });
});
