import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import styles from './StreamPage.module.css'
import fondoDirecto from '../../assets/fondoDirecto.webp'
import perfil from '../../assets/perfil.jpg'

type ChatMessage = {
  id: string
  user: string
  text: string
  badge?: 'MOD' | 'SUB' | 'VIP'
}

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
  const [messages, setMessages] = useState<ChatMessage[]>(() => ([

    { id: crypto.randomUUID(), user: 'mod_karen', badge: 'MOD', text: 'Bienvenido' },
    { id: crypto.randomUUID(), user: 'juan123', text: 'hola a todos ' },
    { id: crypto.randomUUID(), user: 'sub_pato', badge: 'SUB', text: 'hoy hay rankeds?' },
    { id: crypto.randomUUID(), user: 'jsoe', badge: 'MOD', text: 'Bienvenido' },
    { id: crypto.randomUUID(), user: 'juan23', text: 'hola a todos ' },
    { id: crypto.randomUUID(), user: 'mateo', badge: 'SUB', text: 'chau' },
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
    setMessages(prev => [...prev, { id: crypto.randomUUID(), user: 'tú', text }])
    setInput('')
  }

  return (
    <div className={styles.shell}>
      
      <Header onLogin={openLogin} onRegister={openRegister} />

      <div className={styles.grid}>
        <aside className={styles.sideLeft}>
          <Sidebar onNavigate={onNavigate} />
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
              <button className={styles.btn}>Gift Subs</button>
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
            <p>Descripciond el canal...se reemplazara con el backen mas adelante </p>
          </div>
        </main>

        
        <aside className={`${styles.chat} ${collapsed ? styles.chatHidden : ''}`} aria-label="Chat en vivo">
          <div className={styles.chatHeader}>
            <strong>Chat</strong>
            <span className={styles.viewers}>5,107</span>
          </div>

          <div className={styles.messages} ref={listRef}>
            {messages.map(m => (
              <div key={m.id} className={styles.message}>
                <span className={styles.username}>
                  {m.user}
                  {m.badge && <span className={`${styles.badge} ${styles['sdafds' + m.badge]}`}>{m.badge}</span>}
                </span>
                <span className={styles.text}>{m.text}</span>
              </div>
            ))}
          </div>

          <div className={styles.inputRow}>
            <input
              className={styles.input}
              type="texto"
              placeholder="Enviar un mensaje"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onSend()}
              aria-label="Escribe un mensaje"
            />
            <button className={styles.send} onClick={onSend}>Enviar</button>
          </div>
        </aside>
      </div>
    </div>
  )
}
