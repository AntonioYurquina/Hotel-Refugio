import React from "react";

export default function UsuarioPage({ user }) {
  return (
    <div className="container mt-5">
      <h1>Bienvenido, {user.nombre}</h1>
      <p>Este es el contenido exclusivo para usuarios normales.</p>
    </div>
  );
}

