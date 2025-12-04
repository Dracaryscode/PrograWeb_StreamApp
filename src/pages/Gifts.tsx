import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import type { Gift } from "../types/gift";
import "./Gifts.css";
import { useAuth } from "../app/auth";

type FormState = { nombre: string; costo_coins: string; puntos_otorgados: string; costo_usd: string; emoji: string };

export default function Gifts() {
  const { user, tokens } = useAuth();
  const baseStreamerId = useMemo(
    () => user?.perfilId ?? Number(import.meta.env.VITE_DEFAULT_STREAMER_ID ?? 0),
    [user?.perfilId]
  );
  const [streamerId, setStreamerId] = useState<number | null>(baseStreamerId || null);

  const [gifts, setGifts] = useState<Gift[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>({ nombre: "", costo_coins: "", puntos_otorgados: "", costo_usd: "", emoji: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resolver streamerId si el perfil no lo trae
  useEffect(() => {
    const resolve = async () => {
      if (streamerId) return;
      if (user?.id) {
        try {
          const dash = await api.getStreamerDashboard(user.id, tokens?.accessToken);
          if (dash?.id) setStreamerId(dash.id);
        } catch {
          setStreamerId(null);
        }
      }
    };
    resolve();
  }, [streamerId, user?.id, tokens?.accessToken]);

  useEffect(() => {
    const load = async () => {
      if (!streamerId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await api.listGifts(streamerId, tokens?.accessToken);
        setGifts(data);
      } catch (err: any) {
        setError("No se pudieron cargar los regalos. Verifica el backend o las credenciales.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [streamerId, tokens?.accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamerId) return;
    const costoCoins = Number(form.costo_coins);
    const puntos = Number(form.puntos_otorgados);
    const costoUsd = form.costo_usd ? Number(form.costo_usd) : null;
    if (!form.nombre || Number.isNaN(costoCoins) || Number.isNaN(puntos)) return;

    setError(null);
    try {
      if (editingId) {
        const updated = await api.updateGift(streamerId, editingId, {
          nombre: form.nombre,
          costo_usd: costoUsd,
          costo_coins: costoCoins,
          puntos_otorgados: puntos,
          emoji: form.emoji || null,
        }, tokens?.accessToken);
        setGifts(gifts.map((g) => (g.id === editingId ? updated : g)));
        setEditingId(null);
      } else {
        const created = await api.createGift(streamerId, {
          nombre: form.nombre,
          costo_usd: costoUsd,
          costo_coins: costoCoins,
          puntos_otorgados: puntos,
          emoji: form.emoji || null,
        }, tokens?.accessToken);
        setGifts([created, ...gifts]);
      }
      setForm({ nombre: "", costo_coins: "", puntos_otorgados: "", costo_usd: "", emoji: "" });
    } catch (err: any) {
      setError("No se pudo guardar el regalo. Revisa la conexión o los datos.");
    }
  };

  const handleEdit = (gift: Gift) => {
    setEditingId(gift.id);
    setForm({
      nombre: gift.nombre,
      costo_coins: gift.costo_coins.toString(),
      puntos_otorgados: gift.puntos_otorgados.toString(),
      costo_usd: gift.costo_usd ? gift.costo_usd.toString() : "",
      emoji: gift.emoji || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ nombre: "", costo_coins: "", puntos_otorgados: "", costo_usd: "", emoji: "" });
  };

  const handleDelete = async (id: number) => {
    if (!streamerId) return;
    setError(null);
    try {
      await api.deleteGift(streamerId, id, tokens?.accessToken);
      setGifts(gifts.filter((g) => g.id !== id));
    } catch {
      setError("No se pudo eliminar el regalo.");
    }
  };

  if (!user || user.role !== "streamer") {
    return <div className="gifts-page">Inicia sesiA3n como streamer para administrar tus regalos.</div>;
  }

  return (
    <div className="gifts-page">
      <div className="gifts-header">
         <h1 className="gifts-title">Gestion de Regalos</h1>
         <p className="gifts-subtitle">Crea y edita los items que ver tu comunidad.</p>
      </div>

      <div className="glass-panel">
         <div className="glass-glow"></div>
         <h2 className="panel-title">
            {editingId ? "Editando Regalo" : "Crear Nuevo Regalo"}
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
             <label className="form-label">Costo (coins)</label>
             <input
               placeholder="0"
               type="number"
               step="1"
               className="form-input"
               value={form.costo_coins}
               onChange={(e) => setForm({ ...form, costo_coins: e.target.value })}
             />
           </div>

           <div className="form-group col-points">
             <label className="form-label">Puntos otorgados</label>
             <input
               placeholder="0"
               type="number"
               className="form-input"
               value={form.puntos_otorgados}
               onChange={(e) => setForm({ ...form, puntos_otorgados: e.target.value })}
             />
           </div>

           <div className="form-group col-points">
             <label className="form-label">Costo USD (opcional)</label>
             <input
               placeholder="0.00"
               type="number"
               step="0.01"
               className="form-input"
               value={form.costo_usd}
               onChange={(e) => setForm({ ...form, costo_usd: e.target.value })}
             />
           </div>

           <div className="form-group col-name">
             <label className="form-label">Emoji (opcional)</label>
             <input
               placeholder="Ej: 🎁"
               className="form-input"
               value={form.emoji}
               onChange={(e) => setForm({ ...form, emoji: e.target.value })}
             />
           </div>
           
           <div className="form-group col-actions">
             <button
               type="submit"
               className={`btn-primary ${editingId ? 'is-editing' : ''}`}
               disabled={loading}
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
                 Cancelar
               </button>
             )}
           </div>
         </form>
         {error && <div className="error-text">{error}</div>}
      </div>

      {loading && <div className="empty-state">Cargando...</div>}
      {!loading && gifts.length === 0 ? (
        <div className="empty-state">
           <span style={{fontSize: "3rem", display: "block"}}>✳</span>
           <p>Aún no hay regalos creados.</p>
        </div>
      ) : (
        <div className="gifts-grid">
          {gifts.map((g) => (
            <div key={g.id} className="gift-card">
               
               <div className="card-actions">
                  <button onClick={() => handleEdit(g)} className="icon-btn" title="Editar">✎</button>
                  <button onClick={() => handleDelete(g.id)} className="icon-btn delete" title="Eliminar">🗑</button>
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
                     <p className="stat-label">Costo coins</p>
                     <p className="stat-value" style={{color: "#e6dff7"}}>{g.costo_coins} coins</p>
                  </div>
                  <div className="divider-vertical"></div>
                  <div className="stat">
                     <p className="stat-label">Puntos</p>
                     <p className="stat-value" style={{color: "#9f64ff"}}>{g.puntos_otorgados} pts</p>
                  </div>
                  {(() => {
                    const usd = Number(g.costo_usd);
                    return Number.isFinite(usd);
                  })() && (
                    <>
                      <div className="divider-vertical"></div>
                      <div className="stat">
                        <p className="stat-label">Costo USD</p>
                        <p className="stat-value" style={{color: "#e6dff7"}}>${Number(g.costo_usd).toFixed(2)}</p>
                      </div>
                    </>
                  )}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
