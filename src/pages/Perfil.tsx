
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../app/auth";
import perfilImg from "../assets/perfil.jpg";
import perfilAlt1 from "../assets/Perfil/perfil1.png";
import perfilAlt2 from "../assets/Perfil/perfil2.png";
import styles from "./Perfil.module.css";

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
  const { user: authUser, updateProfile } = useAuth();
  const user = authUser ?? outletContext?.user;

  const [nivelConfig, setNivelConfig] = useState(1);
  const [puntosConfig, setPuntosConfig] = useState(100);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user?.avatarKey || "perfil");
  const [nameInput, setNameInput] = useState<string>(user?.name || "");

  const horasTransmision = 12;
  const nivel = 5;
  const puntos = 230;
  const progreso = 70;
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

  const handleSaveProfile = () => {
    const newName = (nameInput || "").trim() || user?.name || "Usuario";
    updateProfile({ avatarKey: selectedAvatar as any, name: newName });
    setIsEditing(false);
  };

  return (
    <div className={styles.perfilContainer}>
      {/* Header con avatar e info */}
      <div className={styles.header}>
        <img src={currentAvatar} alt="Avatar" className={styles.avatar} />
        <div className={styles.userInfo}>
          <h1>{user?.name || "Tu Nombre"}</h1>
          <p>Nivel {nivel} - {puntos} pts</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className={styles.stats}>
        <p><strong>Horas de transmisión:</strong> {horasTransmision}</p>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${progreso}%` }}></div>
        </div>
      </div>

      {/* Sección de niveles */}
      <div className={styles.levelsSection}>
        <h2>Niveles</h2>

        {user?.role === "streamer" ? (
          <div className={styles.streamerConfig}>
            <h3>Configuración de puntos por nivel</h3>
            <p style={{ color: "#bbb", marginBottom: "10px" }}>
              Como streamer, puedes ajustar los puntos requeridos por nivel para tu comunidad.
            </p>

            <div className={styles.configForm}>
              <label>
                Nivel: 
                <select 
                  value={nivelConfig} 
                  onChange={(e) => setNivelConfig(Number(e.target.value))}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>
              </label>

              <label>
                Puntos requeridos: 
                <input 
                  type="number" 
                  value={puntosConfig} 
                  onChange={(e) => setPuntosConfig(Number(e.target.value))} 
                />
              </label>

              <button 
                className={styles.editBtn}
                onClick={() => alert(`Nivel ${nivelConfig} configurado a ${puntosConfig} pts`)}
              >
                Guardar
              </button>
            </div>
          </div>
        ) : (
          <p>Como usuario, sigue ganando puntos para subir de nivel </p>
        )}
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
