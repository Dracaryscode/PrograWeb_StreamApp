import { useEffect, useMemo, useState } from "react";
import { getSessions, seedHoursIfEmpty, totalHours, progressToNext } from "../services/stream";

export default function Dashboard() {
  const [sessions, setSessions] = useState(() => getSessions());

  useEffect(() => {
    // Solo para que veas algo si no hay sesiones aún (quitar cuando implementes Req. 23)
    seedHoursIfEmpty(2);
    setSessions(getSessions());
  }, []);

  const hours = useMemo(() => totalHours(sessions), [sessions]);
  const prog = useMemo(() => progressToNext(hours), [hours]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Dashboard de Horas</h1>
      <p className="text-gray-600 mt-1">Resumen de tus transmisiones (mock en S8, sin backend).</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border p-4 bg-white">
          <div className="text-sm text-gray-500">Horas totales</div>
          <div className="text-4xl font-extrabold mt-1">{hours.toFixed(2)}h</div>
        </div>
        <div className="rounded-2xl border p-4 bg-white">
          <div className="text-sm text-gray-500">Nivel actual</div>
          <div className="text-4xl font-extrabold mt-1">{prog.level}</div>
        </div>
        <div className="rounded-2xl border p-4 bg-white">
          <div className="text-sm text-gray-500">Próximo objetivo</div>
          <div className="text-xl font-semibold mt-1">
            {prog.goal === prog.currBase ? "Máximo alcanzado" : `${prog.goal} h`}
          </div>
        </div>
      </div>

      {/* Barra de progreso hacia el siguiente nivel */}
      <div className="mt-6 rounded-2xl border p-4 bg-white">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{prog.currBase} h</span>
          <span>{prog.goal === prog.currBase ? `${hours.toFixed(2)} h` : `${prog.goal} h`}</span>
        </div>
        <div className="mt-2 h-3 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-blue-600"
            style={{ width: `${Math.round(prog.percent * 100)}%` }}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(prog.percent * 100)}
            role="progressbar"
          />
        </div>
        <div className="mt-2 text-sm text-gray-700">
          Progreso: <span className="font-semibold">{Math.round(prog.percent * 100)}%</span>
        </div>
      </div>

      {/* Listado de sesiones (útil para depurar) */}
      <div className="mt-6 rounded-2xl border p-4 bg-white">
        <h2 className="font-semibold mb-2">Sesiones registradas</h2>
        {sessions.length === 0 ? (
          <p className="text-gray-500">No hay sesiones aún.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {sessions.map((s, i) => (
              <li key={i} className="text-gray-700">
                {new Date(s.start).toLocaleString()} → {new Date(s.end).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
