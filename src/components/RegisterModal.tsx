import React, { useState } from "react";
import logo from "../assets/logo.png";

interface RegisterModalProps {
  onClose: () => void;
  onRegister: (userData: any) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onRegister }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario");

  const handleRegisterClick = () => {
    if (!nombre || !email || !password) return;
    onRegister({ name: nombre, email, role });
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      justifyContent: "center", alignItems: "center"
    }}>
      <div style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        padding: "90px", borderRadius: "14px", width: "300px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        position: "relative", display: "flex",
        flexDirection: "column", alignItems: "center"
      }}>
        <h2 className="register">¡Regístrate!</h2>
        <img src={logo} alt="Logo"
          style={{
            position: "absolute", top: "15px", left: "10px",
            width: "120px", height: "40px", objectFit: "contain"
          }}
        />
        <input className="register-nombre" type="text" placeholder="Nombre" value={nombre}
          onChange={e => setNombre(e.target.value)} style={{ width: "80%", marginBottom: "17px", padding: "5px" }} />
        <input className="register-email2" type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} style={{ width: "80%", marginBottom: "17px", padding: "5px" }} />
        <input className="register-contra2" type="password" placeholder="Contraseña" value={password}
          onChange={e => setPassword(e.target.value)} style={{ width: "80%", marginBottom: "17px", padding: "5px" }} />

        <select value={role} onChange={e => setRole(e.target.value)}
          style={{
            width: "85%", marginBottom: "20px", padding: "7px",
            borderRadius: "9px", border: "1px solid #555",
            backgroundColor: "transparent", color: "white"
          }}>
          <option value="usuario">Usuario</option>
          <option value="streamer">Streamer</option>
        </select>

        <button className="boton-crear" onClick={handleRegisterClick} style={{ width: "40%", padding: "5px" }}>Crear cuenta</button>
        <button className="boton-cerrar2" onClick={onClose} style={{ width: "40%", padding: "5px", marginTop: "10px" }}>Cerrar</button>
      </div>
    </div>
  );
};

export default RegisterModal;
