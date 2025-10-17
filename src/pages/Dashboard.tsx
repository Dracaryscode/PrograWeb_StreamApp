import { useState, useMemo, useRef, useEffect } from "react";
import { 
    getSessions, totalHours, progressToNext, addSession, 
    getLevelConfig, saveLevelConfig, getPreset 
} from "../services/stream";
import styles from './Dashboard.module.css';
import OverlayNotification from "../components/OverlayNotification"; // <--- Añadido de tu versión
import { FaBolt, FaRegClock, FaWalking, FaSave, FaUserPlus, FaStar, FaGift } from 'react-icons/fa';

// Datos de prueba
const mockActivity = [
    { icon: <FaUserPlus />, text: 'Ninja se ha suscrito.' },
    { icon: <FaGift />, text: 'Auronplay ha enviado un Hype x5.' },
    { icon: <FaStar />, text: 'Maria_GG ha seguido el canal.' },
    { icon: <FaGift />, text: 'ElProfe ha enviado un Corazón.' },
];

const Dashboard = () => {
    // --- ESTADO COMBINADO ---
    const [sessions, setSessions] = useState(() => getSessions());
    const [isStreaming, setIsStreaming] = useState(false);
    const streamStartRef = useRef<Date | null>(null);

    // Estados para la simulación en tiempo real (de tu versión)
    const [liveTime, setLiveTime] = useState(() => totalHours(sessions));
    const [showLevelUp, setShowLevelUp] = useState(false);
    
    // Cálculos de progreso: uno para el tiempo real (visual) y otro para el guardado
    const liveProg = useMemo(() => progressToNext(liveTime, getLevelConfig()), [liveTime, getLevelConfig()]);
    
    // --- ESTADO DEL PANEL DE CONFIGURACIÓN DE NIVELES (de la versión entrante) ---
    const [levels, setLevels] = useState<number[]>([]);
    const [activePreset, setActivePreset] = useState<'normal' | 'lenta' | 'rapida' | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    // --- EFECTOS COMBINADOS ---

    // Efecto para cargar la configuración de niveles
    useEffect(() => {
        setLevels(getLevelConfig());
    }, []);

    // Efecto para la simulación de stream en tiempo real (de tu versión)
    useEffect(() => {
        let timer: number | undefined;

        if (isStreaming) {
            const baseTime = totalHours(getSessions()); // Usar sesiones guardadas como base
            const startTime = streamStartRef.current!.getTime();

            timer = setInterval(() => {
                const now = new Date().getTime();
                const currentStreamDuration = (now - startTime) / (1000 * 3600); // en horas
                
                const newLiveTime = baseTime + currentStreamDuration;

                const oldLevel = progressToNext(liveTime, getLevelConfig()).level;
                const newLevel = progressToNext(newLiveTime, getLevelConfig()).level;

                if (newLevel > oldLevel) {
                    setShowLevelUp(true);
                }
                
                setLiveTime(newLiveTime);
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [isStreaming, liveTime]); // No incluir 'sessions' para evitar reinicios

    // --- MANEJADORES COMBINADOS ---
    const handleStreamToggle = () => {
        const now = new Date();
        if (isStreaming) {
            // Deteniendo
            if (streamStartRef.current) {
                addSession({ start: streamStartRef.current, end: now });
                const updatedSessions = getSessions();
                setSessions(updatedSessions);
                setLiveTime(totalHours(updatedSessions)); // Sincronizar liveTime con el total real
            }
        } else {
            // Iniciando
            streamStartRef.current = now;
        }
        setIsStreaming(!isStreaming);
    };
    
    // Manejadores del panel de configuración (de la versión entrante)
    const handleLevelChange = (index: number, value: string) => {
        const newLevels = [...levels];
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= (newLevels[index - 1] ?? 0)) {
            newLevels[index] = numValue;
            setLevels(newLevels);
            setActivePreset(null);
            setHasChanges(true);
        }
    };
    const handlePreset = (presetName: 'normal' | 'lenta' | 'rapida') => {
        setLevels(getPreset(presetName));
        setActivePreset(presetName);
        setHasChanges(true);
    };
    const handleSaveChanges = () => {
        saveLevelConfig(levels);
        setHasChanges(false);
        alert('¡Configuración de niveles guardada!');
        setSessions(getSessions()); // Forzar re-render para actualizar progreso
    };

    const maxPoints = Math.max(...levels, 1);

    return (
        <div className={styles.dashboardPage}>
            {/* --- WIDGET 1: GESTIÓN DE STREAM (Modificado para tiempo real) --- */}
            <div className={styles.mainWidget}>
                <div className={styles.streamStatusPanel}>
                    <div className={styles.statusHeader}>
                        <span className={`${styles.statusIndicator} ${isStreaming ? styles.online : styles.offline}`}></span>
                        {isStreaming ? 'STREAMING ONLINE' : 'STREAM OFFLINE'}
                    </div>
                    <button onClick={handleStreamToggle} className={`${styles.streamButton} ${isStreaming ? styles.stop : styles.start}`}>
                        {isStreaming ? 'Detener Stream' : 'Iniciar Stream'}
                    </button>
                    <div className={styles.streamStats}>
                        <div className={styles.statItem}>
                            <span>Tiempo Total</span>
                            <strong>{liveTime.toFixed(2)}h</strong> {/* <--- Usa liveTime */}
                        </div>
                        <div className={styles.statItem}>
                            <span>Nivel de Streamer</span>
                            <strong>{liveProg.level}</strong> {/* <--- Usa liveProg */}
                        </div>
                    </div>
                    <div className={styles.progressBarContainer}>
                        <div className={styles.progressBarFill} style={{ width: `${liveProg.percent * 100}%` }} /> {/* <--- Usa liveProg */}
                    </div>
                    <div className={styles.progressLabels}>
                        <span>{liveProg.currentPoints.toFixed(0)} pts</span> {/* <--- Usa liveProg */}
                        <span>{liveProg.goal} pts</span> {/* <--- Usa liveProg */}
                    </div>
                </div>
                <div className={styles.activityFeed}>
                    <h3 className={styles.feedTitle}>Actividad Reciente</h3>
                    <ul className={styles.feedList}>
                        {mockActivity.map((item, index) => (
                            <li key={index} className={styles.feedItem}>
                                <span className={styles.feedIcon}>{item.icon}</span>
                                {item.text}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* --- WIDGET 2: CONTROL DE PROGRESIÓN (Sin cambios) --- */}
            <div className={styles.configWidget}>
                <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>Control de Progresión</h2>
                    <p className={styles.widgetSubtitle}>Define la aventura de tu comunidad. ¡Ajusta la curva de niveles!</p>
                </div>
                <div className={styles.configGrid}>
                    <div className={styles.controls}>
                        <h3>🚀 Elige un Ritmo</h3>
                        <div className={styles.presetButtons}>
                            <button onClick={() => handlePreset('rapida')} className={activePreset === 'rapida' ? styles.active : ''}><FaBolt /> Rápida</button>
                            <button onClick={() => handlePreset('normal')} className={activePreset === 'normal' ? styles.active : ''}><FaWalking /> Normal</button>
                            <button onClick={() => handlePreset('lenta')} className={activePreset === 'lenta' ? styles.active : ''}><FaRegClock /> Lenta</button>
                        </div>
                        <h3>✍️ Control Total</h3>
                        <ul className={styles.levelList}>
                            {levels.map((points, index) => (
                                <li key={index} className={styles.levelItem}>
                                    <label>Nivel {index + 1}</label>
                                    <input type="number" value={points} onChange={(e) => handleLevelChange(index, e.target.value)} min={levels[index - 1] ?? 0} />
                                    <span>puntos</span>
                                </li>
                            ))}
                        </ul>
                        {hasChanges && (
                            <button className={styles.saveButton} onClick={handleSaveChanges}>
                                <FaSave /> Guardar Cambios
                            </button>
                        )}
                    </div>
                    <div className={styles.visualization}>
                        <h3>📈 Vista Previa de la Curva</h3>
                        <div className={styles.chartContainer}>
                            {levels.slice(1).map((points, index) => (
                                <div key={index} className={styles.chartBarWrapper} title={`${points} puntos para Nivel ${index + 2}`}>
                                    <div className={styles.chartBar} style={{ height: `${(points / maxPoints) * 100}%` }}>
                                        <span className={styles.barValue}>{points}</span>
                                    </div>
                                    <span className={styles.chartLabel}>Nvl {index + 2}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Notificación de subida de nivel (de tu versión) */}
            {showLevelUp && (
                <OverlayNotification
                    message={`¡Felicidades! Has alcanzado el nivel ${liveProg.level}.`}
                    onClose={() => setShowLevelUp(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;