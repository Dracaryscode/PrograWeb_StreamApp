import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Gifts() {
  const [gifts, setGifts] = useState([]);
  const [form, setForm] = useState({ nombre: "", costo: "", puntos: "" });

  useEffect(() => {
    api.getGifts().then(setGifts);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo = {
      nombre: form.nombre.trim(),
      costo: parseFloat(form.costo),
      puntos: parseInt(form.puntos),
    };
    if (!nuevo.nombre || isNaN(nuevo.costo) || isNaN(nuevo.puntos)) return;
    const creado = await api.createGift(nuevo);
    setGifts([...gifts, creado]);
    setForm({ nombre: "", costo: "", puntos: "" });
  };

  const handleDelete = async (id: string) => {
    await api.deleteGift(id);
    setGifts(gifts.filter((g: any) => g.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🎁 Gestión de Regalos
      </h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-8 bg-white p-4 rounded-2xl shadow"
      >
        <input
          placeholder="Nombre del regalo"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
        <input
          placeholder="Costo (USD)"
          type="number"
          step="0.01"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          value={form.costo}
          onChange={(e) => setForm({ ...form, costo: e.target.value })}
        />
        <input
          placeholder="Puntos"
          type="number"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          value={form.puntos}
          onChange={(e) => setForm({ ...form, puntos: e.target.value })}
        />
        <button
          className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700 transition"
        >
          Agregar
        </button>
      </form>

      {/* Tabla */}
      {gifts.length === 0 ? (
        <p className="text-gray-500 text-center">Aún no hay regalos creados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-xl shadow-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Costo</th>
                <th className="px-4 py-2 text-left">Puntos</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {gifts.map((g: any) => (
                <tr key={g.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{g.nombre}</td>
                  <td className="px-4 py-2">${g.costo.toFixed(2)}</td>
                  <td className="px-4 py-2">{g.puntos}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="text-red-600 hover:underline font-semibold"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
