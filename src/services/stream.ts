// --- LÓGICA DE SESIONES ---
export interface StreamSession { start: Date; end: Date; }
const SESSIONS_KEY = "stream_sessions_mock";

export function getSessions(): StreamSession[] {
    const data = localStorage.getItem(SESSIONS_KEY);
    if (!data) return [];
    try {
        return JSON.parse(data).map((s: any) => ({
            start: new Date(s.start),
            end: new Date(s.end),
        }));
    } catch { return []; }
}

export function setSessions(sessions: StreamSession[]): void {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function addSession(newSession: StreamSession): void {
    const sessions = getSessions();
    sessions.push(newSession);
    setSessions(sessions);
}

// --- LÓGICA PARA CONFIGURACIÓN DE NIVELES ---
const LEVEL_CONFIG_KEY = "level_config_mock";

// Los presets ahora definen las HORAS necesarias para cada nivel
const PRESETS = {
  normal: [0, 15, 45, 90, 150, 240, 360],
  lenta: [0, 30, 90, 180, 300, 480, 720],
  rapida: [0, 5, 15, 30, 60, 90, 120], // Ideal para la demo
};

export function getLevelConfig(): number[] {
  const data = localStorage.getItem(LEVEL_CONFIG_KEY);
  return data ? JSON.parse(data) : PRESETS.rapida;
}

export function saveLevelConfig(levels: number[]): void {
  localStorage.setItem(LEVEL_CONFIG_KEY, JSON.stringify(levels));
}

export function getPreset(presetName: 'normal' | 'lenta' | 'rapida'): number[] {
  return PRESETS[presetName];
}

// --- FUNCIONES DE CÁLCULO ---

// Devuelve el total de "horas simuladas" (1 segundo real = 1 hora simulada)
export function totalHours(sessions: StreamSession[]): number {
    return sessions.reduce((acc, s) => {
        const durationMs = s.end.getTime() - s.start.getTime();
        return acc + durationMs / 1000; // 1 segundo = 1 "hora"
    }, 0);
}

// Calcula el progreso basado en el total de horas simuladas
export function progressToNext(currentHours: number) {
    const LEVELS = getLevelConfig();
    let level = 1;
    for (let i = 0; i < LEVELS.length; i++) {
        if (currentHours >= LEVELS[i]) {
            level = i + 1;
        } else { break; }
    }

    const currBase = LEVELS[level - 1] ?? 0; // Horas para el nivel actual
    const goal = LEVELS[level] ?? currBase;   // Horas para el siguiente nivel
    const range = goal - currBase;
    const progress = currentHours - currBase;
    const percent = range > 0 ? Math.min(progress / range, 1) : 1;

    return { 
        level, 
        currBase,
        goal,
        percent,
        currentHours
    };
}