import React from 'react';

// Usuarios de la base de demostración (ver supabase/schema.sql)
const CUENTAS_DEMO = [
  { rol: 'Cliente', email: 'lucia.fernandez@example.com' },
  { rol: 'Operador', email: 'operador@hotelrefugio.example' },
  { rol: 'Administrador', email: 'admin@hotelrefugio.example' },
];
const CLAVE_DEMO = 'demo1234';

export default function CuentasDemo({ onElegir, roles }) {
  const cuentas = roles ? CUENTAS_DEMO.filter(c => roles.includes(c.rol)) : CUENTAS_DEMO;
  return (
    <div className="border rounded p-3 mt-4">
      <p className="small text-muted mb-2">
        Cuentas de demostración (contraseña <code>{CLAVE_DEMO}</code>). Elegí una para completar los datos:
      </p>
      <div className="d-flex flex-wrap gap-2">
        {cuentas.map(cuenta => (
          <button
            key={cuenta.email}
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => onElegir(cuenta.email, CLAVE_DEMO)}
          >
            {cuenta.rol}
          </button>
        ))}
      </div>
    </div>
  );
}
