// Componente: SearchForm
// Este componente es solo presentacional y encapsula la UI del formulario de búsqueda.
// No filtra habitaciones ni calcula precios; solo notifica al padre de los cambios.

import React from "react";

export default function SearchForm({ 
  checkIn,
  checkOut,
  personas,
  onCheckInChange,
  onCheckOutChange,
  onPersonasChange,
  onSearchClick
}) {
  return (
    <section id="busqueda" className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <h2 className="text-center mb-4">Buscar Habitaciones</h2>
        <div className="row mb-4 g-3">
          {/* Check-in */}
          <div className="col-md-3">
            <label>Check-in</label>
            <input
              type="date"
              className="form-control"
              value={checkIn ? checkIn.toISOString().split("T")[0] : ""}
              onChange={(e) => onCheckInChange(e.target.value)}
            />
          </div>

          {/* Check-out */}
          <div className="col-md-3">
            <label>Check-out</label>
            <input
              type="date"
              className="form-control"
              value={checkOut ? checkOut.toISOString().split("T")[0] : ""}
              onChange={(e) => onCheckOutChange(e.target.value)}
            />
          </div>

          {/* Personas */}
          <div className="col-md-3">
            <label>Personas</label>
            <input
              type="number"
              className="form-control"
              min={1}
              value={personas}
              onChange={(e) => onPersonasChange(Number(e.target.value))}
            />
          </div>

          {/* Botón Buscar */}
          <div className="col-md-3 d-flex align-items-end">
            <button
              className="btn btn-lg w-100"
              style={{ backgroundColor: "#ff7f32", border: "none" }}
              onClick={() => onSearchClick({ checkIn, checkOut, personas })}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
