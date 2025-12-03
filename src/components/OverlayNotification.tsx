import React from 'react';
import './OverlayNotification.css'; // ¡Asegúrate de que esta línea exista!

interface OverlayNotificationProps {
  message: string;
  onClose: () => void;
}

const OverlayNotification: React.FC<OverlayNotificationProps> = ({ message, onClose }) => {
  return (
    // La capa exterior oscura que cierra la notificación al hacer clic
    <div className="overlay-container" onClick={onClose}>
      
      {/* El contenido de la notificación (para evitar que se cierre al hacer clic adentro) */}
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <button onClick={onClose} className="overlay-close-btn">
          Entendido
        </button>
      </div>

    </div>
  );
};

export default OverlayNotification;