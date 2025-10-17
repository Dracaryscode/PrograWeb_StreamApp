import { useState, useMemo, useRef, useEffect } from "react";
import { getSessions, totalHours, progressToNext, addSession } from "../services/stream";
import OverlayNotification from "../components/OverlayNotification";
import './Dashboard.css';

const Dashboard = () => {
    // Estado para las sesiones guardadas en localStorage
    const [sessions, setSessions] = useState(() => getSessions());
    
    // Estado para el tiempo total que se muestra en VIVO (representa "horas simuladas")
    const [liveTime, setLiveTime] = useState(() => totalHours(sessions));

    // Estados de control
    const [isStreaming, setIsStreaming] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const streamStartRef = useRef<Date | null>(null);

    // Los cálculos para la UI se basan en el tiempo EN VIVO
    const prog = useMemo(() => progressToNext(liveTime), [liveTime]);

    // --- EFECTO PARA EL LOOP EN TIEMPO REAL ---
    useEffect(() => {
        let timer: number | undefined;

        if (isStreaming && streamStartRef.current) {
            const baseTime = totalHours(sessions);
            const startTime = streamStartRef.current.getTime();

            timer = setInterval(() => {
                const now = new Date().getTime();
                const currentStreamDuration = (now - startTime) / 1000;
                
                const newLiveTime = baseTime + currentStreamDuration;

                const oldLevel = progressToNext(liveTime).level;
                const newLevel = progressToNext(newLiveTime).level;

                if (newLevel > oldLevel) {
                    setShowLevelUp(true);
                }
                
                setLiveTime(newLiveTime);
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [isStreaming, sessions, liveTime]);


    const handleStreamToggle = () => {
        const now = new Date();
        if (isStreaming) {
            if (streamStartRef.current) {
                addSession({ start: streamStartRef.current, end: now });
                setSessions(getSessions());
            }
        } else {
            streamStartRef.current = now;
            setLiveTime(totalHours(sessions));
        }
        setIsStreaming(!isStreaming);
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard del Streamer</h1>
            <p className="dashboard-subtitle">Tu centro de control para monitorear tu progreso.</p>

            <div className="action-buttons">
                <button onClick={handleStreamToggle} className={`stream-button ${isStreaming ? 'stop' : 'start'}`}>
                    {isStreaming ? '🔴 Detener Transmisión' : '▶️ Iniciar Transmisión'}
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    {/* --- CAMBIO VISUAL --- */}
                    <div className="stat-label">Horas totales</div>
                    <div className="stat-value">{liveTime.toFixed(0)}h</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Nivel actual</div>
                    <div className="stat-value">{prog.level}</div>
                </div>
                <div className="stat-card">
                    {/* --- CAMBIO VISUAL --- */}
                    <div className="stat-label">Próximo objetivo</div>
                    <div className="stat-value small">
                        {prog.goal === prog.currBase ? "Máximo" : `${prog.goal}h`}
                    </div>
                </div>
            </div>

            <div className="progress-card">
                <div className="progress-labels">
                    {/* --- CAMBIO VISUAL --- */}
                    <span>{prog.currBase}h</span>
                    <span>{prog.goal === prog.currBase ? `${liveTime.toFixed(0)}h` : `${prog.goal}h`}</span>
                </div>
                <div className="progress-bar-background">
                    <div
                        className="progress-bar-foreground"
                        style={{ width: `${Math.round(prog.percent * 100)}%` }}
                    />
                </div>
                <div className="progress-text">
                    Progreso: <strong>{Math.round(prog.percent * 100)}%</strong>
                </div>
            </div>

            {showLevelUp && (
                <OverlayNotification
                    message={`¡Felicidades! Has alcanzado el nivel ${prog.level}.`}
                    onClose={() => setShowLevelUp(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;