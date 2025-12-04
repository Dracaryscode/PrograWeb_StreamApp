import { useMemo, useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { FaVideo, FaSync } from "react-icons/fa";
import { useAuth } from "../app/auth";
import { api } from "../services/api";

export default function StreamSetup() {
  const { user, tokens } = useAuth();
  const streamerId = useMemo(() => user?.perfilId ?? Number(import.meta.env.VITE_DEFAULT_STREAMER_ID ?? 0), [user?.perfilId]);
  const [titleInput, setTitleInput] = useState("Stream en vivo");
  const [roomInput, setRoomInput] = useState("mi-sala");
  const [starting, setStarting] = useState(false);
  const [activeStreamId, setActiveStreamId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEmbed, setShowEmbed] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [vdoLinks, setVdoLinks] = useState<{ push?: string; scene?: string; roomName?: string } | null>(null);

  const effectiveRoom = vdoLinks?.roomName || roomInput || "mi-sala";
  const base = "https://vdo.ninja";
  const pushUrl = vdoLinks?.push || `${base}/?push=&room=${encodeURIComponent(effectiveRoom)}`;
  const sceneUrl = vdoLinks?.scene || `${base}/?scene&room=${encodeURIComponent(effectiveRoom)}`;

  const sceneParam = encodeURIComponent(sceneUrl);
  const viewerLink = `${window.location.origin}/watch/${encodeURIComponent(effectiveRoom)}${activeStreamId ? `?streamId=${activeStreamId}&scene=${sceneParam}&streamerId=${streamerId}` : `?scene=${sceneParam}&streamerId=${streamerId}`}`;
  const directViewer = sceneUrl;

  useEffect(() => {
    const loadData = async () => {
      if (!activeStreamId) return;
      try {
        const [msgs, evs] = await Promise.all([
          api.getMensajes(activeStreamId, tokens?.accessToken),
          api.getEventosRegalos(activeStreamId, 20, tokens?.accessToken),
        ]);
        setMessages(msgs ?? []);
        setEvents(evs ?? []);
      } catch {
        setMessages([]);
        setEvents([]);
      }
    };
    loadData();
  }, [activeStreamId, tokens?.accessToken]);

  useEffect(() => {
    if (!activeStreamId) return;
    const id = setInterval(() => {
      refreshSidePanels();
    }, 3000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStreamId, tokens?.accessToken]);

  const resolveStreamerId = async () => {
    let id = streamerId;
    if (!id && user?.id) {
      try {
        const dash = await api.getStreamerDashboard(user.id, tokens?.accessToken);
        id = dash?.id ?? 0;
      } catch {
        id = 0;
      }
    }
    return id;
  };

  const handleStart = async () => {
    const id = await resolveStreamerId();
    if (!id) {
      setError("Falta perfil de streamer. Inicia sesión o configura VITE_DEFAULT_STREAMER_ID.");
      return;
    }
    setStarting(true);
    setError(null);
    try {
      const resp = await api.startStream(id, titleInput || "Stream en vivo", tokens?.accessToken);
      setActiveStreamId(resp.streamId);
      // Generar links VDO
      const linksResp = await api.generateVdoLink(resp.streamId, id, tokens?.accessToken);
      const roomParam =
        new URL(linksResp.links?.streamer?.room || linksResp.links?.viewer?.scene || `https://vdo.ninja/?room=stream${resp.streamId}`)
          .searchParams.get("room") || `stream${resp.streamId}`;
      setVdoLinks({
        push: linksResp.links?.streamer?.push,
        roomName: roomParam,
        scene: linksResp.links?.viewer?.scene,
      });
      setRoomInput(roomParam);
    } catch {
      setError("No se pudo iniciar el stream.");
    } finally {
      setStarting(false);
    }
  };

  const handleStop = async () => {
    const id = await resolveStreamerId();
    if (!id || !activeStreamId) return;
    setError(null);
    try {
      await api.endStream(activeStreamId, id, tokens?.accessToken);
      setActiveStreamId(null);
      setVdoLinks(null);
    } catch {
      setError("No se pudo detener el stream.");
    }
  };

  const refreshSidePanels = async () => {
    if (!activeStreamId) return;
    try {
      const [msgs, evs] = await Promise.all([
        api.getMensajes(activeStreamId, tokens?.accessToken),
        api.getEventosRegalos(activeStreamId, 20, tokens?.accessToken),
      ]);
      setMessages(msgs ?? []);
      setEvents(evs ?? []);
    } catch {
      setMessages([]);
      setEvents([]);
    }
  };

  if (!user || user.role !== "streamer") {
    return <div className={styles.dashboardPage}>Inicia sesión como streamer para configurar el stream.</div>;
  }

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.mainWidget} style={{ width: "100%", maxWidth: "1200px" }}>
        <div className={styles.widgetHeader}>
          <h2 className={styles.widgetTitle}>Directo VDO.Ninja</h2>
          <p className={styles.widgetSubtitle}>Controla tu stream sin salir de la plataforma.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", alignItems: "flex-start" }}>
          <div style={{ background: "#101018", borderRadius: "16px", padding: "12px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
            <div style={{ marginBottom: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <input
                className={styles.modalInput}
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="Título"
                style={{ flex: 1, minWidth: "200px" }}
              />
              <input
                className={styles.modalInput}
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                placeholder="Sala VDO.Ninja"
                style={{ flex: 1, minWidth: "200px" }}
              />
              <a
                href={pushUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.btnSecondary}
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                Abrir VDO.Ninja <FaVideo />
              </a>
            </div>
            <div style={{ marginBottom: "12px", display: "grid", gap: "6px" }}>
              <div style={{ color: "#e6dff7", fontWeight: "bold" }}>Link para espectadores</div>
              <input readOnly value={viewerLink} className={styles.modalInput} style={{ width: "100%" }} onFocus={(e) => e.target.select()} />
              <div style={{ fontSize: "0.85rem", color: "#aaa" }}>Link directo VDO.Ninja: {directViewer}</div>
              {vdoLinks?.push && <div style={{ fontSize: "0.85rem", color: "#aaa" }}>Push (emisor): {vdoLinks.push}</div>}
            </div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <button className={styles.btnSecondary} onClick={() => setShowEmbed(!showEmbed)}>
                {showEmbed ? "Ocultar embed" : "Mostrar embed"}
              </button>
              {activeStreamId ? (
                <button className={styles.btnPrimary} onClick={handleStop}>
                  Detener stream
                </button>
              ) : (
                <button className={styles.btnPrimary} onClick={handleStart} disabled={starting}>
                  {starting ? "Iniciando..." : "Iniciar stream"}
                </button>
              )}
            </div>
            {showEmbed && (
              <div style={{ borderRadius: "16px", overflow: "hidden", background: "#000" }}>
                <div style={{ position: "relative", paddingTop: "56.25%" }}>
                  <iframe
                    src={pushUrl}
                    title="VDO.Ninja"
                    allow="camera; microphone; fullscreen; speaker; display-capture"
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                  />
                </div>
              </div>
            )}
            {error && <div className={styles.errorText} style={{ marginTop: "8px" }}>{error}</div>}
          </div>

          <div style={{ background: "#0f0f18", borderRadius: "16px", padding: "12px", height: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.3)", minHeight: "400px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h3 style={{ margin: 0, color: "#e6dff7" }}>Chat & Eventos</h3>
              <button className={styles.btnSecondary} onClick={refreshSidePanels} title="Refrescar">
                <FaSync />
              </button>
            </div>
            <div style={{ maxHeight: "360px", overflow: "auto", display: "grid", gap: "8px" }}>
              <div>
                <strong style={{ color: "#a381f9" }}>Chat</strong>
                <div style={{ marginTop: "4px", display: "grid", gap: "4px" }}>
                  {messages.length === 0 && <div style={{ color: "#888" }}>Sin mensajes</div>}
                  {messages.map((m) => (
                    <div key={m.id} style={{ background: "#141424", padding: "6px 8px", borderRadius: "10px", color: "#dcdcdc" }}>
                      <span style={{ color: "#9f64ff", fontWeight: "bold", marginRight: "6px" }}>{m.usuario_nombre ?? "Usuario"}</span>
                      <span style={{ color: "#888", marginRight: "6px" }}>Lv {m.nivel_usuario ?? "-"}</span>
                      <span>{m.mensaje ?? ""}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <strong style={{ color: "#a381f9" }}>Regalos</strong>
                <div style={{ marginTop: "4px", display: "grid", gap: "4px" }}>
                  {events.length === 0 && <div style={{ color: "#888" }}>Sin eventos</div>}
                  {events.map((e, idx) => (
                    <div key={idx} style={{ background: "#141424", padding: "6px 8px", borderRadius: "10px", color: "#dcdcdc" }}>
                      <span style={{ color: "#ffb347", fontWeight: "bold", marginRight: "6px" }}>{e.viewer_nombre ?? "Viewer"}</span>
                      <span>envió</span>
                      <span style={{ marginLeft: "6px", color: "#9f64ff", fontWeight: "bold" }}>{e.gift_nombre ?? "Regalo"}</span>
                      {e.coins_gastados !== undefined && <span style={{ marginLeft: "6px", color: "#888" }}>({e.coins_gastados} coins)</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
