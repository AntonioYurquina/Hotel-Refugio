import React from "react";

export default function Contacto() {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Contacto</h1>
      <p className="text-center">Podés escribirnos a <strong>info@hotelrefugio.com</strong> o llamarnos al <strong>+54 387 1234567</strong>.</p>
      <form className="mt-4">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input type="text" className="form-control" id="nombre" />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" />
        </div>
        <div className="mb-3">
          <label htmlFor="mensaje" className="form-label">Mensaje</label>
          <textarea className="form-control" id="mensaje" rows="3"></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Enviar</button>
      </form>
    </div>
  );
}

