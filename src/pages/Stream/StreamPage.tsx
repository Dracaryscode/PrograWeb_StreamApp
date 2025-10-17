// src/pages/StreamPage.tsx

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import styles from './StreamPage.module.css';
import fondoDirecto from '../../assets/fondoDirecto.webp';
import perfil from '../../assets/perfil.jpg';
import GiftShopModal, { type Gift } from './GiftShopModal';
import GiftAlert from '../../components/GiftAlert';

// --- Tus Tipos de Datos (con nivel añadido) ---
type ChatTextMessage = {
  id: string;
  type: 'text';
  user: string;
  text: string;
  level: number;
  badge?: 'MOD' | 'SUB' | 'VIP';
};
type ChatGiftMessage = {
  id: string;
  type: 'gift';
  user: string;
  gift: Gift;
};
type ChatMessage = ChatTextMessage | ChatGiftMessage;
type AlertData = { user: string; gift: Gift; id: number };

export default function StreamPage() {
  const { channel = 'channel' } = useParams();
  const [user, setUser] = useState<any>({ name: 'Tu Nombre', role: 'streamer' });
  const [input, setInput] = useState('');
  const [isGiftOpen, setGiftOpen] = useState(false);
  const [balance, setBalance] = useState(1000);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [isChatVisible, setChatVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'recommended' | 'clips'>('about');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: crypto.randomUUID(), type: 'text', user: 'ElProfe', badge: 'VIP', level: 99, text: '¡BIENVENIDOS al directo de hoy! Espero que lo disfruten al máximo.' },
    { id: crypto.randomUUID(), type: 'text', user: 'Maria_GG', badge: 'SUB', level: 25, text: 'Hola a todos! Lista para la partida 🔥' },
    { id: crypto.randomUUID(), type: 'text', user: 'NoobMaster69', level: 1, text: 'Hola, soy nuevo aquí, ¿de qué me perdí?' },
    { id: crypto.randomUUID(), type: 'text', user: 'DracarysCode', badge: 'MOD', level: 50, text: '¡Qué empiece la acción!' },
    { id: crypto.randomUUID(), type: 'text', user: 'FanDeTiktok', level: 12, text: '¡Vamos por esa victoria! 💪' },
    { id: crypto.randomUUID(), type: 'text', user: 'mateo', badge: 'SUB', level: 7, text: 'chau' },
    { id: crypto.randomUUID(), type: 'text', user: 'mod_karen', badge: 'MOD', level: 50, text: 'Bienvenido al stream' },
    { id: crypto.randomUUID(), type: 'text', user: 'juan123', level: 12, text: 'hola a todos' },
    { id: crypto.randomUUID(), type: 'text', user: 'sub_pato', badge: 'SUB', level: 25, text: '¡Qué emoción!' },
  ]);
  const [alertQueue, setAlertQueue] = useState<AlertData[]>([]);
  const [currentAlert, setCurrentAlert] = useState<AlertData | null>(null);

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
  const gifts: Gift[] = [
    { id: 'Like', name: 'Like', price: 1, emoji: '👍' },
    { id: 'hype', name: 'Hype', price: 10, emoji: '⚡' },
    { id: 'calavera', name: 'Calavera', price: 50, emoji: '💀' },
  ];

  const onSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: crypto.randomUUID(), type: 'text', user: 'TúMismo', level: 42, text }]);
    setInput('');
  };

  const sendGift = (gift: Gift) => {
    if (balance < gift.price) {
      alert('No tienes L suficientes (simulado).');
      return;
    }
    const sender = 'EspectadorPro';
    setAlertQueue(prev => [...prev, { user: sender, gift, id: Date.now() }]);
    setBalance(b => b - gift.price);
    setMessages(prev => [
      ...prev,
      { id: crypto.randomUUID(), type: 'gift', user: sender, gift },
    ]);
    setGiftOpen(false);
  };

  const handleLogout = () => { setUser(null); };

  const RoleBadge: React.FC<{ badge: 'MOD' | 'SUB' | 'VIP' }> = ({ badge }) => {
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
             <div className={styles.playerActions}>
                <button className={`${styles.btn} ${styles.btnFollow}`}>Seguir</button>
                <button className={styles.btnPrimary} onClick={() => setGiftOpen(true)}>🎁 Regalos Puntos</button>
                <button className={styles.btn}>Suscribirse</button>
                <button className={styles.btnSubtle} onClick={() => setChatVisible(prev => !prev)}>
                    {isChatVisible ? 'Ocultar Chat' : 'Mostrar Chat'}
                </button>
             </div>
             <div className={styles.tabs}>
                <button className={activeTab === 'about' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('about')}>Acerca de</button>
                <button className={activeTab === 'recommended' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('recommended')}>Recomendado</button>
                <button className={activeTab === 'clips' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('clips')}>Clips</button>
             </div>
          </div>
          {activeTab === 'about' && (
              <div className={styles.aboutCard}>
                  <h2 className={styles.aboutTitle}>Acerca de:</h2>
                  <p className={styles.aboutText}>Descripción del canal... se reemplazará con el backend más adelante.</p>
              </div>
          )}
          <div className={styles.streamMeta}>
             <img src={perfil} alt="Avatar del canal" className={styles.avatar} />
            <div>
              <h1 className={styles.title}>{title}</h1>
              <div className={styles.subtitle}>
                <span className={styles.livePill}>LIVE</span><span className={styles.dot} />
              </div>
            </div>
          </div>
        </main>
        <aside className={`${styles.chat} ${!isChatVisible ? styles.chatHidden : ''}`}>
            <div className={styles.chatHeader}>
              <h4>Chat del Stream</h4>
              <span className={styles.viewers}>125</span>
            </div>
            <div className={styles.messages} ref={listRef}>
              {messages.map(m => (
                m.type === 'text' ? (
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
                      <span className={styles.giftEmoji}>{m.gift.emoji}</span>
                      <span className={styles.giftName}>{m.gift.name}</span>
                      <span className={styles.kSmall}>L {m.gift.price}</span>
                    </span>
                  </div>
                )
              ))}
            </div>
            <div className={styles.inputRow}>
              <div className={styles.coin}>L {balance}</div>
              <input className={styles.input} type="text" placeholder="Enviar un mensaje" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSend()} />
              <button className={styles.iconGift} onClick={() => setGiftOpen(true)}>🎁</button>
              <button className={styles.send} onClick={onSend}>Enviar</button>
            </div>
        </aside>
      </div>
      <GiftShopModal
        open={isGiftOpen} balance={balance} gifts={gifts}
        onClose={() => setGiftOpen(false)} onSend={sendGift}
        onGetKpoints={() => alert('Simular: comprar L Puntos')}
      />
    </div>
  );
}
