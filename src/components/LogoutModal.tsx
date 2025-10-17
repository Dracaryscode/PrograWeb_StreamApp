import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ open, onClose, onConfirm }: Props) {
  if (!open) return null;

  return (
    <div className="logout-modal-backdrop" role="dialog" aria-modal="true">
      <div className="logout-modal">
        <h2 className="logout-title">¿Cerrar sesión?</h2>
        <p className="logout-desc">Si cierras sesión, protegerás tu cuenta. Puedes volver a entrar cuando quieras.</p>

        <div className="logout-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-confirm" onClick={onConfirm}>Cerrar sesión</button>
        </div>

        <div className="logout-illustration" aria-hidden>
          {/* una sencilla animación CSS hecha con elementos */}
          <div className="sock">
            <div className="spark spark-1" />
            <div className="spark spark-2" />
            <div className="spark spark-3" />
          </div>
        </div>
      </div>
    </div>
  );
}