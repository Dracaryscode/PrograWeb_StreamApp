import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../app/auth";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import styles from "./StreamPage.module.css";
import fondoDirecto from "../../assets/fondoDirecto.webp";
import perfil from "../../assets/perfil.jpg";
import GiftShopModal, { type GiftUI } from "./GiftShopModal";
import GiftAlert from "../../components/GiftAlert";
import { api } from "../../services/api";

type ChatTextMessage = {
  id: string | number;
  type: "text";
  user: string;
  text: string;
  level: number;
  badge?: "MOD" | "SUB" | "VIP" | "none";
};
type ChatGiftMessage = {
  id: string | number;
  type: "gift";
  user: string;
  gift: GiftUI;
};
type ChatMessage = ChatTextMessage | ChatGiftMessage;
type AlertData = { user: string; gift: GiftUI; id: number };

export default function StreamPage() {
  const { channel = "channel" } = useParams();
  const { user, logout, tokens } = useAuth();
  const [input, setInput] = useState("");
  const [isGiftOpen, setGiftOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [isChatVisible, setChatVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<"about" | "recommended" | "clips">("about");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [gifts, setGifts] = useState<GiftUI[]>([]);
  const [alertQueue, setAlertQueue] = useState<AlertData[]>([]);
  const [currentAlert, setCurrentAlert] = useState<AlertData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const streamId = Number(import.meta.env.VITE_DEFAULT_STREAM_ID ?? 0);
  const streamerId = Number(import.meta.env.VITE_DEFAULT_STREAMER_ID ?? 0);
  const viewerId = user?.perfilId ?? Number(import.meta.env.VITE_DEFAULT_VIEWER_ID ?? 0);

  useEffect(() => { document.title = `${channel} - Live`; }, [channel]);
  useEffect(() => { const el = listRef.current; if (el) el.scrollTop = el.scrollHeight; }, [messages]);
  useEffect(() => {
    if (currentAlert === null && alertQueue.length > 0) {
      const nextAlert = alertQueue[0];
      setCurrentAlert(nextAlert);
      setAlertQueue(prev => prev.slice(1));
    }
  }, [currentAlert, alertQueue]);

  const title = useMemo(() => `${channel} Live`, [channel]);

  useEffect(() => {
    const loadData = async () => {
      setError(null);
      try {
        if (streamId) {
          const chat = await api.getMensajes(streamId, tokens?.accessToken);
          const mapped: ChatMessage[] = chat.map((m: any) => ({
            id: m.id,
            type: m.tipo === "regalo" ? "gift" : "text",
            user: m.usuario_nombre ?? "Usuario",
            text: m.mensaje ?? "",
            level: m.nivel_usuario ?? 1,
            badge: (m.badge as any) ?? "none",
            gift: m.gift_id ? { id: m.gift_id, nombre: m.gift_nombre ?? "Regalo", costo_coins: 0, puntos_otorgados: 0 } : undefined,
          })).filter(Boolean) as any;
          setMessages(mapped);
        }
        if (streamerId) {
          const giftData = await api.listGifts(streamerId, tokens?.accessToken);
          setGifts(giftData.map(g => ({ id: g.id, nombre: g.nombre, costo_coins: g.costo_coins, puntos_otorgados: g.puntos_otorgados, emoji: "🎁" })));
        }
      } catch {
        setError("No se pudo cargar el stream. Ajusta las envs o verifica el backend.");
      }
    };
    loadData();
  }, [streamId, streamerId, tokens?.accessToken]);

  const onSend = async () => {
    const text = input.trim();
    if (!text || !streamId || !viewerId) return;
    try {
      await api.sendMensaje(streamId, { viewerId, mensaje: text }, tokens?.accessToken);
      setMessages(prev => [...prev, { id: crypto.randomUUID(), type: "text", user: user?.name ?? "Tú", level: 1, text }]);
      setInput("");
    } catch {
      setError("No se pudo enviar el mensaje.");
    }
  };

  const sendGift = async (gift: GiftUI) => {
    if (!streamId || !viewerId) {
      setError("Falta streamId o viewerId. Configura VITE_DEFAULT_STREAM_ID / VITE_DEFAULT_VIEWER_ID.");
      return;
    }
    try {
      await api.enviarRegalo(streamId, gift.id, { viewerId, cantidad: 1, mensaje: "" }, tokens?.accessToken);
      const sender = user?.name ?? "Viewer";
      setAlertQueue(prev => [...prev, { user: sender, gift, id: Date.now() }]);
      setBalance(b => Math.max(0, b - gift.costo_coins));
      setMessages(prev => [...prev, { id: crypto.randomUUID(), type: "gift", user: sender, gift }]);
      setGiftOpen(false);
    } catch {
      setError("No se pudo enviar el regalo.");
    }
  };

  const handleLogout = () => { logout(); };

  const RoleBadge: React.FC<{ badge: "MOD" | "SUB" | "VIP" | "none" }> = ({ badge }) => {
    if (badge === "none") return null;
    const badgeStyle = styles[`badge${badge}`];
    return <span className={`${styles.roleBadge} ${badgeStyle}`}>{badge}</span>;
  };

  return (
    <div className={styles.shell}>
      <Header onLogin={() => {}} onRegister={() => {}} user={user} />
      <div className={styles.grid}>
        <aside className={styles.sideLeft}>
          <Sidebar user={user} onLogout={handleLogout} />
        </aside>
        <main className={styles.center}>
          <div className={styles.playerWrap}>
              {currentAlert && (
                <GiftAlert
                  key={currentAlert.id}
                  user={currentAlert.user}
                  gift={currentAlert.gift}
                  onDone={() => setCurrentAlert(null)}
                />
              )}
              <img src={fondoDirecto} alt="Fondo de stream" className={styles.player} />
          </div>
          <div className={styles.playerFooter}>
             <div className={styles.streamMeta}>
               <img src={perfil} alt="Avatar del canal" className={styles.avatar} />
              <div>
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.subtitle}>
                  <span className={styles.livePill}>LIVE</span><span className={styles.dot} />
                </div>
              </div>
            </div>
            <div className={styles.playerActions}>
              <button className={`${styles.btn} ${styles.btnFollow}`}>Seguir</button>
              <button className={styles.btnPrimary} onClick={() => setGiftOpen(true)}>🎁 Regalos</button>
              <button className={styles.btn}>Suscribirse</button>
            </div>
          </div>
          <div className={styles.tabs}>
            <button className={activeTab === "about" ? styles.tabActive : styles.tab} onClick={() => setActiveTab("about")}>Acerca de</button>
            <button className={activeTab === "recommended" ? styles.tabActive : styles.tab} onClick={() => setActiveTab("recommended")}>Recomendado</button>
            <button className={activeTab === "clips" ? styles.tabActive : styles.tab} onClick={() => setActiveTab("clips")}>Clips</button>
          </div>
          {activeTab === "about" && (
              <div className={styles.aboutCard}>
                  <h2 className={styles.aboutTitle}>Acerca de:</h2>
                  <p className={styles.aboutText}>Se llenará con los datos del backend del canal.</p>
              </div>
          )}
          {error && <div className={styles.errorText}>{error}</div>}
        </main>
        <aside className={`${styles.chat} ${!isChatVisible ? styles.chatHidden : ""}`}>
            <div className={styles.chatHeader}>
              <h4>Chat del Stream</h4>
              <button className={styles.btnSubtle} onClick={() => setChatVisible(prev => !prev)}>
                  {isChatVisible ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <div className={styles.messages} ref={listRef}>
              {messages.map((m) => (
                m.type === "text" ? (
                  <div key={m.id} className={styles.chatLine}>
                    {m.badge && <RoleBadge badge={m.badge} />}
                    <span className={styles.levelBadge}>LV. {m.level}</span>
                    <span className={styles.username}>{m.user}:</span>
                    <span className={styles.text}>{m.text}</span>
                  </div>
                ) : (
                  <div key={m.id} className={styles.giftMsg}>
                    <span className={styles.username}>{m.user}</span>
                    <span className={styles.sent}>envió un regalo:</span>
                    <span className={styles.giftBadge}>
                      <span className={styles.giftEmoji}>{m.gift.emoji ?? "🎁"}</span>
                      <span className={styles.giftName}>{m.gift.nombre}</span>
                      <span className={styles.kSmall}>L {m.gift.costo_coins}</span>
                    </span>
                  </div>
                )
              ))}
            </div>
            <div className={styles.inputRow}>
              <div className={styles.coin}>L {balance}</div>
              <input className={styles.input} type="text" placeholder="Enviar un mensaje" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && onSend()} />
              <button className={styles.iconGift} onClick={() => setGiftOpen(true)}>🎁</button>
              <button className={styles.send} onClick={onSend}>Enviar</button>
            </div>
        </aside>
      </div>
      <GiftShopModal
        open={isGiftOpen} balance={balance} gifts={gifts}
        onClose={() => setGiftOpen(false)} onSend={sendGift}
        onGetKpoints={() => alert("Conecta la compra en la Tienda.")}
      />
    </div>
  );
}
