import React, { useState } from "react";
import { Button, Modal, Form, Alert, Spinner } from "react-bootstrap";

export default function EditarPerfil({ user, setUser }) {
  const [show, setShow] = useState(false);
  const [nombre, setNombre] = useState(user.nombre);
  const [apellido, setApellido] = useState(user.apellido);
  const [email, setEmail] = useState(user.email);
  const [telefono, setTelefono] = useState(user.telefono || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [erroresCampos, setErroresCampos] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const validarCampos = () => {
    const errores = {};
    if (!nombre.trim()) errores.nombre = "El nombre es obligatorio";
    if (!apellido.trim()) errores.apellido = "El apellido es obligatorio";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errores.email = "Email inválido";
    if (telefono && !/^\d+$/.test(telefono)) errores.telefono = "Teléfono solo puede contener números";
    setErroresCampos(errores);
    return Object.keys(errores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setErroresCampos({});
    if (!validarCampos()) return;

    setLoading(true);
    try {
      const response = await fetch(`https://robledo.website/usuarios/${user.id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, email, "teléfono": telefono }),
      });
      const data = await response.json();
      if (response.ok) {
        const updatedUser = { ...user, nombre, apellido, email, telefono };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setSuccess("Perfil actualizado correctamente");
        setTimeout(() => setShow(false), 1500);
      } else {
        if (data.errors) {
          const fieldErrors = {};
          data.errors.forEach(err => { fieldErrors[err.field] = err.message; });
          setErroresCampos(fieldErrors);
        }
        setError(data.error || data.message || "Error al actualizar perfil");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <Button
        variant="warning"
        onClick={handleShow}
        className="shadow-sm px-4 py-2 rounded-pill"
        style={{ background: "linear-gradient(90deg, #ff7f50, #ffb347)", border: "none" }}
      >
        Editar Perfil
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                isInvalid={!!erroresCampos.nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa tu nombre"
                required
              />
              <Form.Control.Feedback type="invalid">{erroresCampos.nombre}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                value={apellido}
                isInvalid={!!erroresCampos.apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Ingresa tu apellido"
                required
              />
              <Form.Control.Feedback type="invalid">{erroresCampos.apellido}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                isInvalid={!!erroresCampos.email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tuemail@dominio.com"
                required
              />
              <Form.Control.Feedback type="invalid">{erroresCampos.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={telefono}
                isInvalid={!!erroresCampos.telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Opcional"
              />
              <Form.Control.Feedback type="invalid">{erroresCampos.telefono}</Form.Control.Feedback>
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

      <style>{`
        .text-center {
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
