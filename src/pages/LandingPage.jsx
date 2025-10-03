// src/pages/LandingPage.jsx
import SaltaImg from "../assets/salta.jpg"; // IMPORT CORRECTO
import Servicio1 from "../assets/servicio1.jpg";
import Servicio2 from "../assets/servicio2.jpg";
import Servicio3 from "../assets/servicio3.webp";




export default function LandingPage() {
  return (
    <div>
      {/* HERO */}
      
      <header
        className="bg-dark text-white text-center"
        style={{
          backgroundImage: `url(${SaltaImg})`, // USO DE LA IMAGEN IMPORTADA
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="container bg-dark bg-opacity-50 p-5 rounded">
          <h1 className="display-4">Hotel Refugio</h1>
          <p className="lead">
            Tu lugar ideal para descansar, disfrutar y crear recuerdos inolvidables.
          </p>
        </div>
      </header>

      {/* SECCIÓN DE NOSOTROS */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <div className="row align-items-center">
            
            <div className="col-md-6 mb-4 mb-md-0">
              <img
                src="https://robledo.website/patas/1.jpg"
                alt="Hotel Refugio"
                className="img-fluid rounded shadow-sm"
                style={{ objectFit: "cover", width: "100%", height: "400px" }}
              />

            </div>
            
            <div className="col-md-6">
              <h2 className="text-center text-md-start mb-4">¿Quiénes Somos?</h2>
              <p className="lead text-center text-md-start">
                En <strong>Hotel Refugio</strong> nos dedicamos a ofrecer experiencias únicas, 
                combinando confort, atención personalizada y un ambiente acogedor. 
                Nuestro objetivo es que cada huésped se sienta como en casa mientras 
                disfruta de nuestras instalaciones de primera calidad.
              </p>
              <p className="text-center text-md-start">
                Contamos con un equipo apasionado que se asegura de que tu estancia 
                sea inolvidable, desde el check-in hasta los momentos de relax.
              </p>
            </div>

          </div>
        </div>
      </section>



      {/* SECCIÓN DE SERVICIOS */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Nuestros Servicios</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <img
                  src="https://robledo.website/patas/2.jpg"
                  alt="Servicio1"
                  className="img-fluid rounded shadow-sm"
                  style={{ objectFit: "cover", width: "100%", height: "400px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">Habitaciones Confortables</h5>
                  <p className="card-text">
                    Disfruta de habitaciones espaciosas, modernas y completamente
                    equipadas para tu comodidad.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <img
                  src="https://robledo.website/patas/3.jpg"
                  alt="Servicio2"
                  className="img-fluid rounded shadow-sm"
                  style={{ objectFit: "cover", width: "100%", height: "400px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">Gastronomía Gourmet</h5>
                  <p className="card-text">
                    Saborea platos exquisitos preparados por nuestro equipo de chefs
                    con ingredientes locales de alta calidad.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <img
                  src="https://robledo.website/patas/4.jpg"
                  alt="Servicio3"
                  className="img-fluid rounded shadow-sm"
                  style={{ objectFit: "cover", width: "100%", height: "400px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">Spa & Relax</h5>
                  <p className="card-text">
                    Relájate en nuestro spa y disfruta de masajes, sauna y otras
                    terapias diseñadas para tu bienestar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SECCIÓN DE CONTACTO */}
      <section className="container my-5">
        <h2 className="text-center mb-4">Contacto</h2>
        <p className="text-center">
          Para reservas o consultas, comunicate con nosotros: <br />
          <strong>Tel:</strong> +54 387 123-4567 | <strong>Email:</strong>{" "}
          info@hotelrefugio.com
        </p>
      </section>

      <footer className="bg-dark text-white text-center py-3">
        &copy; {new Date().getFullYear()} Hotel Refugio. Urdininea🍆🍆🍆 & Yurquina
      </footer>
    </div>
  );
}

