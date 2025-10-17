import { useState, useMemo, useRef, useEffect } from "react";
import { getSessions, totalHours, progressToNext, addSession } from "../services/stream";
import OverlayNotification from "../components/OverlayNotification"; // Asegúrate de que la ruta es correcta
import './Dashboard.css'; // Asegúrate de tener este archivo de estilos o crea uno

// --- INICIA EL CÓDIGO PARA COPIAR ---

const Dashboard = () => {
    // --- ESTADO PARA LA LÓGICA DE DATOS ---
    const [sessions, setSessions] = useState(() => getSessions());

    // --- ESTADO PARA LA LÓGICA DE INTERACCIÓN ---
    const [isStreaming, setIsStreaming] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const streamStartRef = useRef<Date | null>(null);

    // --- CÁLCULOS DERIVADOS (MEMOIZED) ---
    const hours = useMemo(() => totalHours(sessions), [sessions]);
    const prog = useMemo(() => progressToNext(hours), [hours]);

    // --- MANEJADOR DEL BOTÓN DE STREAMING ---
    const handleStreamToggle = () => {
        const now = new Date();
        if (isStreaming) {
            // Deteniendo el stream
            if (streamStartRef.current) {
                // Añade la nueva sesión al mock de datos (localStorage)
                addSession({ start: streamStartRef.current, end: now });
                // Actualiza el estado para que la UI reaccione
                setSessions(getSessions());
            }
        } else {
            // Iniciando el stream
            streamStartRef.current = now;
        }
        setIsStreaming(!isStreaming);
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard del Streamer</h1>
            <p className="dashboard-subtitle">Tu centro de control para monitorear tu progreso.</p>

            {/* --- SECCIÓN DE BOTONES DE ACCIÓN --- */}
            <div className="action-buttons">
                <button onClick={handleStreamToggle} className={`stream-button ${isStreaming ? 'stop' : 'start'}`}>
                    {isStreaming ? '🔴 Detener Transmisión' : '▶️ Iniciar Transmisión'}
                </button>
                <button onClick={() => setShowLevelUp(true)} className="simulate-button">
                    Simular Subida de Nivel
                </button>
            </div>

            {/* --- SECCIÓN DE ESTADÍSTICAS --- */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Horas totales</div>
                    <div className="stat-value">{hours.toFixed(2)}h</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Nivel actual</div>
                    <div className="stat-value">{prog.level}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Próximo objetivo</div>
                    <div className="stat-value small">
                        {prog.goal === prog.currBase ? "Máximo alcanzado" : `${prog.goal} h`}
                    </div>
                </div>
            </div>

            {/* --- BARRA DE PROGRESO --- */}
            <div className="progress-card">
                <div className="progress-labels">
                    <span>{prog.currBase} h</span>
                    <span>{prog.goal === prog.currBase ? `${hours.toFixed(2)} h` : `${prog.goal} h`}</span>
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

            {/* --- NOTIFICACIÓN OVERLAY (se muestra condicionalmente) --- */}
            {showLevelUp && (
                <OverlayNotification
                    message={`¡Felicidades! Has alcanzado el nivel ${prog.level + 1}.`}
                    onClose={() => setShowLevelUp(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;