import React from "react";
import { Row, Col, Card, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Servicios() {
  const navigate = useNavigate();

  const serviciosPrincipales = [
    { titulo: "Habitaciones Cómodas", descripcion: "Elegantes habitaciones con mobiliario de calidad y ropa de cama premium.", imagen: "https://robledo.website/1.jpg" },
    { titulo: "Desayuno Gourmet", descripcion: "Productos frescos y locales para empezar tu día con sabor y estilo.", imagen: "https://robledo.website/2.jpg" },
    { titulo: "Wi-Fi de Alta Velocidad", descripcion: "Conexión disponible en todas las instalaciones, ideal para trabajo y ocio.", imagen: "https://robledo.website/3.jpg" },
    { titulo: "Piscina y Spa", descripcion: "Piscina de diseño y tratamientos de spa que revitalizan cuerpo y mente.", imagen: "https://robledo.website/6.jpg" },
  ];

  const serviciosAdicionales = [
    { titulo: "Sala de Reuniones", descripcion: "Espacios equipados para reuniones corporativas y talleres.", imagen: "https://robledo.website/4.jpg" },
    { titulo: "Eventos y Celebraciones", descripcion: "Organizamos bodas, aniversarios y eventos corporativos.", imagen: "https://robledo.website/5.jpg" },
    { titulo: "Gimnasio y Entrenamiento", descripcion: "Gimnasio moderno con entrenadores especializados.", imagen: "https://robledo.website/7.jpg" },
    { titulo: "Transporte Privado", descripcion: "Traslados a aeropuertos y excursiones, coordinados con el hotel.", imagen: "https://robledo.website/8.jpg" },
    { titulo: "Restaurante Exclusivo", descripcion: "Platos gourmet en un ambiente elegante. Reserva tu mesa.", imagen: "https://robledo.website/9.jpg" },
  ];

  const imgHeight = "200px";

  return (
    <>
      <Container className="my-5">
        <h1 className="text-center mb-4">Nuestros Servicios</h1>

        {/* Servicios principales */}
        <Row className="g-4 mb-5">
          {serviciosPrincipales.map((s, idx) => (
            <Col md={6} key={idx}>
              <Card className="h-100 shadow-sm">
                <Card.Img variant="top" src={s.imagen} style={{ height: imgHeight, objectFit: "cover" }} />
                <Card.Body>
                  <Card.Title>{s.titulo}</Card.Title>
                  <Card.Text>{s.descripcion}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <h2 className="text-center mb-4">Servicios Adicionales</h2>

        {/* Aclaración sobre servicios adicionales */}
<p className="text-center mb-3" style={{ color: "#555", fontStyle: "italic" }}>
  Nota: Los servicios adicionales se solicitan únicamente a través de nuestra <strong>página de contacto</strong>.
</p>

      {/* Servicios adicionales */}
      <Row className="g-4 mb-5">
        {serviciosAdicionales.map((s, idx) => (
          <Col md={4} key={idx}>
            <Card className="h-100 shadow-sm">
              <Card.Img 
                variant="top" 
                src={s.imagen} 
                style={{ height: imgHeight, objectFit: "cover" }} 
              />
              <Card.Body>
                <Card.Title>{s.titulo}</Card.Title>
                <Card.Text>{s.descripcion}</Card.Text>
                <Button 
                  variant="warning" 
                  size="sm" 
                  onClick={() => navigate("/Contacto")}
                >
                  Contactar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      </Container>

      {/* FOOTER EXTENDIDO */}
      <footer className="text-white text-center py-4" style={{ backgroundColor: "#222", width: "100%" }}>
        <p className="mb-2">&copy; 2025 Hotel Refugio. Todos los derechos reservados.</p>
        <p className="mb-0">
          Síguenos en: 
          <a href="#" className="text-white mx-2">Facebook</a> | 
          <a href="#" className="text-white mx-2">Instagram</a> | 
          <a href="#" className="text-white mx-2">Twitter</a>
        </p>
      </footer>
    </>
  );
}
