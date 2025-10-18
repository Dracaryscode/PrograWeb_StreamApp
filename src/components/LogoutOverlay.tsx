import React, { useEffect } from "react";

interface Props {
  open: boolean;
  message?: string;
  onDone?: () => void; // llamado después de la animación
}

export default function LogoutOverlay({ open, message = "Hasta pronto 👋", onDone }: Props) {
  useEffect(() => {
    if (!open) return;
    // duración total de la animación (coincidir con CSS)
    const timer = setTimeout(() => {
      onDone && onDone();
    }, 1400);
    return () => clearTimeout(timer);
  }, [open, onDone]);

  if (!open) return null;

  return (
    <div className="logout-overlay">
      <div className="logout-card">
        <div className="wave" />
        <div className="emoji">👋</div>
        <h3 className="logout-message">{message}</h3>
        <p className="logout-sub">Gracias por usar la plataforma. ¡Vuelve pronto!</p>
      </div>
    </div>
  );
}