import React from "react";

export default function AdminPage({ user }) {
  return (
    <div className="container mt-5">
      <h1>Bienvenido Admin, {user.nombre}</h1>
      <p>Este es el contenido exclusivo para administradores.</p>
    </div>
  );
}

