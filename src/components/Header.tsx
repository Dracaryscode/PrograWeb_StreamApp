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
