import React from "react";

const Perfil: React.FC = () => {
  const horasTransmision = 12; // streamer
  const nivel = 5;
  const puntos = 230;
  const progreso = 70; // porcentaje para siguiente nivel

  return (
    <div>
      <h2>Perfil</h2>
      <p>Nivel: {nivel}</p>
      <p>Puntos: {puntos}</p>
      <p>Horas de transmisión: {horasTransmision}</p>
      <div style={{ background: "#ccc", width: "100%", height: "20px", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ background: "green", width: `${progreso}%`, height: "100%" }}></div>
      </div>
    </div>
  );
};

export default Perfil;
