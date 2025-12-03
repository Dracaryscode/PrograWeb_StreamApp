import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import perfilImg from "../assets/perfil.jpg";
import perfilAlt1 from "../assets/Perfil/perfil1.png";
import perfilAlt2 from "../assets/Perfil/perfil2.png";
import notiImg from "../assets/noti.png";
import LevelUpNotification from "./LevelUpNotification";

interface HeaderProps {
  onLogin: () => void;
  onRegister: () => void;
  user: any;
}

const Header: React.FC<HeaderProps> = ({ onLogin, onRegister, user }) => {
  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const avatarMap = {
    perfil: perfilImg,
    perfil1: perfilAlt1,
    perfil2: perfilAlt2,
  };
  const avatarSrc = user ? avatarMap[user.avatarKey as keyof typeof avatarMap] ?? perfilImg : perfilImg;

  // Datos simulados del Espectador
  const nivel = 5;
  const puntos = 230;
  const puntosSiguienteNivel = 300;
  const faltan = puntosSiguienteNivel - puntos;
  const progreso = (puntos / puntosSiguienteNivel) * 100;

  const getLevelUpMessage = () => {
    if (!user) return "";
    if (user.role === "usuario") return "¡Subiste de nivel!"; // "usuario" o "espectador" según tu api
    if (user.role === "streamer") return "¡Subiste de nivel por horas de tu audiencia!";
    return "";
  };

  return (
    <header className="header" style={{ position: "relative" }}>
      <div className="header-logo">
        <Link to="/">
          <img src={logo} alt="Liky Logo" />
        </Link>
      </div>

      {/* ✨ CORRECCIÓN: Esta barra ahora solo se muestra si NO es streamer (es decir, espectadores) */}
      {user && user.role !== "streamer" && (
        <div className="header-saldo" style={{ textAlign: "center", minWidth: "200px" }}>
          <span style={{color: "#e6dff7", fontWeight: "bold"}}>
             Nivel {nivel} ({puntos} pts)
          </span>
          <div style={{ fontSize: "0.8rem", color: "#a381f9" }}>
            Faltan {faltan} pts para el nivel {nivel + 1}
          </div>
          <div
            style={{
              backgroundColor: "#333",
              borderRadius: "10px",
              height: "6px",
              width: "100%",
              marginTop: "5px",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: `${progreso}%`,
                height: "100%",
                backgroundColor: "#9f64ff",
                borderRadius: "10px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      )}

      {/* Si es Streamer, quizás solo mostramos un saludo simple o nada */}
      {user?.role === "streamer" && (
         <div className="header-saldo" style={{color: "#9f64ff", fontWeight: "bold"}}>
            Modo Streamer 📡
         </div>
      )}

      <div className="header-search-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="header-search"
          style={{ backgroundColor: "#0b0b10", color: "white", borderColor: "#333" }}
        />
      </div>

      <div className="header-buttons flex gap-2 items-center">
        {!user ? (
          <>
            <button onClick={onLogin} className="btn-login">Iniciar sesión</button>
            <button onClick={onRegister} className="btn-register">Registrarse</button>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "15px", position: "relative" }}>
            
            {/* Botones de acción Streamer */}
            {user.role === "streamer" && (
              <>
                <Link
                  to="/dashboard"
                  style={{ textDecoration: "none", color: "#a381f9", fontWeight: "bold", fontSize: "0.9rem" }}
                >
                  Dashboard
                </Link>
                <button
                  style={{
                    backgroundColor: "#9f64ff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  🎥 Go Live
                </button>
              </>
            )}

            {/* Perfil y Nombre */}
            <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
               <img
                 src={avatarSrc}
                 alt="Perfil"
                 style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "2px solid #9f64ff" }}
               />
               <span style={{ fontWeight: "bold", color: "white" }}>{user.name}</span>
            </div>

            {/* Notificaciones */}
            <button
              onClick={() => setShowNotif(!showNotif)}
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
            >
              <img src={notiImg} alt="Notificación" style={{ width: "24px", height: "24px", filter: "invert(1)" }} />
            </button>

            {showNotif && (
              <LevelUpNotification
                onClose={() => setShowNotif(false)}
                message={getLevelUpMessage()}
              />
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
