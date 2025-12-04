import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import perfilImg from "../assets/perfil.jpg";
import perfilAlt1 from "../assets/Perfil/perfil1.png";
import perfilAlt2 from "../assets/Perfil/perfil2.png";
import notiImg from "../assets/noti.png";
import LevelUpNotification from "./LevelUpNotification";
import { api } from "../services/api";
import { useAuth } from "../app/auth";

interface HeaderProps {
  onLogin: () => void;
  onRegister: () => void;
  user: any;
}

const Header: React.FC<HeaderProps> = ({ onLogin, onRegister, user }) => {
  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [viewerProgress, setViewerProgress] = useState<{ nivel: number; puntos: number; siguiente: number; falta: number; pct: number } | null>(null);
  const [viewerSaldo, setViewerSaldo] = useState<number | null>(null);
  const { tokens } = useAuth();

  const avatarMap = {
    perfil: perfilImg,
    perfil1: perfilAlt1,
    perfil2: perfilAlt2,
  };
  const avatarSrc = user ? avatarMap[user.avatarKey as keyof typeof avatarMap] ?? perfilImg : perfilImg;

  useEffect(() => {
    let timeoutId: number | undefined;
    const loadProgress = async () => {
      const viewerId = (user?.perfilId ?? Number(import.meta.env.VITE_DEFAULT_VIEWER_ID ?? 0)) || null;

      // Sin viewerId no podemos refrescar, pero no borramos lo último mostrado.
      if (!viewerId) {
        return;
      }
      try {
        const [prog, saldo] = await Promise.allSettled([
          api.getViewerProgreso(viewerId, tokens?.accessToken),
          api.getViewerSaldo(viewerId, tokens?.accessToken),
        ]);

        if (prog.status === "fulfilled") {
          const data = prog.value;
          setViewerProgress({
            nivel: data.nivel_actual,
            puntos: data.puntos_actuales,
            siguiente: data.siguiente_nivel ?? data.nivel_actual + 1,
            falta: data.falta_puntos,
            pct: data.progreso_porcentaje,
          });
        }

        if (saldo.status === "fulfilled") {
          setViewerSaldo(saldo.value.saldo_coins);
        }
      } catch {
        // Mantén últimos valores si falla
      } finally {
        // reprograma un refresh ligero para evitar spam si el backend demora
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(loadProgress, 15000);
      }
    };

    loadProgress();
    const onVisibility = () => { if (document.visibilityState === "visible") loadProgress(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [user?.perfilId, user?.role, tokens?.accessToken]);

  const getLevelUpMessage = () => {
    if (!user) return "";
    if (user.role === "espectador") return "¡Subiste de nivel!";
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

      {user?.role !== "streamer" && (viewerProgress || viewerSaldo !== null) && (
        <div className="header-saldo" style={{ textAlign: "center", minWidth: "240px" }}>
          <span style={{ color: "#e6dff7", fontWeight: "bold" }}>
            Nivel {viewerProgress?.nivel ?? "-"} ({viewerProgress?.puntos ?? 0} pts)
          </span>
          {viewerProgress && (
            <div style={{ fontSize: "0.8rem", color: "#a381f9" }}>
              Faltan {viewerProgress.falta} pts para el nivel {viewerProgress.siguiente}
            </div>
          )}
          <div
            style={{
              backgroundColor: "#333",
              borderRadius: "10px",
              height: "6px",
              width: "100%",
              marginTop: "5px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${viewerProgress?.pct ?? 0}%`,
                height: "100%",
                backgroundColor: "#9f64ff",
                borderRadius: "10px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          {viewerSaldo !== null && (
            <div style={{ marginTop: "6px", color: "#e6dff7", fontWeight: "bold" }}>
              Monedas: {viewerSaldo} L
            </div>
          )}
        </div>
      )}

      {user?.role === "streamer" && (
        <div className="header-saldo" style={{ color: "#9f64ff", fontWeight: "bold" }}>
          Modo Streamer
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
            {user.role === "streamer" && (
              <Link
                to="/dashboard"
                style={{ textDecoration: "none", color: "#a381f9", fontWeight: "bold", fontSize: "0.9rem" }}
              >
                Dashboard
              </Link>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src={avatarSrc}
                alt="Perfil"
                style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "2px solid #9f64ff" }}
              />
              <span style={{ fontWeight: "bold", color: "white" }}>{user.name}</span>
            </div>

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
