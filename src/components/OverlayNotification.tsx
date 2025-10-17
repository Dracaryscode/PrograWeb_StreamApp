import React from "react";

interface OverlayProps {
  message: string;
  onClose: () => void;
}

const OverlayNotification: React.FC<OverlayProps> = ({ message, onClose }) => (
  <div style={{
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)", display: "flex",
    justifyContent: "center", alignItems: "center"
  }}>
    <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "5px" }}>
      <p>{message}</p>
      <button onClick={onClose}>Cerrar</button>
    </div>
  </div>
);

export default OverlayNotification;
