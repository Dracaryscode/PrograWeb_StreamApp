import React from "react";
import inicio from "../assets/inicio.png";
import nosotros from "../assets/nosotros.png";
import tienda from "../assets/tienda.png";
import terminos from "../assets/terminos.png";
import perfilImg from "../assets/perfil.jpg"; // Imagen de perfil

import "./Sidebar.css";

interface SidebarProps {
  onNavigate: (page: string) => void;
}

const recommendations = [
  { id: 1, name: "Canal 1", img: perfilImg, live: true },
  { id: 2, name: "Canal 2", img: perfilImg, live: false },
];

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  return (
    <aside className="sidebar">
      <ul>
        <li onClick={() => onNavigate("home")}>
          <img src={inicio} alt="inicio" />
          <span>Inicio</span>
        </li>
        <li onClick={() => onNavigate("perfil")}>
          <img src={inicio} alt="perfil" />
          <span>Perfil</span>
        </li>
        <li onClick={() => onNavigate("tienda")}>
          <img src={tienda} alt="tienda" />
          <span>Tienda</span>
        </li>
        <li onClick={() => onNavigate("nosotros")}>
          <img src={nosotros} alt="nosotros" />
          <span>Nosotros</span>
        </li>
        <li onClick={() => onNavigate("tyc")}>
          <img src={terminos} alt="tyc" />
          <span>T & C</span>
        </li>
      </ul>

      <hr className="divider" />

      <div className="recommendations">
        <h4>Recomendaciones</h4>
        {recommendations.map((rec) => (
          <div key={rec.id} className="recommendation-item">
            <img src={rec.img} alt={rec.name} />
            <span className="mini-stream-name">{rec.name}</span>
            {rec.live && <span className="live-circle"></span>}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
