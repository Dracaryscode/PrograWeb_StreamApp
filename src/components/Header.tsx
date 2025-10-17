import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import perfilImg from "../assets/perfil.jpg";
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

  const saldoMonedas = 120;
  const nivel = 5;
  const puntos = 230;
  const puntosSiguienteNivel = 300;
  const faltan = puntosSiguienteNivel - puntos;
  const progreso = (puntos / puntosSiguienteNivel) * 100;

  // Mensaje dinámico según rol
  const getLevelUpMessage = () => {
    if (!user) return "";
    if (user.role === "usuario") return "¡Subiste de nivel!";
    if (user.role === "streamer") return "¡Subiste de nivel por horas de tu audiencia!";
    return "";
  };

  return (
    <header className="header" style={{ position: "relative" }}>
      <div className="header-logo">
        <img src={logo} alt="Liky Logo" />
      </div>

      {/* Saldo solo streamer */}
      {user?.role === "streamer" && (
        <div className="header-saldo" style={{ textAlign: "center" }}>
          <span>💰 {saldoMonedas} | Nivel {nivel} ({puntos} pts)</span>
          <div style={{ fontSize: "0.9rem", color: "#6b46c1" }}>
            Faltan {faltan} pts para el nivel {nivel + 1}
          </div>
          <div
            style={{
              backgroundColor: "#ddd",
              borderRadius: "10px",
              height: "8px",
              width: "100%",
              marginTop: "5px",
            }}
          >
            <div
              style={{
                width: `${progreso}%`,
                height: "8px",
                backgroundColor: "#6b46c1",
                borderRadius: "10px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      )}

      <div className="header-search-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="header-search"
        />
      </div>

      <div className="header-buttons flex gap-2 items-center">
        {!user ? (
          <>
            <button onClick={onLogin} className="btn-login">Iniciar sesión</button>
            <button onClick={onRegister} className="btn-register">Registrarse</button>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative" }}>
            <img
              src={perfilImg}
              alt="Perfil"
              style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" }}
            />
            <span style={{ fontWeight: "bold" }}>{user.name}</span>

            {/* Go Live y Dashboard solo streamer */}
            {user.role === "streamer" && (
              <>
                <Link
                  to="/dashboard"
                  className="px-3 py-1 rounded-md text-sm font-semibold text-blue-600 hover:text-white hover:bg-blue-600 transition"
                >
                  Dashboard
                </Link>
                <button
                  style={{
                    backgroundColor: "#9f64ff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "10px 20px",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  🎥 Go Live
                </button>
              </>
            )}

            {/* Botón de notificación */}
            <button
              onClick={() => setShowNotif(!showNotif)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <img src={notiImg} alt="Notificación" style={{ width: "30px", height: "30px" }} />
            </button>

            {/* Mostrar gui de nivel */}
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
