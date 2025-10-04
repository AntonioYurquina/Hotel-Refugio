import React from "react";
import { Button, Table, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../components/Footer.jsx";

export default function UsuarioPage({ user }) {
  // Reservas simuladas del usuario
  const reservasUsuario = [
    { id: 1, habitacion: "Doble Deluxe", checkIn: "2025-10-05", checkOut: "2025-10-08", total: 285 },
    { id: 2, habitacion: "Suite Junior", checkIn: "2025-11-01", checkOut: "2025-11-03", total: 240 },
  ];

  const handleEditarPerfil = () => {
    alert("Función de editar perfil aún no implementada.");
  };

  const handleCerrarSesion = () => {
    alert("Sesión cerrada. Redirigiendo al login...");
    // Aquí podrías usar navigate("/login") si usas react-router
  };

  const handleNuevaReserva = () => {
    alert("Redirigiendo a la sección de reservas...");
    // navigate("/Hotel-Refugio") o ruta de reservas
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="container py-5">
        {/* Bienvenida + Botón */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <h1 className="mb-0">¡Bienvenido, {user.nombre}!</h1>
          <Button
            style={{ backgroundColor: "#ff7f32", border: "none" }}
            onClick={handleNuevaReserva}
            className="mt-2 mt-md-0"
          >
            Hacer Nueva Reserva
          </Button>
        </div>

        <p className="text-muted mb-5">Este es tu espacio exclusivo como usuario registrado.</p>

        {/* Perfil del usuario */}
        <Card className="mb-5 shadow-sm">
          <Card.Header style={{ backgroundColor: "#ff7f32", color: "#fff", fontWeight: "bold" }}>
            Información del Perfil
          </Card.Header>
          <Card.Body>
            <p><strong>Nombre:</strong> {user.nombre}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Tipo de usuario:</strong> Normal</p>
            <div className="d-flex gap-2 mt-3 flex-wrap">
              <Button variant="secondary" onClick={handleEditarPerfil}>Editar Perfil</Button>
              <Button variant="danger" onClick={handleCerrarSesion}>Cerrar Sesión</Button>
            </div>
          </Card.Body>
        </Card>

        {/* Reservas del usuario */}
        <h3 className="mb-3">Mis Reservas</h3>
        {reservasUsuario.length > 0 ? (
          <Table striped bordered hover responsive className="bg-white shadow-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Habitación</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total ($)</th>
              </tr>
            </thead>
            <tbody>
              {reservasUsuario.map((res) => (
                <tr key={res.id}>
                  <td>{res.id}</td>
                  <td>{res.habitacion}</td>
                  <td>{res.checkIn}</td>
                  <td>{res.checkOut}</td>
                  <td>{res.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-muted">No tenés reservas aún.</p>
        )}
      </div>


      {/* FOOTER */}
      <Footer />
    </div>
  );
}
