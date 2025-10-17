import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import styles from './StreamPage.module.css'
import fondoDirecto from '../../assets/fondoDirecto.webp'
import perfil from '../../assets/perfil.jpg'

import GiftShopModal, { type Gift } from './GiftShopModal'

type ChatTextMessage = {
  id: string
  type: 'text'
  user: string
  text: string
  badge?: 'MOD' | 'SUB' | 'VIP'
}

type ChatGiftMessage = {
  id: string
  type: 'gift'
  user: string
  gift: Gift
}

type ChatMessage = ChatTextMessage | ChatGiftMessage

export default function StreamPage() {
  const { channel = 'channel' } = useParams()
  const navigate = useNavigate()

  const onNavigate = (page: string) => {
    if (page === 'home' || page === 'inicio') navigate('/')
    else navigate('/')
  }

  const openLogin = () => {}
  const openRegister = () => {}

  const [collapsed, setCollapsed] = useState(false)
  const [input, setInput] = useState('')

 
  const [isGiftOpen, setGiftOpen] = useState(false)
  const [balance, setBalance] = useState(1000) 
  const gifts: Gift[] = [
    { id: 'Like', name: 'Like', price: 1, emoji: ' 👍' },
    { id: 'hype',      name: 'Hype',      price: 10, emoji: '⚡' },
    { id: 'calavera',     name: 'Calavera',     price: 50, emoji: '💀' },
    { id: 'algo',  name: 'Ni Idea', price: 100, emoji: '🟢' },
    { id: 'gg',        name: 'gg',        price: 5, emoji: '🏁' },
    { id: 'Amor',     name: 'Amor',     price: 20, emoji: '💜' },
  ]

  const [messages, setMessages] = useState<ChatMessage[]>(() => ([
    { id: crypto.randomUUID(), type: 'text', user: 'mod_karen', badge: 'MOD', text: 'Bienvenido' },
    { id: crypto.randomUUID(), type: 'text', user: 'juan123', text: 'hola a todos ' },
    { id: crypto.randomUUID(), type: 'text', user: 'sub_pato', badge: 'SUB', text: 'algo deberia ir aqui' },
    { id: crypto.randomUUID(), type: 'text', user: 'jsoe', badge: 'MOD', text: 'Recuerden las reglas' },
    { id: crypto.randomUUID(), type: 'text', user: 'juan23', text: 'hola a todos ' },
    { id: crypto.randomUUID(), type: 'text', user: 'mateo', badge: 'SUB', text: 'chau' },
  ]))

  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { document.title = `${channel} - Live` }, [channel])
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const title = useMemo(() => `${channel} Live`, [channel])

  const onSend = () => {
    const text = input.trim()
    if (!text) return
    setMessages(prev => [...prev, { id: crypto.randomUUID(), type: 'text', user: 'tu', text }])
    setInput('')
  }

  const sendGift = (gift: Gift) => {
    if (balance < gift.price) {
      alert('No tienes L suficientes (simulado).')
      return
    }
    setBalance(b => b - gift.price)
    setMessages(prev => [
      ...prev,
      { id: crypto.randomUUID(), type: 'gift', user: 'tu', gift }
    ])
    setGiftOpen(false)
  }

  return (
    <div className={styles.shell}>
      <Header onLogin={openLogin} onRegister={openRegister} />

      <div className={styles.grid}>
        <aside className={styles.sideLeft}>
          <Sidebar />
        </aside>

        <main className={styles.center}>
          <div className={styles.streamMeta}>
            <img src={perfil} alt="Avatar del canal" className={styles.avatar} />
            <div>
              <h1 className={styles.title}>{title}</h1>
              <div className={styles.subtitle}>
                <span className={styles.livePill}>LIVE</span>
                <span className={styles.dot} />
                <span>5,107 viewers</span>
                <span className={styles.dot} />
                <span>{channel}</span>
              </div>
            </div>
          </div>

          <div className={styles.playerWrap}>
            <video
              className={styles.player}
              controls
              poster={fondoDirecto}
            >
              <source src="" type="video/mp4" />
              Tu navegador no soporta video HTML5
            </video>

            <div className={styles.actions}>
              <button className={styles.btnPrimary}>Seguir</button>
              <button className={styles.btn} onClick={() => setGiftOpen(true)}>Regalos Puntos</button>
              <button className={styles.btn}>Suscribirse</button>
              <button
                className={styles.btn}
                onClick={() => setCollapsed(v => !v)}
                aria-pressed={collapsed}
              >
                {collapsed ? 'Mostrar Chat' : 'Ocultar Chat'}
              </button>
            </div>
          </div>

          <div className={styles.tabs}>
            <button className={`${styles.tab} ${styles.tabActive}`}>Acerca de</button>
            <button className={styles.tab}>Recomendado</button>
            <button className={styles.tab}>Clips</button>
          </div>

          <div className={styles.aboutCard}>
            <h2>Acerca de: </h2>
            <p>Descripción del canal... se reemplazará con el backend más adelante.</p>
          </div>
        </main>

        <aside className={`${styles.chat} ${collapsed ? styles.chatHidden : ''}`} aria-label="Chat en vivo">
          <div className={styles.chatHeader}>
            <strong>Chat</strong>
            <span className={styles.viewers}>5,107</span>
          </div>

          <div className={styles.messages} ref={listRef}>
            {messages.map(m => (
              m.type === 'text' ? (
                <div key={m.id} className={styles.message}>
                  <span className={styles.username}>
                    {m.user}
                    {m.badge && <span className={`${styles.badge} ${styles['badge' + m.badge]}`}>{m.badge}</span>}
                  </span>
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

            <input
              className={styles.input}
              type="text"
              placeholder="Enviar un mensaje"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onSend()}
              aria-label="Escribe un mensaje"
            />

            <button className={styles.iconGift} onClick={() => setGiftOpen(true)} title="Abrir Gift shop">🎁</button>
            <button className={styles.send} onClick={onSend}>Enviar</button>
          </div>
        </aside>
      </div>

     
      <GiftShopModal
        open={isGiftOpen}
        balance={balance}
        gifts={gifts}
        onClose={() => setGiftOpen(false)}
        onSend={sendGift}
        onGetKpoints={() => alert('Simular : comprar K puntos')}
      />
    </div>
  )
}
