import React from "react";
import "../index.css"; // usa los estilos globales ya existentes

import hombre1 from "../assets/miembros/hombre1.png";
import hombre2 from "../assets/miembros/hombre2.png";
import hombre3 from "../assets/miembros/hombre3.png";
import mujer1 from "../assets/miembros/mujer1.png";
import mujer2 from "../assets/miembros/mujer2.png";

const miembros = [
  { nombre: "Antony", foto: hombre1 },
  { nombre: "Priscila", foto: mujer1 },
  { nombre: "Yadira", foto: mujer2 },
  { nombre: "Kevin", foto: hombre2 },
  { nombre: "Fabrizio", foto: hombre3 },
];

const Nosotros: React.FC = () => {
  return (
    <div className="app" style={{ padding: "40px 20px", textAlign: "center" }}>
      <h1 style={{ color: "#9f64ff", fontSize: "2.5rem", marginBottom: "20px" }}>
        Nosotros
      </h1>

      <p
        style={{
          color: "#cccccc",
          fontSize: "1.1rem",
          maxWidth: "700px",
          margin: "0 auto 50px auto",
          lineHeight: "1.6",
        }}
      >
        Somos un equipo apasionado por la tecnología y el entretenimiento digital. 
        Nuestro objetivo es ofrecer una plataforma de streaming moderna, accesible y 
        enfocada en conectar creadores con su comunidad. Cada miembro aporta su talento 
        para que tu experiencia sea única.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "40px",
        }}
      >
        {miembros.map((persona, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#14151B",
              borderRadius: "15px",
              padding: "20px",
              width: "180px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src={persona.foto}
              alt={persona.nombre}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "15px",
              }}
            />
            <h3 style={{ color: "#ffffff", margin: 0 }}>{persona.nombre}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Nosotros;

