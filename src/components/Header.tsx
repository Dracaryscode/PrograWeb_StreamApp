import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

interface HeaderProps {
  onLogin: () => void;
  onRegister: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogin, onRegister }) => {
  const [search, setSearch] = useState("");
  const saldoMonedas = 120;
  const nivel = 5;
  const puntos = 230;

  // 👇 NUEVO: valores para progreso
  const puntosSiguienteNivel = 300;
  const faltan = puntosSiguienteNivel - puntos;
  const progreso = (puntos / puntosSiguienteNivel) * 100;

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo">
        <img src={logo} alt="Liky Logo" />
      </div>

      {/* Saldo y nivel */}
      <div className="header-saldo" style={{ textAlign: "center" }}>
        <span>
          💰 {saldoMonedas} | Nivel {nivel} ({puntos} pts)
        </span>

        {/* 👇 NUEVO: Texto de puntos faltantes */}
        <div style={{ fontSize: "0.9rem", color: "#6b46c1" }}>
          Faltan {faltan} pts para el nivel {nivel + 1}
        </div>

        {/* 👇 NUEVO: Barra de progreso */}
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

      {/* Barra de búsqueda centrada */}
      <div className="header-search-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="header-search"
        />
      </div>

      {/* Botones y enlaces */}
      <div className="header-buttons flex gap-2 items-center">
        {/* Enlace al Dashboard */}
        <Link
          to="/dashboard"
          className="px-3 py-1 rounded-md text-sm font-semibold text-blue-600 hover:text-white hover:bg-blue-600 transition"
        >
          Dashboard
        </Link>

        {/* Botones originales */}
        <button onClick={onLogin} className="btn-login">Iniciar sesión</button>
        <button onClick={onRegister} className="btn-register">Registrarse</button>
      </div>
    </header>
  );
};

export default Header;
