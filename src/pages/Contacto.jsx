import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import emailjs from "@emailjs/browser"; // CORRECCIÓN: importar desde @emailjs/browser

export default function Contacto() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: ""
  });

  // Inicializar EmailJS (solo si quieres usar init global)
  // emailjs.init("cy-3jjDdw9Sr3ZLyU"); // opcional si ya pasás la Public Key en send

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_r4nbki4",       // Service ID
        "template_0q6td97",      // Template ID
        formData,
        "cy-3jjDdw9Sr3ZLyU"      // Public Key
      )
      .then((response) => {
        console.log("Mensaje enviado!", response.status, response.text);
        setShowModal(true);
        setFormData({ nombre: "", email: "", mensaje: "" });
      })
      .catch((err) => {
        console.error("Error al enviar el mensaje:", err);
        alert("Hubo un error al enviar el mensaje. Por favor, intentá nuevamente.");
      });
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center mb-3" style={{ color: "#ff7f32", fontWeight: 700 }}>
        Contacto
      </h1>
      <p className="text-center mb-4" style={{ color: "#555", fontSize: "1.1rem" }}>
        Podés escribirnos a <strong>info@hotelrefugio.com</strong> o llamarnos al <strong>+54 387 1234567</strong>.
      </p>

      <form className="mx-auto" style={{ maxWidth: "600px" }} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label" style={{ fontWeight: 600 }}>
            Nombre
          </label>
          <input 
            type="text" 
            className="form-control shadow-sm" 
            id="nombre" 
            placeholder="Ingresá tu nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label" style={{ fontWeight: 600 }}>
            Email
          </label>
          <input 
            type="email" 
            className="form-control shadow-sm" 
            id="email" 
            placeholder="Ingresá tu email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="mensaje" className="form-label" style={{ fontWeight: 600 }}>
            Mensaje
          </label>
          <textarea 
            className="form-control shadow-sm" 
            id="mensaje" 
            rows="4" 
            placeholder="Escribí tu mensaje aquí"
            value={formData.mensaje}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="text-center">
          <button 
            type="submit" 
            className="btn btn-lg" 
            style={{
              backgroundColor: "#ff7f32",
              color: "#fff",
              fontWeight: 600,
              padding: "10px 40px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
            }}
          >
            Enviar Mensaje
          </button>
        </div>
      </form>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mensaje Enviado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¡Gracias por contactarnos! Te responderemos a la brevedad.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
