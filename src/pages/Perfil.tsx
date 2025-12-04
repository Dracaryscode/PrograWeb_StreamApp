import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../app/auth";
import perfilImg from "../assets/perfil.jpg";
import perfilAlt1 from "../assets/Perfil/perfil1.png";
import perfilAlt2 from "../assets/Perfil/perfil2.png";
import styles from "./Perfil.module.css";
import { api } from "../services/api";

interface PerfilContext {
  user: any;
}

const avatarOptions = [
  { key: "perfil", label: "Avatar predeterminado", src: perfilImg },
  { key: "perfil1", label: "Avatar 1", src: perfilAlt1 },
  { key: "perfil2", label: "Avatar 2", src: perfilAlt2 },
];

const Perfil: React.FC = () => {
  const outletContext = useOutletContext<PerfilContext | undefined>();
  const { user: authUser, updateProfile, tokens } = useAuth();
  const user = authUser ?? outletContext?.user;

  const [perfilData, setPerfilData] = useState<{ nivel: number; puntos: number; horas: number; saldo: number } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user?.avatarKey || "perfil");
  const [nameInput, setNameInput] = useState<string>(user?.name || "");
  const [error, setError] = useState<string | null>(null);

  const avatarMap = {
    perfil: perfilImg,
    perfil1: perfilAlt1,
    perfil2: perfilAlt2,
  };
  const currentAvatar = avatarMap[user?.avatarKey as keyof typeof avatarMap] || perfilImg;

  useEffect(() => {
    if (user?.avatarKey) setSelectedAvatar(user.avatarKey);
    if (user?.name) setNameInput(user.name);
  }, [user?.avatarKey, user?.name]);

  useEffect(() => {
    const loadPerfil = async () => {
      const viewerId = user?.perfilId ?? Number(import.meta.env.VITE_DEFAULT_VIEWER_ID ?? 0);
      if (!viewerId || user?.role !== "espectador") {
        setPerfilData(null);
        setError("Falta perfilId de espectador. Configura VITE_DEFAULT_VIEWER_ID o vuelve a registrarte.");
        return;
      }
      try {
        const data = await api.getViewerPerfil(viewerId, tokens?.accessToken);
        setPerfilData({
          nivel: data.nivel_actual,
          puntos: data.puntos,
          horas: data.horas_vistas,
          saldo: data.saldo_coins,
        });
        setError(null);
      } catch {
        setError("No se pudo cargar el perfil del backend.");
      }
    };
    loadPerfil();
  }, [user?.perfilId, user?.role, tokens?.accessToken]);

  const handleSaveProfile = () => {
    const newName = (nameInput || "").trim() || user?.name || "Usuario";
    updateProfile({ avatarKey: selectedAvatar as any, name: newName });
    setIsEditing(false);
  };

  if (!user) {
    return <div className={styles.perfilContainer}>Inicia sesión para ver tu perfil.</div>;
  }

  if (user.role === "streamer") {
    return (
      <div className={styles.perfilContainer}>
        <div className={styles.header}>
          <img src={currentAvatar} alt="Avatar" className={styles.avatar} />
          <div className={styles.userInfo}>
            <h1>{user?.name || "Tu Nombre"}</h1>
            <p>Los datos en vivo se consultan en el Dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.perfilContainer}>
      <div className={styles.header}>
        <img src={currentAvatar} alt="Avatar" className={styles.avatar} />
        <div className={styles.userInfo}>
          <h1>{user?.name || "Tu Nombre"}</h1>
          <p>Nivel {perfilData?.nivel ?? "-"} - {perfilData?.puntos ?? 0} pts</p>
          <p>Monedas: {perfilData?.saldo ?? 0} L</p>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.stats}>
        <p><strong>Horas vistas:</strong> {perfilData?.horas ?? 0}</p>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${Math.min(perfilData?.puntos ?? 0, 100)}%` }}></div>
        </div>
        <p><strong>Saldo coins:</strong> {perfilData?.saldo ?? 0}</p>
      </div>

      <button className={styles.editBtn} onClick={() => setIsEditing((v) => !v)}>
        {isEditing ? "Cerrar editor" : "Editar Perfil"}
      </button>

      {isEditing && (
        <div className={styles.avatarPicker}>
          <h3>Elige tu foto de perfil</h3>
          <div className={styles.avatarGrid}>
            {avatarOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`${styles.avatarOption} ${selectedAvatar === option.key ? styles.avatarOptionActive : ""}`}
                onClick={() => setSelectedAvatar(option.key)}
              >
                <img src={option.src} alt={option.label} />
              </button>
            ))}
          </div>
          <div className={styles.nameEditor}>
            <label htmlFor="nameEdit">Nuevo ID</label>
            <input
              id="nameEdit"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Escribe tu nuevo ID"
            />
          </div>
          <div className={styles.avatarActions}>
            <button className={styles.editBtn} onClick={handleSaveProfile}>Guardar cambios</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;
