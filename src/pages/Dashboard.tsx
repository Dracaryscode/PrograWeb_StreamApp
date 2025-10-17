import { useState, useMemo, useRef, useEffect } from "react";
import { 
    getSessions, totalHours, progressToNext, addSession, 
    getLevelConfig, saveLevelConfig, getPreset 
} from "../services/stream";
import styles from './Dashboard.module.css';
import OverlayNotification from "../components/OverlayNotification";
import { FaBolt, FaRegClock, FaWalking, FaSave, FaUserPlus, FaStar, FaGift } from 'react-icons/fa';

const mockActivity = [
    { icon: <FaUserPlus />, text: 'Ninja se ha suscrito.' },
    { icon: <FaGift />, text: 'Auronplay ha enviado un Hype x5.' },
    { icon: <FaStar />, text: 'Maria_GG ha seguido el canal.' },
];

const Dashboard = () => {
    const [sessions, setSessions] = useState(() => getSessions());
    const [isStreaming, setIsStreaming] = useState(false);
    const streamStartRef = useRef<Date | null>(null);
    
    // El estado en vivo ahora se llama 'liveHours' para mayor claridad
    const [liveHours, setLiveHours] = useState(() => totalHours(sessions));
    const [showLevelUp, setShowLevelUp] = useState(false);
    
    const [levels, setLevels] = useState<number[]>([]);
    const [activePreset, setActivePreset] = useState<'normal' | 'lenta' | 'rapida' | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const levelConfig = useMemo(() => getLevelConfig(), [sessions, levels]);
    const liveProg = useMemo(() => progressToNext(liveHours), [liveHours, levelConfig]);
    
    useEffect(() => {
        setLevels(getLevelConfig());
    }, []);

    useEffect(() => {
        let timer: number | undefined;
        if (isStreaming && streamStartRef.current) {
            const baseHours = totalHours(getSessions());
            const startTime = streamStartRef.current.getTime();
            timer = setInterval(() => {
                const now = new Date().getTime();
                const currentStreamDuration = (now - startTime) / 1000; // 1 segundo real...
                const newLiveHours = baseHours + currentStreamDuration; // ...es 1 hora simulada
                
                const oldLevel = progressToNext(liveHours).level;
                const newLevel = progressToNext(newLiveHours).level;
                
                if (newLevel > oldLevel) {
                    setShowLevelUp(true);
                }
                setLiveHours(newLiveHours);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isStreaming, liveHours, levelConfig]);

    const handleStreamToggle = () => {
        const now = new Date();
        if (isStreaming) {
            if (streamStartRef.current) {
                addSession({ start: streamStartRef.current, end: now });
                const updatedSessions = getSessions();
                setSessions(updatedSessions);
                setLiveHours(totalHours(updatedSessions));
            }
        } else {
            streamStartRef.current = now;
        }
        setIsStreaming(!isStreaming);
    };
    
    // Los otros manejadores no cambian...
    const handleLevelChange = (index: number, value: string) => {
        const newLevels = [...levels];
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue > (newLevels[index - 1] ?? 0)) {
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
        setSessions(getSessions());
    };
    const maxPoints = Math.max(...levels, 1);

    return (
        <div className={styles.dashboardPage}>
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
                            {/* --- CAMBIO VISUAL --- */}
                            <span>Horas Totales</span>
                            <strong>{liveHours.toFixed(0)}h</strong>
                        </div>
                        <div className={styles.statItem}>
                            <span>Nivel de Streamer</span>
                            <strong>{liveProg.level}</strong>
                        </div>
                    </div>
                    <div className={styles.progressBarContainer}>
                        <div className={styles.progressBarFill} style={{ width: `${liveProg.percent * 100}%` }} />
                    </div>
                    <div className={styles.progressLabels}>
                        {/* --- CAMBIO VISUAL --- */}
                        <span>{liveProg.currBase}h para Nivel {liveProg.level}</span>
                        <span>{liveProg.goal}h para Nivel {liveProg.level + 1}</span>
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

            <div className={styles.configWidget}>
                <div className={styles.widgetHeader}>
                    <h2 className={styles.widgetTitle}>Control de Progresión por Horas</h2>
                    <p className={styles.widgetSubtitle}>Define cuántas horas se necesitan para cada nivel.</p>
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
                            {levels.slice(1).map((points, index) => (
                                <li key={index} className={styles.levelItem}>
                                    <label>Nivel {index + 2}</label>
                                    <input type="number" value={points} onChange={(e) => handleLevelChange(index + 1, e.target.value)} min={levels[index] ?? 0} />
                                    {/* --- CAMBIO VISUAL --- */}
                                    <span>horas</span>
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
                                <div key={index} className={styles.chartBarWrapper} title={`${points} horas para Nivel ${index + 2}`}>
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