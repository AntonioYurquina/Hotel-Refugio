// components/Hero.jsx
import React from "react";
import { Button } from "react-bootstrap";
import SaltaImg from "../assets/salta.jpg";

export default function Hero({ onReservarClick }) {
  return (
    <header
      className="text-white text-center position-relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(${SaltaImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="container p-5 rounded">
        <h1 
          style={{ 
            fontWeight: 700, 
            fontSize: "3rem", 
            textShadow: "2px 2px 6px rgba(0,0,0,0.7)" 
          }}
        >
          <span style={{ color: "#ff7f32" }}>Hotel Refugio</span>
        </h1>
        <p className="lead fs-4">
          Tu lugar ideal para descansar, disfrutar y crear recuerdos inolvidables.
        </p>
        
        {/* EL HIJO SOLO NOTIFICA AL PADRE */}
        <Button 
          className="btn-lg mt-3" 
          style={{ 
            backgroundColor: "#ff7f32", 
            border: "none",
            fontWeight: "600",
            padding: "12px 30px",
            fontSize: "1.1rem"
          }} 
          onClick={onReservarClick}
        >
          Reservar Ahora
        </Button>
        {/* ↑ "Oye papá, el usuario hizo click en reservar" */}
        {/* ↑ No sabe QUÉ hace el padre, solo le avisa */}
      </div>
    </header>
  );
}