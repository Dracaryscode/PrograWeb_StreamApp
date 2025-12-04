import React, { useState } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../app/auth";

interface RegisterModalProps {
  onClose: () => void;
  onRegister: (userData: any) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onRegister }) => {
  const { register } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"espectador" | "streamer">("espectador");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegisterClick = async () => {
    if (!nombre.trim()) {
      setError("Ingresa un nombre.");
      return;
    }
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
      await register(email, password, role, nombre);
      onRegister({ name: nombre, email, role });
    } catch {
      setError("No se pudo registrar. Verifica los datos o usa otro correo.");
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
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          padding: "40px",
          borderRadius: "14px",
          width: "320px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h2 className="register" style={{ marginBottom: "20px" }}>¡Regístrate!</h2>
        <img
          src={logo}
          alt="Logo"
          style={{ width: "120px", height: "40px", objectFit: "contain", marginBottom: "20px" }}
        />
        <input
          className="register-nombre"
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ width: "90%", marginBottom: "12px", padding: "8px" }}
        />
        <input
          className="register-email2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "90%", marginBottom: "12px", padding: "8px" }}
        />
        <input
          className="register-contra2"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "90%", marginBottom: "12px", padding: "8px" }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "espectador" | "streamer")}
          style={{
            width: "95%",
            marginBottom: "16px",
            padding: "8px",
            borderRadius: "9px",
            border: "1px solid #555",
            backgroundColor: "#222",
            color: "white",
          }}
        >
          <option value="espectador">Espectador</option>
          <option value="streamer">Streamer</option>
        </select>

        {error && <div style={{ color: "#ef4444", marginBottom: "10px", fontSize: "0.9rem" }}>{error}</div>}

        <button
          className="boton-crear"
          onClick={handleRegisterClick}
          style={{ width: "100%", padding: "10px", cursor: "pointer" }}
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
        <button
          className="boton-cerrar2"
          onClick={onClose}
          style={{ width: "100%", padding: "10px", marginTop: "10px", cursor: "pointer" }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
