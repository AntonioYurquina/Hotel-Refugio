import React, { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap"; // IMPORTAR Carousel
import { useNavigate } from "react-router-dom";

export function ModalReserva({
  show,
  handleClose,
  habitacionSeleccionada,
  checkIn,
  checkOut,
  setCheckIn,
  setCheckOut,
  calcularNoches,
  validarFechas,
  user,
}) {
  const navigate = useNavigate();
  const [showResumen, setShowResumen] = useState(false);

  const onReservarClick = () => {
    if (user && user.nombre) {
      setShowResumen(true);
    } else {
      navigate("/login");
    }
  };

const handleConfirmarReserva = () => {
  setShowResumen(false);
  handleClose();

  alert(
    "¡Reserva solicitada correctamente!\n\n" +
    "Uno de nuestros operadores se pondrá en contacto con usted lo más pronto posible.\n\n" +
    "La solicitud de reserva ya se encuentra registrada y puede ver su estado en su perfil de usuario."
  );
};


  if (!habitacionSeleccionada) return null;

  return (
    <>
      {/* MODAL PRINCIPAL */}
      <Modal show={show} onHide={handleClose} size="lg" centered>
        {/* Carrusel arriba */}
        <Carousel indicators={true} interval={3000}>
          {habitacionSeleccionada.imagenes.map((img, idx) => (
            <Carousel.Item key={idx}>
              <img
                src={img}
                alt={`${habitacionSeleccionada.tipo} ${idx}`}
                className="d-block w-100"
                style={{ height: "300px", objectFit: "cover" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        {/* Información relevante debajo */}
        <Modal.Header closeButton>
        <Modal.Title>{habitacionSeleccionada.tipo}</Modal.Title>
        </Modal.Header>

        <style jsx>{`
        .btn-close {
            border: 1px solid #ff7f32; /* borde naranja */
            border-radius: 50%;          /* botón redondeado */
            background-color: rgba(255,127,50,0.1); /* fondo sutil */
            transition: all 0.2s ease;
        }

        .btn-close:hover {
            background-color: #ff7f32; /* fondo naranja al pasar el mouse */
            filter: brightness(1.2);
        }
        `}</style>

        <Modal.Body>
          <p><strong>Capacidad:</strong> {habitacionSeleccionada.capacidad} personas</p>
          <p><strong>Precio por noche:</strong> ${habitacionSeleccionada.precio_noche.toFixed(2)}</p>

          <div className="d-flex gap-3 mb-3">
            <input
              type="date"
              value={checkIn ? checkIn.toISOString().split("T")[0] : ""}
              onChange={e => setCheckIn(e.target.value ? new Date(e.target.value) : null)}
            />
            <input
              type="date"
              value={checkOut ? checkOut.toISOString().split("T")[0] : ""}
              onChange={e => setCheckOut(e.target.value ? new Date(e.target.value) : null)}
            />
          </div>

          {validarFechas(checkIn, checkOut) && (
            <p><strong>Total:</strong> ${(habitacionSeleccionada.precio_noche * calcularNoches(checkIn, checkOut)).toFixed(2)}</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            style={{ backgroundColor: "#ff7f32", border: "none" }}
            disabled={!validarFechas(checkIn, checkOut)}
            onClick={onReservarClick}
          >
            Reservar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL RESUMEN */}
        <Modal show={showResumen} onHide={() => setShowResumen(false)} size="md" centered>
        <Modal.Header closeButton>
            <Modal.Title>Detalle de Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
            <p><strong>Usuario:</strong> {user?.nombre}</p>
            <p><strong>Correo:</strong> {user?.email || "No disponible"}</p>
            <hr />
            <p><strong>Habitación:</strong> {habitacionSeleccionada.tipo} (Capacidad: {habitacionSeleccionada.capacidad} personas)</p>
            <p><strong>Fechas:</strong> {checkIn?.toLocaleDateString()} → {checkOut?.toLocaleDateString()}</p>
            <hr />
            {validarFechas(checkIn, checkOut) && (
                (() => {
                const noches = calcularNoches(checkIn, checkOut);
                const precioNoche = habitacionSeleccionada.precio_noche;
                const subtotal = noches * precioNoche;
                const impuestos = subtotal * 0.21; // ejemplo: IVA 21%
                const total = subtotal + impuestos;

                return (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                        <tr>
                        <td>Noches</td>
                        <td style={{ textAlign: "right" }}>{noches}</td>
                        </tr>
                        <tr>
                        <td>Precio por noche</td>
                        <td style={{ textAlign: "right" }}>${precioNoche.toFixed(2)}</td>
                        </tr>
                        <tr>
                        <td>Subtotal</td>
                        <td style={{ textAlign: "right" }}>${subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                        <td>Impuestos (21%)</td>
                        <td style={{ textAlign: "right" }}>${impuestos.toFixed(2)}</td>
                        </tr>
                        <tr style={{ fontWeight: "bold", borderTop: "1px solid #ccc" }}>
                        <td>Total</td>
                        <td style={{ textAlign: "right" }}>${total.toFixed(2)}</td>
                        </tr>
                    </tbody>
                    </table>
                );
                })()
            )}
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowResumen(false)}>Cancelar</Button>
            <Button style={{ backgroundColor: "#ff7f32", border: "none" }} onClick={handleConfirmarReserva}>
            Confirmar
            </Button>
        </Modal.Footer>
        </Modal>

    </>
  );
}
