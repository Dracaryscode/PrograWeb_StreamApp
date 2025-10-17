
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import perfilImg from "../assets/perfil.jpg";
import styles from "./Perfil.module.css";

interface PerfilContext {
  user: any;
}

const Perfil: React.FC = () => {
  const outletContext = useOutletContext<PerfilContext | undefined>();
  const user = outletContext?.user;

  const [nivelConfig, setNivelConfig] = useState(1);
  const [puntosConfig, setPuntosConfig] = useState(100);

  const horasTransmision = 12;
  const nivel = 5;
  const puntos = 230;
  const progreso = 70;

  return (
    <div className={styles.perfilContainer}>
      {/* Header con avatar e info */}
      <div className={styles.header}>
        <img src={perfilImg} alt="Avatar" className={styles.avatar} />
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

      <button className={styles.editBtn}>Editar Perfil</button>
    </div>
  );
};

export default Perfil;
