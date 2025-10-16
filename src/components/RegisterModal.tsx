import React, { useState } from "react";
import logo from "../assets/logo.png"; 

interface RegisterModalProps {
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      justifyContent: "center", alignItems: "center"
    }}>
      <div style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", padding: "90px", borderRadius: "14px", width: "300px" ,boxShadow: "0 4px 20px rgba(0,0,0,0.5)",position: "relative" , display: "flex",             // <-- flex para centrar
  flexDirection: "column",     // <-- elementos en columna
  alignItems: "center"   }}>
        <h2 className="register">Registrate!!</h2>
        <img 
          src={logo} 
          alt="Logo"
          style={{
            position: "absolute",
            top: "15px",
            left: "10px",
            width: "120px",
            height: "40px",
            objectFit: "contain"
          }}
        />
        <input className="register-nombre"  type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} style={{ width: "80%", marginBottom: "17px", padding: "5px" }} />
        <input className="register-email2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "80%", marginBottom: "17px", padding: "5px" }} />
        <input className="register-contra2" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "80%", marginBottom: "26px", padding: "5px" }} />
        <button className="boton-crear"style={{ width: "40%", padding: "5px" }}>Crear cuenta</button>
        <button className="boton-cerrar2"onClick={onClose} style={{ width: "40%", padding: "5px", marginTop: "10px" }}>Cerrar</button>
      </div>
    </div>
  );
};

export default RegisterModal;
