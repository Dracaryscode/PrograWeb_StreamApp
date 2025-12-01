import React, { useState } from "react";
import logo from "../assets/logo.png";
// ✨ 1. Importamos el hook para conectarnos al sistema central
import { useAuth } from "../app/auth";

interface LoginModalProps {
  onClose: () => void;
  onLogin: (userData: any) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  // ✨ 2. Obtenemos la función login real del contexto
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario");

  const handleLoginClick = async () => {
    if (!email || !password) return;

    // ✨ 3. CONEXIÓN DEL ROL:
    // Como tu 'api.ts' decide el rol basándose en si el email tiene "+s",
    // hacemos este pequeño ajuste para que tu Dropdown visual funcione de verdad.
    let emailFinal = email;
    if (role === "streamer" && !email.includes("+s")) {
        emailFinal = email + "+s"; 
    }

    // ✨ 4. Ejecutamos el login REAL que actualiza toda la app
    await login(emailFinal, password);
    
    // Avisamos a App.tsx para que cierre el modal
    onLogin({ name: email.split("@")[0], email, role });
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      justifyContent: "center", alignItems: "center", zIndex: 1000
    }}>
      <div className="cuadrito-login" style={{
        backgroundColor: "rgba(0, 0, 0, 0.9)", // Un poco más oscuro para legibilidad
        padding: "40px", borderRadius: "14px",
        width: "300px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        position: "relative", textAlign: "center"
      }}>
        <h2 className="inicia-sesion" style={{marginBottom: "20px"}}>Iniciar sesión</h2>
        <img src={logo} alt="Logo"
          style={{
            width: "120px", height: "40px", objectFit: "contain", marginBottom: "20px"
          }}
        />
        <input className="input-email" type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "90%", marginBottom: "11px", padding: "8px", display: "block", margin: "0 auto 11px auto" }} />
        
        <input className="input-contra" type="password" placeholder="Contraseña" value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "90%", marginBottom: "19px", padding: "8px", display: "block", margin: "0 auto 19px auto" }} />

        {/* Selector de Rol */}
        <select value={role} onChange={e => setRole(e.target.value)}
          style={{
            width: "95%", marginBottom: "20px", padding: "8px",
            borderRadius: "9px", border: "1px solid #555",
            backgroundColor: "#222", color: "white",
            display: "block", marginLeft: "auto", marginRight: "auto"
          }}>
          <option value="usuario">Usuario</option>
          <option value="streamer">Streamer</option>
        </select>

        <button onClick={handleLoginClick} className="boton-ingresar" style={{ width: "100%", display: "block", padding: "10px", cursor: "pointer" }}>Log in</button>
        <button onClick={onClose} className="boton-cerrar" style={{ width: "100%", padding: "10px", marginTop: "10px", cursor: "pointer" }}>Cerrar</button>
      </div>
    </div>
  );
};

export default LoginModal;
