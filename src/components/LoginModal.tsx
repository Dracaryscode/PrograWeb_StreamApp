import React, { useState } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../app/auth";

interface LoginModalProps {
  onClose: () => void;
  onLogin: (userData: any) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginClick = async () => {
    if (!email.trim()) {
      setError("Ingresa un correo.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      onLogin({ name: email.split("@")[0], email });
    } catch {
      setError("Credenciales inválidas. Verifica correo y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="cuadrito-login"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          padding: "40px",
          borderRadius: "14px",
          width: "300px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          position: "relative",
          textAlign: "center",
        }}
      >
        <h2 className="inicia-sesion" style={{ marginBottom: "20px" }}>
          Iniciar sesión
        </h2>
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "120px",
            height: "40px",
            objectFit: "contain",
            marginBottom: "20px",
          }}
        />
        <input
          className="input-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "90%",
            marginBottom: "11px",
            padding: "8px",
            display: "block",
            margin: "0 auto 11px auto",
          }}
        />

        <input
          className="input-contra"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "90%",
            marginBottom: "19px",
            padding: "8px",
            display: "block",
            margin: "0 auto 19px auto",
          }}
        />

        {error && (
          <div style={{ color: "#ef4444", marginBottom: "10px", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <button
          onClick={handleLoginClick}
          className="boton-ingresar"
          style={{ width: "100%", display: "block", padding: "10px", cursor: "pointer" }}
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Log in"}
        </button>
        <button
          onClick={onClose}
          className="boton-cerrar"
          style={{ width: "100%", padding: "10px", marginTop: "10px", cursor: "pointer" }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
