import React from "react";
import { useNavigate } from "react-router-dom";
import inicio from "../assets/inicio.png";
import nosotros from "../assets/nosotros.png";
import tienda from "../assets/tienda.png";
import terminos from "../assets/terminos.png";
import perfilImg from "../assets/perfil.jpg";
import "./Sidebar.css";

const recommendations = [
  { id: 1, name: "Canal 1", img: perfilImg, live: true },
  { id: 2, name: "Canal 2", img: perfilImg, live: false },
];

interface SidebarProps {
  user: any;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const goTo = (path: string) => navigate(path);

  return (
    <aside className="sidebar">
      <ul>
        <li onClick={() => goTo("/")}>
          <img src={inicio} alt="inicio" />
          <span>Inicio</span>
        </li>
        <li onClick={() => goTo("/perfil")}>
          <img src={inicio} alt="perfil" />
          <span>Perfil</span>
        </li>

        {/* Mostrar Tienda solo si es usuario */}
        {user?.role !== "streamer" && (
          <li onClick={() => goTo("/tienda")}>
            <img src={tienda} alt="tienda" />
            <span>Tienda</span>
          </li>
        )}
        {user?.role === "streamer" && (
          <li onClick={() => goTo("/gifts")}>
            {/* Puedes reusar la imagen de tienda o importar una nueva */}
            <img src={tienda} alt="regalos" /> 
            <span>Regalos</span>
          </li>
        )}

        <li onClick={() => goTo("/nosotros")}>
          <img src={nosotros} alt="nosotros" />
          <span>Nosotros</span>
        </li>
        <li onClick={() => goTo("/tyc")}>
          <img src={terminos} alt="tyc" />
          <span>T & C</span>
        </li>

        {user && (
          <li
            onClick={onLogout}
            style={{ marginTop: "20px", cursor: "pointer", color: "#ff5757", fontWeight: "bold" }}
          >
            🚪 Cerrar sesión
          </li>
        )}
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
