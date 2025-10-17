import React from "react";

interface Props {
  onClose: () => void;
  message: string;
}

const LevelUpNotification: React.FC<Props> = ({ onClose, message }) => {
  return (
    <div style={{
      position: "absolute",
      top: "50px",
      right: "0px",
      backgroundColor: "#6b46c1",
      color: "white",
      padding: "15px 20px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      zIndex: 1000,
      minWidth: "220px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{message}</span>
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

export default LevelUpNotification;
