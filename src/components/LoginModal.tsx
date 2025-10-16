import React, { useState } from "react";
import logo from "../assets/logo.png"; 

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      justifyContent: "center", alignItems: "center"
    }}>
      <div className= "cuadrito-login" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", padding: "90px", borderRadius: "14px", width: "300px" , boxShadow: "0 4px 20px rgba(0,0,0,0.5)" , position: "relative" }}>
        <h2 className="inicia-sesion">Iniciar sesión</h2>
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
        <input className="input-email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "80%", marginBottom: "11px", padding: "7px",display: "block", margin: "0 auto 11px auto" }} />
        <input className="input-contra" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "80%", marginBottom: "19px", padding: "7px",margin: "0 auto 19px auto", display: "block" }} />
        <button className="boton-ingresar" style={{ width: "40%",  display: "block", margin: "0 auto"}}>Log in</button>
        <button onClick={onClose}  className="boton-cerrar"     style={{ width: "40%", padding: "5px", margin: "10px auto 0 auto",display: "block" }}>Sign Up</button>
      </div>
    </div>
  );
};

export default LoginModal;
