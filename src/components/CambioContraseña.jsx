import React, { useState } from "react";
import { Button, Modal, Form, Alert, ProgressBar, Spinner } from "react-bootstrap";

export default function CambioContraseña({ user }) {
  const [show, setShow] = useState(false);
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [nivel, setNivel] = useState(0);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setNueva("");
    setConfirmar("");
    setError("");
    setSuccess("");
    setNivel(0);
  };

  const calcularNivel = (pass) => {
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[\W]/.test(pass)) score += 1;
    setNivel(score);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (nueva !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (nivel < 2) {
      setError("La contraseña es demasiado débil");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://robledo.website/usuarios/${user.id_usuario}/cambiarContrasena`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contraseña: nueva }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Contraseña actualizada correctamente");
        setTimeout(handleClose, 1500);
      } else {
        setError(data.error || data.message || "Error al cambiar contraseña");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const getNivelTexto = () => {
    switch (nivel) {
      case 0: return "Muy débil";
      case 1: return "Débil";
      case 2: return "Media";
      case 3: return "Fuerte";
      case 4: return "Muy fuerte";
      default: return "";
    }
  };

  const getNivelColor = () => {
    switch (nivel) {
      case 0:
      case 1: return "danger";
      case 2: return "warning";
      case 3: return "info";
      case 4: return "success";
      default: return "secondary";
    }
  };

  return (
    <div className="text-center mt-2">
      <Button
        variant="warning"
        onClick={handleShow}
        className="shadow-sm px-4 py-2 rounded-pill"
        style={{ background: "linear-gradient(90deg, #ff7f50, #ffb347)", border: "none" }}
      >
        Cambiar Contraseña
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={nueva}
                onChange={(e) => {
                  setNueva(e.target.value);
                  calcularNivel(e.target.value);
                }}
                placeholder="Ingresa nueva contraseña"
                required
              />
            </Form.Group>

            <ProgressBar now={(nivel/4)*100} variant={getNivelColor()} className="mb-2" />
            <div className="mb-3 text-end fw-semibold">{getNivelTexto()}</div>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="Repite la contraseña"
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 py-2 fw-bold text-white"
              style={{ background: "linear-gradient(90deg, #ff7f50, #ffb347)", border: "none" }}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Guardar Cambios"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
