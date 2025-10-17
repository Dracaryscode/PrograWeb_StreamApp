// src/services/stream.ts

// --- LÓGICA EXISTENTE DE SESIONES ---
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

export function totalHours(sessions: StreamSession[]): number {
    return sessions.reduce((acc, s) => {
        const durationMs = s.end.getTime() - s.start.getTime();
        return acc + durationMs / (1000 * 60 * 60);
    }, 0);
}

// --- NUEVA LÓGICA PARA CONFIGURACIÓN DE NIVELES ---
const LEVEL_CONFIG_KEY = "level_config_mock";

const PRESETS = {
  normal: [0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000],
  lenta: [0, 200, 500, 1200, 3000, 7000, 15000, 30000, 60000, 120000],
  rapida: [0, 50, 120, 250, 500, 1000, 2000, 4000, 7500, 15000],
};

export function getLevelConfig(): number[] {
  const data = localStorage.getItem(LEVEL_CONFIG_KEY);
  return data ? JSON.parse(data) : PRESETS.normal;
}

export function saveLevelConfig(levels: number[]): void {
  localStorage.setItem(LEVEL_CONFIG_KEY, JSON.stringify(levels));
}

export function getPreset(presetName: 'normal' | 'lenta' | 'rapida'): number[] {
  return PRESETS[presetName];
}

// --- FUNCIÓN DE PROGRESO ACTUALIZADA ---
export function progressToNext(totalHours: number) {
    const totalPoints = totalHours * 100; // Asumimos 1h = 100 puntos
    const LEVELS = getLevelConfig();
    let level = 1;
    for (let i = 0; i < LEVELS.length; i++) {
        if (totalPoints >= LEVELS[i]) {
            level = i + 1;
        } else { break; }
    }

    const currBase = LEVELS[level - 1] ?? 0;
    const goal = LEVELS[level] ?? currBase;
    const range = goal - currBase;
    const progress = totalPoints - currBase;
    const percent = range > 0 ? Math.min(progress / range, 1) : 1;

    return { 
        level: level, 
        currBase: currBase,
        goal: goal,
        percent: percent,
        currentPoints: totalPoints
    };
}