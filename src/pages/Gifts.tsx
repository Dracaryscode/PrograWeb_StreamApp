import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Gift } from "../types/gift";
import "./Gifts.css"; // ✨ IMPORTANTE: Importamos los estilos

export default function Gifts() {
  // --- 🧠 LÓGICA (SE MANTIENE IGUAL) ---
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

  // --- 🎨 VISTA (Ahora usa las clases del CSS) ---
  return (
    <div className="gifts-page">
      <div className="gifts-header">
         <h1 className="gifts-title">🎁 Gestión de Regalos</h1>
         <p className="gifts-subtitle">Administra los items de tu tienda para la comunidad.</p>
      </div>

      {/* Formulario */}
      <div className="glass-panel">
         <div className="glass-glow"></div>
         <h2 className="panel-title">
            {editingId ? "✏️ Editando Regalo" : "✨ Crear Nuevo Regalo"}
         </h2>

         <form onSubmit={handleSubmit} className="gifts-form">
           <div className="form-group col-name">
             <label className="form-label">Nombre</label>
             <input
               placeholder="Ej: Lluvia de Likes"
               className="form-input"
               value={form.nombre}
               onChange={(e) => setForm({ ...form, nombre: e.target.value })}
             />
           </div>
           
           <div className="form-group col-cost">
             <label className="form-label">Costo (USD)</label>
             <input
               placeholder="0.00"
               type="number"
               step="0.01"
               className="form-input"
               value={form.costo}
               onChange={(e) => setForm({ ...form, costo: e.target.value })}
             />
           </div>

           <div className="form-group col-points">
             <label className="form-label">Puntos</label>
             <input
               placeholder="0"
               type="number"
               className="form-input"
               value={form.puntos}
               onChange={(e) => setForm({ ...form, puntos: e.target.value })}
             />
           </div>
           
           <div className="form-group col-actions">
             <button
               type="submit"
               className={`btn-primary ${editingId ? 'is-editing' : ''}`}
             >
               {editingId ? "Guardar" : "Crear"}
             </button>
             
             {editingId && (
               <button
                 type="button"
                 onClick={handleCancel}
                 className="btn-secondary"
                 title="Cancelar"
               >
                 ✕
               </button>
             )}
           </div>
         </form>
      </div>

      {/* Grid de Regalos */}
      {gifts.length === 0 ? (
        <div className="empty-state">
           <span style={{fontSize: "3rem", display: "block"}}>📦</span>
           <p>Tu inventario está vacío.</p>
        </div>
      ) : (
        <div className="gifts-grid">
          {gifts.map((g) => (
            <div key={g.id} className="gift-card">
               
               <div className="card-actions">
                  <button onClick={() => handleEdit(g)} className="icon-btn" title="Editar">✏️</button>
                  <button onClick={() => handleDelete(g.id)} className="icon-btn delete" title="Eliminar">🗑️</button>
               </div>

               <div className="card-header">
                  <div className="gift-icon-box">🎁</div>
                  <div>
                     <h3 className="gift-name">{g.nombre}</h3>
                     <span className="gift-tag">Item Virtual</span>
                  </div>
               </div>
               
               <div className="card-stats">
                  <div className="stat">
                     <p className="stat-label">Costo USD</p>
                     <p className="stat-value" style={{color: "#e6dff7"}}>${g.costo.toFixed(2)}</p>
                  </div>
                  <div className="divider-vertical"></div>
                  <div className="stat">
                     <p className="stat-label">Puntos</p>
                     <p className="stat-value" style={{color: "#9f64ff"}}>{g.puntos} pts</p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
