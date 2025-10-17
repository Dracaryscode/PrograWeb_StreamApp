import React from "react";

interface Props {
  onClose: () => void;
}

const StreamerLevelUpNotification: React.FC<Props> = ({ onClose }) => {
  return (
    <div style={{
      position: "absolute",
      top: "60px",
      right: "20px",
      backgroundColor: "#ff8c42", // color distinto para streamer
      color: "white",
      padding: "15px 20px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      zIndex: 1000,
      minWidth: "250px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>🎉 ¡Subiste de nivel por horas de tu audiencia!</span>
        <button onClick={onClose} style={{
          background: "transparent",
          border: "none",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer"
        }}>X</button>
      </div>
    </div>
  );
};

export default StreamerLevelUpNotification;
