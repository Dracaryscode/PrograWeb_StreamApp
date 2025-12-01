import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Gift } from "../types/gift";

export default function Gifts() {
  // --- 🧠 LÓGICA (EL CEREBRO) SE MANTIENE IGUAL ---
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: "", costo: "", puntos: "" });

  useEffect(() => {
    api.getGifts().then(setGifts);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const costoNum = parseFloat(form.costo);
    const puntosNum = parseInt(form.puntos);

    if (!form.nombre || isNaN(costoNum) || isNaN(puntosNum)) return;

    if (editingId) {
      const giftActualizado = { id: editingId, nombre: form.nombre, costo: costoNum, puntos: puntosNum };
      await api.updateGift(giftActualizado);
      setGifts(gifts.map(g => g.id === editingId ? giftActualizado : g));
      setEditingId(null);
    } else {
      const nuevo = { nombre: form.nombre, costo: costoNum, puntos: puntosNum };
      const creado = await api.createGift(nuevo);
      setGifts([...gifts, creado]);
    }
    setForm({ nombre: "", costo: "", puntos: "" });
  };

  const handleEdit = (gift: Gift) => {
    setEditingId(gift.id);
    setForm({ nombre: gift.nombre, costo: gift.costo.toString(), puntos: gift.puntos.toString() });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ nombre: "", costo: "", puntos: "" });
  };

  const handleDelete = async (id: string) => {
    await api.deleteGift(id);
    setGifts(gifts.filter((g) => g.id !== id));
  };

  // --- 🎨 VISTA (LA CARA) TOTALMENTE RENOVADA ---
  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen text-white">
      {/* Encabezado */}
      <div className="mb-8">
         <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#9f64ff] to-[#d3b9ff]">
           🎁 Gestión de Regalos
         </h1>
         <p className="text-gray-400 mt-2">Administra los items de tu tienda para la comunidad.</p>
      </div>

      {/* 1. Formulario estilo "Glass" */}
      <div className="bg-[#1A1B22] p-6 rounded-2xl border border-[#333] shadow-xl mb-10 relative overflow-hidden">
         {/* Un pequeño brillo de fondo decorativo */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#9f64ff] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

         <h2 className="text-xl font-bold mb-4 text-[#e6dff7] relative z-10">
            {editingId ? "✏️ Editando Regalo" : "✨ Crear Nuevo Regalo"}
         </h2>

         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative z-10">
           <div className="md:col-span-4">
             <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Nombre</label>
             <input
               placeholder="Ej: Lluvia de Likes"
               className="w-full bg-[#0b0b10] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9f64ff] transition"
               value={form.nombre}
               onChange={(e) => setForm({ ...form, nombre: e.target.value })}
             />
           </div>
           
           <div className="md:col-span-3">
             <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Costo (USD)</label>
             <input
               placeholder="0.00"
               type="number"
               step="0.01"
               className="w-full bg-[#0b0b10] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9f64ff] transition"
               value={form.costo}
               onChange={(e) => setForm({ ...form, costo: e.target.value })}
             />
           </div>

           <div className="md:col-span-3">
             <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Puntos</label>
             <input
               placeholder="0"
               type="number"
               className="w-full bg-[#0b0b10] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9f64ff] transition"
               value={form.puntos}
               onChange={(e) => setForm({ ...form, puntos: e.target.value })}
             />
           </div>
           
           <div className="md:col-span-2 flex gap-2">
             <button
               type="submit"
               className={`w-full font-bold rounded-xl px-4 py-3 transition shadow-lg transform active:scale-95 ${
                 editingId 
                   ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/20 text-white" 
                   : "bg-gradient-to-r from-[#9f64ff] to-[#7b2cbf] hover:shadow-[#9f64ff]/20 text-white"
               }`}
             >
               {editingId ? "Guardar" : "Crear"}
             </button>
             
             {editingId && (
               <button
                 type="button"
                 onClick={handleCancel}
                 className="bg-[#333] text-white font-bold rounded-xl px-4 py-3 hover:bg-[#444] transition"
                 title="Cancelar edición"
               >
                 ✕
               </button>
             )}
           </div>
         </form>
      </div>

      {/* 2. Grid de Tarjetas (Reemplaza a la Tabla) */}
      {gifts.length === 0 ? (
        <div className="text-center py-20 bg-[#1A1B22] rounded-2xl border border-dashed border-[#444]">
           <span className="text-4xl block mb-2">📦</span>
           <p className="text-gray-500">Tu inventario está vacío.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gifts.map((g) => (
            <div key={g.id} className="group bg-[#1A1B22] rounded-2xl p-5 border border-[#333] hover:border-[#9f64ff] transition-all duration-300 hover:shadow-2xl hover:shadow-[#9f64ff]/10 relative overflow-hidden">
               
               {/* Botones de acción flotantes */}
               <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button 
                    onClick={() => handleEdit(g)} 
                    className="bg-[#2a2a35] text-white p-2 rounded-lg hover:bg-[#9f64ff] transition shadow-lg" 
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(g.id)} 
                    className="bg-[#2a2a35] text-white p-2 rounded-lg hover:bg-red-500 transition shadow-lg" 
                    title="Eliminar"
                  >
                    🗑️
                  </button>
               </div>

               {/* Icono y Nombre */}
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#2c2c34] to-[#111] rounded-2xl flex items-center justify-center text-3xl border border-[#444] shadow-inner">
                     🎁
                  </div>
                  <div>
                     <h3 className="font-bold text-lg text-white leading-tight">{g.nombre}</h3>
                     <span className="text-[10px] font-bold tracking-wider uppercase text-[#a381f9] bg-[#a381f9]/10 px-2 py-1 rounded-md mt-1 inline-block">
                       Item Virtual
                     </span>
                  </div>
               </div>
               
               {/* Estadísticas del item */}
               <div className="grid grid-cols-2 gap-px bg-[#333] rounded-xl overflow-hidden border border-[#333]">
                  <div className="bg-[#0b0b10] p-3 text-center group-hover:bg-[#15151a] transition-colors">
                     <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Costo USD</p>
                     <p className="text-[#e6dff7] font-mono font-bold text-lg">${g.costo.toFixed(2)}</p>
                  </div>
                  <div className="bg-[#0b0b10] p-3 text-center group-hover:bg-[#15151a] transition-colors">
                     <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Puntos</p>
                     <p className="text-[#9f64ff] font-bold text-lg">{g.puntos}</p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
