import React from "react";
import Footer from "../components/Footer.jsx";
import { Carousel, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import SaltaImg from "../assets/salta.jpg"; 

export default function QuienesSomos() {
  const imagenesCarrusel = [
    "https://robledo.website/patas/1.jpg",
    "https://robledo.website/patas/2.jpg",
    "https://robledo.website/patas/3.jpg",
    "https://robledo.website/patas/4.jpg",
    "https://robledo.website/patas/5.jpg",
  ];

  const frasesCarrusel = [
    "Comodidad y tranquilidad en cada rincón",
    "Experiencias inolvidables para nuestros huéspedes",
    "Servicio personalizado que te hace sentir como en casa",
    "Descubre tu refugio ideal en el corazón de la ciudad",
    "Un lugar donde cada detalle importa",
  ];

  const beneficios = [
    { icono: "🏆", titulo: "Más de 15 años de experiencia", descripcion: "Hemos brindado hospedaje de calidad y experiencias inolvidables a miles de clientes desde 2010." },
    { icono: "🛏️", titulo: "Habitaciones confortables", descripcion: "Cada habitación está diseñada con atención al detalle, comodidad y estilo moderno para tu descanso." },
    { icono: "🍽️", titulo: "Gastronomía de calidad", descripcion: "Nuestros desayunos y cenas ofrecen productos frescos y recetas locales que deleitan a nuestros huéspedes." },
    { icono: "💼", titulo: "Ideal para negocios y turismo", descripcion: "Salas de reuniones, wifi de alta velocidad y ubicación estratégica hacen de nuestro hotel tu mejor opción." },
  ];

  const testimonios = [
    { nombre: "Laura G.", comentario: "¡Increíble experiencia! La atención del personal y la comodidad de la habitación superaron mis expectativas." },
    { nombre: "Carlos M.", comentario: "Un hotel con encanto y detalles que marcan la diferencia. Volveré sin dudas." },
    { nombre: "Sofía P.", comentario: "Las vistas y la limpieza impecable hicieron de nuestra estadía algo inolvidable." },
    { nombre: "Martín R.", comentario: "Servicio excelente y ubicación perfecta. Recomendado para viajes de negocios y turismo." },
    { nombre: "Lucía F.", comentario: "Me encantó la decoración y la gastronomía. Todo cuidado al detalle." },
    { nombre: "Diego T.", comentario: "Ideal para desconectar. Habitaciones amplias y muy cómodas." },
  ];

  // Crear grupos de 3 testimonios por slide
  const gruposTestimonios = [];
  for (let i = 0; i < testimonios.length; i += 3) {
    gruposTestimonios.push(testimonios.slice(i, i + 3));
  }

  return (
    <div>
      {/* HERO / PRINCIPIO IMPACTANTE */}
      <section
        className="text-white text-center d-flex align-items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.2)), url(${SaltaImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "70vh",
        }}
      >
        <div className="container p-5">
          <h1 style={{ fontWeight: 700, fontSize: "3rem", textShadow: "2px 2px 6px rgba(0,0,0,0.7)" }}>
            Bienvenido a <span style={{ color: "#ff7f32" }}>Hotel Refugio</span>
          </h1>
          <p className="lead" style={{ fontSize: "1.3rem", maxWidth: "600px", margin: "20px auto", textShadow: "1px 1px 5px rgba(0,0,0,0.5)" }}>
            Tu refugio ideal en el corazón de la ciudad. Descansá, disfrutá y viví experiencias inolvidables en cada estancia.
          </p>
          <Link
            to="/"
            className="btn btn-lg mt-3"
            style={{
              backgroundColor: "#ff7f32",
              color: "#fff",
              borderRadius: "10px",
              fontWeight: 600,
              padding: "12px 35px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
            }}
          >
            Reservá Ahora
          </Link>
        </div>
      </section>

      {/* CARRUSEL DE IMÁGENES */}
      <section className="container mt-5 mb-5">
        <Carousel fade interval={4000} pause={false} style={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}>
          {imagenesCarrusel.map((img, index) => (
            <Carousel.Item key={index}>
              <img
                src={img}
                className="d-block w-100"
                alt={`Imagen ${index + 1}`}
                style={{ objectFit: "cover", height: "450px" }}
              />
              <Carousel.Caption>
                <h5 style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "inline-block",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: 500
                }}>
                  {frasesCarrusel[index]}
                </h5>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* BENEFICIOS / DATOS RELEVANTES */}
      <section className="container mb-5">
        <h2 className="text-center mb-4" style={{ color: "#ff7f32", fontWeight: 700 }}>Por qué elegirnos</h2>
        <Row className="g-4">
          {beneficios.map((item, idx) => (
            <Col md={6} lg={3} key={idx}>
              <Card className="h-100 text-center shadow-sm border-0 hover-shadow">
                <Card.Body>
                  <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>{item.icono}</div>
                  <Card.Title style={{ fontWeight: 600 }}>{item.titulo}</Card.Title>
                  <Card.Text style={{ color: "#555", fontSize: "0.95rem", marginTop: "10px" }}>
                    {item.descripcion}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* BLOQUE VISUAL / MAPA LATERAL */}
      <section className="container mb-5">
        <Row className="align-items-center g-4">
          <Col md={6}>
            <div className="rounded shadow overflow-hidden" style={{ height: "400px" }}>
              <iframe
                title="Ubicación Hotel Alejandro I"
                src="https://www.google.com/maps?q=Hotel+Alejandro+I+Salta&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </Col>

          <Col md={6}>
            <h3 style={{ color: "#ff7f32", fontWeight: 700 }}>Experiencias únicas en cada estancia</h3>
            <p style={{ color: "#555", lineHeight: 1.7, marginTop: "15px" }}>
              Cada rincón de nuestro hotel está pensado para que te sientas como en casa. Disfrutá de espacios cómodos, vistas increíbles y un servicio que supera expectativas.
            </p>
            <ul style={{ color: "#555", lineHeight: 1.7 }}>
              <li>Ambientes climatizados y modernos</li>
              <li>Servicio de limpieza diario</li>
              <li>Ubicación céntrica, cerca de los principales atractivos</li>
              <li>Actividades recreativas para toda la familia</li>
            </ul>
            <Link
              to="/"
              className="btn btn-lg mt-3"
              style={{
                backgroundColor: "#ff7f32",
                color: "#fff",
                borderRadius: "10px",
                fontWeight: 600,
                padding: "12px 35px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
              }}
            >
              Reserva tu estadía ahora
            </Link>
          </Col>
        </Row>
      </section>


      {/* CARRUSEL DE TESTIMONIOS MULTI-ITEM */}
      <section className="container mb-5">
        <h2 className="text-center mb-4" style={{ color: "#ff7f32", fontWeight: 700 }}>Lo dicen nuestros huéspedes</h2>
        <Carousel fade interval={2500} pause={false} indicators={false}>
          {gruposTestimonios.map((grupo, idx) => (
            <Carousel.Item key={idx}>
              <Row className="g-4 justify-content-center" style={{ minHeight: "250px" }}>
                {grupo.map((t, i) => (
                  <Col md={4} key={i}>
                    <Card className="shadow-sm p-3 h-100" style={{ borderRadius: "15px", height: "250px" }}>
                      <Card.Body>
                        <Card.Text style={{ fontStyle: "italic", color: "#555", fontSize: "1rem" }}>
                          "{t.comentario}"
                        </Card.Text>
                        <Card.Subtitle className="mt-3" style={{ fontWeight: 600, color: "#ff7f32" }}>
                          - {t.nombre}
                        </Card.Subtitle>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* CTA FINAL / INVITACIÓN A RESERVAR */}
      <section className="container text-center mb-5">
        <h3 style={{ color: "#ff7f32", fontWeight: 700 }}>No esperes más, tu refugio ideal te espera</h3>
        <p style={{ color: "#555", fontSize: "1.1rem" }}>
          Reservá hoy y disfrutá de la mejor experiencia de hospedaje en la ciudad.
        </p>
        <Link
          to="/"
          className="btn btn-lg mt-3"
          style={{
            backgroundColor: "#ff7f32",
            color: "#fff",
            borderRadius: "10px",
            fontWeight: 600,
            padding: "12px 35px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
        >
          Reserva Ahora
        </Link>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
