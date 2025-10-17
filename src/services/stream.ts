// Estructura de una sesión de stream
export type StreamSession = { start: number; end: number }; // timestamps ms

const KEY = "streamSessions";

export function getSessions(): StreamSession[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function setSessions(s: StreamSession[]) {
  localStorage.setItem(KEY, JSON.stringify(s));
}


// Útil para pruebas mientras no tenemos el Req. 23:
// Agrega una sesión mock de N horas hacia atrás.
export function seedHoursIfEmpty(hours = 2) {
  const sessions = getSessions();
  if (sessions.length === 0) {
    const now = Date.now();
    const start = now - hours * 60 * 60 * 1000;
    localStorage.setItem(KEY, JSON.stringify([{ start, end: now }]));
  }
}

export function totalHours(sessions = getSessions()): number {
  return sessions.reduce((acc, s) => acc + Math.max(0, (s.end - s.start)) / 36e5, 0);
}

// Niveles por horas (ajústalo a tu gusto)
const LEVELS = [0, 5, 10, 20, 35, 50, 75, 100]; // límites inferiores
export function levelFromHours(hours: number) {
  let lvl = 1;
  for (let i = 0; i < LEVELS.length; i++) {
    if (hours >= LEVELS[i]) lvl = i + 1;
  }
  const next = LEVELS[Math.min(LEVELS.length, lvl)]; // objetivo del siguiente nivel
  return { level: lvl, nextGoal: next ?? null };
}

export function progressToNext(hours: number) {
  const { level, nextGoal } = levelFromHours(hours);
  const currBase = LEVELS[Math.max(0, level - 1)];
  const goal = nextGoal ?? currBase;
  const pct = goal === currBase ? 1 : Math.min(1, (hours - currBase) / (goal - currBase));
  return { percent: pct, level, currBase, goal };
}
