import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Dialogo({ user }) {
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [conversacion, setConversacion] = useState([]);
  const navigate = useNavigate();

  const handleEnviar = () => {
    if (!mensaje.trim()) return;

    const nuevoMensaje = { remitente: "usuario", texto: mensaje };
    setConversacion([...conversacion, nuevoMensaje]);
    setMensaje("");

    // Respuesta automática
    setTimeout(() => {
      let respuesta = "";
      if (mensaje.toLowerCase().includes("reserv")) {
        respuesta = "✅ Tu solicitud de reserva ha sido registrada. Un agente confirmará en breve.";
      } else if (mensaje.toLowerCase().includes("hola")) {
        respuesta = "👋 ¡Hola! ¿En qué puedo ayudarte hoy?";
      } else {
        respuesta = "💬 Gracias por tu consulta. Te responderemos pronto.";
      }

      setConversacion((prev) => [...prev, { remitente: "bot", texto: respuesta }]);
    }, 1000);
  };

  const handleClickGlobito = () => {
    if (!user) {
      // Si no hay usuario, redirige a login
      navigate("/login");
    } else {
      setOpen(!open);
    }
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <Button
          variant="primary"
          className="rounded-circle p-3 shadow"
          onClick={handleClickGlobito}
        >
          💬
        </Button>
      </div>

      {/* VENTANA DE DIÁLOGO */}
      {open && user && (
        <Card
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            borderRadius: "15px",
          }}
        >
          <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
            <span>Chat con Refugio</span>
            <Button
              size="sm"
              variant="light"
              onClick={() => setOpen(false)}
              style={{ borderRadius: "50%" }}
            >
              ✖
            </Button>
          </Card.Header>

          <Card.Body style={{ maxHeight: "250px", overflowY: "auto" }}>
            {conversacion.map((msg, i) => (
              <div
                key={i}
                className={`d-flex ${
                  msg.remitente === "usuario" ? "justify-content-end" : "justify-content-start"
                } mb-2`}
              >
                <div
                  className={`p-2 rounded ${
                    msg.remitente === "usuario" ? "bg-primary text-white" : "bg-light text-dark"
                  }`}
                  style={{ maxWidth: "80%" }}
                >
                  {msg.texto}
                </div>
              </div>
            ))}
          </Card.Body>

          <Card.Footer>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleEnviar();
              }}
            >
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Escribe tu mensaje..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                />
                <Button variant="primary" type="submit" className="ms-2">
                  ➤
                </Button>
              </div>
            </Form>
          </Card.Footer>
        </Card>
      )}
    </>
  );
}
