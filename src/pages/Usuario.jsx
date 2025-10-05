import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col, Table, Badge, Spinner, Image } from "react-bootstrap";
import Footer from "../components/Footer.jsx";
import EditarPerfil from "../components/EditarPerfil.jsx";
import FotoPerfil from "../components/FotoPerfil.jsx";
import CambioContraseña from "../components/CambioContraseña.jsx";


export default function UsuarioPage({ user, setUser }) {
  const [reservas, setReservas] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);

  // Subir imagen de perfil
  const handleFotoChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFotoPerfil(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const resHab = await fetch("https://robledo.website/habitaciones");
        const habitacionesData = await resHab.json();
        setHabitaciones(habitacionesData);

        const resReservas = await fetch(`https://robledo.website/reservas?id_usuario=${user.id_usuario}`);
        const reservasData = await resReservas.json();

        const reservasCompletas = reservasData.map((reserva) => {
          const habitacion = habitacionesData.find(h => h.id_habitacion === reserva.id_habitacion);
          return { ...reserva, habitacion };
        });

        setReservas(reservasCompletas);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las reservas. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const navigate = null; // Si quieres redirección usa useNavigate
  const handleCerrarSesion = () => {
    setUser(null);
    localStorage.removeItem("token"); // Opcional
    alert("Sesión cerrada correctamente. Redirigiendo al login...");
    if (navigate) navigate("/login");
  };

  const handleNuevaReserva = () => alert("Redirigiendo a la sección de reservas...");

  const renderEstado = (estado) => {
    switch (estado) {
      case "confirmada": return <Badge bg="success">{estado.toUpperCase()}</Badge>;
      case "pendiente": return <Badge bg="warning" text="dark">{estado.toUpperCase()}</Badge>;
      case "cancelada": return <Badge bg="danger">{estado.toUpperCase()}</Badge>;
      case "finalizada": return <Badge bg="secondary">{estado.toUpperCase()}</Badge>;
      default: return <Badge bg="dark">{estado.toUpperCase()}</Badge>;
    }
  };

  const mensajeReserva = (res) => {
    if (res.estado === "confirmada") {
      return `Tu reserva en ${res.habitacion?.tipo || "habitación"} está confirmada. Check-in: ${res.fecha_inicio}, Check-out: ${res.fecha_fin}. ¡Te esperamos!`;
    } 
    if (res.estado === "pendiente") return "Tu reserva está pendiente de confirmación.";
    if (res.estado === "cancelada") return "Tu reserva fue cancelada.";
    if (res.estado === "finalizada") return "Tu reserva finalizó.";
    return "";
  };

  const reservasActivas = reservas.filter(r => r.estado === "confirmada" || r.estado === "pendiente")
                                  .sort((a,b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio));
  const reservasHistoricas = reservas.filter(r => r.estado === "cancelada" || r.estado === "finalizada");

  return (
    <div style={{ backgroundColor: "#f4f5f7", minHeight: "100vh" }}>
      <div className="container py-5">

        {/* Bienvenida + foto de perfil */}
        <Row className="align-items-center mb-4">
          <Col md={8} className="d-flex align-items-center gap-3">
            <FotoPerfil user={user} setUser={setUser} />
            <div>
              <h1 style={{ fontWeight: "700", color: "#343a40" }}>¡Bienvenido, {user.nombre}!</h1>
              <p className="text-muted">
                Gestiona tus reservas y tu perfil desde aquí.
              </p>
            </div>
          </Col>
          <Col md={4} className="text-md-end mt-3 mt-md-0">
            <Button 
              style={{ backgroundColor: "#ff7f32", border: "none", fontWeight: "600", padding: "10px 20px" }} 
              onClick={handleNuevaReserva}
            >
              Hacer Nueva Reserva
            </Button>
          </Col>
        </Row>




        {/* Perfil */}
        <Card className="shadow-sm mb-5" style={{ borderRadius: "12px" }}>
          <Card.Header style={{ backgroundColor: "#ff7f32", color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}>
            Información del Perfil
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Nombre:</strong> {user.nombre} {user.apellido}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Tipo de usuario:</strong> {user.tipo_usuario}</p>
              </Col>
              <Col md={6} className="d-flex flex-column justify-content-center align-items-md-end gap-2 mt-3 mt-md-0">
                <EditarPerfil user={user} setUser={setUser} />
                <CambioContraseña user={user} /> {/* Botón de cambiar contraseña */}
              </Col>
            </Row>
          </Card.Body>
        </Card>


        {/* Estadía / Próxima reserva */}
        <h3 className="mb-3" style={{ fontWeight: "600", color: "#343a40" }}>Estadía Actual / Próxima</h3>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : reservasActivas.length === 0 ? (
          <p className="text-muted">No tienes reservas activas.</p>
        ) : (
          <Row className="mb-5">
            {reservasActivas.map(res => {
              const dias = Math.ceil((new Date(res.fecha_fin) - new Date(res.fecha_inicio)) / (1000*3600*24));
              const total = res.habitacion ? (res.habitacion.precio_noche * dias).toFixed(2) : 0;
              const imgSrc = res.habitacion?.fotos?.[0] || "https://via.placeholder.com/400x200?text=Habitación";

              return (
                <Col md={6} lg={4} key={res.id_reserva} className="mb-4">
                  <Card className="shadow-sm h-100">
                    <Card.Img variant="top" src={imgSrc} style={{ height: "200px", objectFit: "cover" }} />
                    <Card.Body>
                      <Card.Title>{res.habitacion?.tipo || "Habitación"}</Card.Title>
                      <p><strong>Número:</strong> {res.habitacion?.numero || "N/A"}</p>
                      <p><strong>Check-in:</strong> {res.fecha_inicio}</p>
                      <p><strong>Check-out:</strong> {res.fecha_fin}</p>
                      <p><strong>Capacidad:</strong> {res.habitacion?.capacidad || "N/A"} personas</p>
                      <p><strong>Total:</strong> ${total}</p>
                      <p><strong>Estado:</strong> {renderEstado(res.estado)}</p>
                      <p className="mt-2">{mensajeReserva(res)}</p>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Reservas históricas */}
        <h3 className="mb-3" style={{ fontWeight: "600", color: "#343a40" }}>Reservas Históricas</h3>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : reservasHistoricas.length === 0 ? (
          <p className="text-muted">No hay reservas históricas.</p>
        ) : (
          <Table responsive hover className="bg-white shadow-sm rounded">
            <thead style={{ backgroundColor: "#ff7f32", color: "#fff" }}>
              <tr>
                <th>#</th>
                <th>Habitación</th>
                <th>Tipo</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total ($)</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservasHistoricas.map(res => {
                const dias = Math.ceil((new Date(res.fecha_fin) - new Date(res.fecha_inicio)) / (1000*3600*24));
                const total = res.habitacion ? (res.habitacion.precio_noche * dias).toFixed(2) : 0;
                return (
                  <tr key={res.id_reserva}>
                    <td>{res.id_reserva}</td>
                    <td>{res.habitacion?.numero || "N/A"}</td>
                    <td>{res.habitacion?.tipo || "N/A"}</td>
                    <td>{res.fecha_inicio}</td>
                    <td>{res.fecha_fin}</td>
                    <td>${total}</td>
                    <td>{renderEstado(res.estado)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}

      </div>

      <Footer />
    </div>
  );
}
