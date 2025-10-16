import React, { useState } from "react";
import logo from "../assets/logo.png";
import lupa from "../assets/lupa.png";
interface HeaderProps {
  onLogin: () => void;
  onRegister: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogin, onRegister }) => {
  const [search, setSearch] = useState("");
  const saldoMonedas = 120;
  const nivel = 5;
  const puntos = 230;

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo">
        <img src={logo} alt="Liky Logo" />
      </div>

      {/* Saldo y nivel */}
      <span className="header-saldo">
        💰 {saldoMonedas} | Nivel {nivel} ({puntos} pts)
      </span>

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

      {/* Botones */}
      <div className="header-buttons">
        <button onClick={onLogin} className="btn-login">Iniciar sesión</button>
        <button onClick={onRegister} className="btn-register">Registrarse</button>
      </div>
    </header>
  );
};

export default Header;
