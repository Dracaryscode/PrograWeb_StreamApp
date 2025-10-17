// Define la estructura de una sesión de stream
export interface StreamSession {
    start: Date;
    end: Date;
}

const SESSIONS_KEY = "stream_sessions_mock";
// Ajusta los niveles según los requisitos de tu proyecto
const LEVELS = [0, 5, 10, 20, 35, 50, 75, 100]; 

// --- FUNCIONES PARA MANEJAR SESIONES ---

/**
 * Obtiene todas las sesiones del localStorage.
 * Convierte las fechas guardadas como string de vuelta a objetos Date.
 */
export function getSessions(): StreamSession[] {
    const data = localStorage.getItem(SESSIONS_KEY);
    if (!data) return [];
    
    try {
        // Es importante convertir las fechas de vuelta a objetos Date
        return JSON.parse(data).map((s: any) => ({
            start: new Date(s.start),
            end: new Date(s.end),
        }));
    } catch {
        return [];
    }
}

/**
 * Guarda un array de sesiones en el localStorage.
 */
export function setSessions(sessions: StreamSession[]): void {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

/**
 * Añade una nueva sesión a la lista existente en localStorage.
 */
export function addSession(newSession: StreamSession): void {
    const sessions = getSessions();
    sessions.push(newSession);
    setSessions(sessions);
}

// --- FUNCIONES PARA CÁLCULOS ---

/**
 * Calcula el total de horas acumuladas de todas las sesiones.
 */
export function totalHours(sessions: StreamSession[]): number {
    return sessions.reduce((acc, s) => {
        const durationMs = s.end.getTime() - s.start.getTime();
        // Convierte milisegundos a horas
        return acc + durationMs / (1000 * 60 * 60);
    }, 0);
}

/**
 * Calcula el nivel actual del streamer y el progreso hacia el siguiente nivel.
 */
export function progressToNext(totalHours: number) {
    let level = 1;
    // Encuentra el nivel actual basado en las horas
    for (let i = 0; i < LEVELS.length; i++) {
        if (totalHours >= LEVELS[i]) {
            level = i + 1;
        }
    }

    const currBase = LEVELS[level - 1] ?? 0;
    const goal = LEVELS[level] ?? currBase; // El siguiente objetivo o el máximo si ya no hay más niveles

    // Evita la división por cero si ya se alcanzó el nivel máximo
    const range = goal - currBase;
    const progress = totalHours - currBase;
    const percent = range > 0 ? Math.min(progress / range, 1) : 1;

    return { 
        level: level, 
        currBase: currBase, // Horas necesarias para el nivel actual
        goal: goal,         // Horas necesarias para el siguiente nivel
        percent: percent    // Porcentaje de progreso (0 a 1)
    };
}