import React, { useState } from "react";
import logo from "../assets/logo.png";
// ✨ 1. Importamos el hook
import { useAuth } from "../app/auth";

interface RegisterModalProps {
  onClose: () => void;
  onRegister: (userData: any) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onRegister }) => {
  // ✨ 2. Usamos la función register del contexto
  const { register } = useAuth();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario");

  const handleRegisterClick = async () => {
    if (!nombre || !email || !password) return;

    // ✨ 3. Lógica de rol para el email (igual que en Login)
    let emailFinal = email;
    if (role === "streamer" && !email.includes("+s")) {
        emailFinal = email + "+s"; 
    }

    // ✨ 4. Registramos en el sistema central
    await register(emailFinal, password);
    
    // Avisamos para cerrar
    onRegister({ name: nombre, email: emailFinal, role });
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      justifyContent: "center", alignItems: "center", zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "rgba(0, 0, 0, 0.9)", // Fondo más oscuro consistente
        padding: "40px", borderRadius: "14px", width: "300px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        position: "relative", display: "flex",
        flexDirection: "column", alignItems: "center"
      }}>
        <h2 className="register" style={{marginBottom: "20px"}}>¡Regístrate!</h2>
        <img src={logo} alt="Logo"
          style={{
            width: "120px", height: "40px", objectFit: "contain", marginBottom: "20px"
          }}
        />
        <input className="register-nombre" type="text" placeholder="Nombre" value={nombre}
          onChange={e => setNombre(e.target.value)} style={{ width: "90%", marginBottom: "17px", padding: "8px" }} />
        <input className="register-email2" type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} style={{ width: "90%", marginBottom: "17px", padding: "8px" }} />
        <input className="register-contra2" type="password" placeholder="Contraseña" value={password}
          onChange={e => setPassword(e.target.value)} style={{ width: "90%", marginBottom: "17px", padding: "8px" }} />

        <select value={role} onChange={e => setRole(e.target.value)}
          style={{
            width: "95%", marginBottom: "20px", padding: "8px",
            borderRadius: "9px", border: "1px solid #555",
            backgroundColor: "#222", color: "white"
          }}>
          <option value="usuario">Usuario</option>
          <option value="streamer">Streamer</option>
        </select>

        <button className="boton-crear" onClick={handleRegisterClick} style={{ width: "100%", padding: "10px", cursor: "pointer" }}>Crear cuenta</button>
        <button className="boton-cerrar2" onClick={onClose} style={{ width: "100%", padding: "10px", marginTop: "10px", cursor: "pointer" }}>Cerrar</button>
      </div>
    </div>
  );
};

export default RegisterModal;
