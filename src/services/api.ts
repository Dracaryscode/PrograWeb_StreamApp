import { request } from "./http";
import type { AuthResponse } from "../types/user";
import type { Gift } from "../types/gift";

export type ViewerProgress = {
  viewerId: number;
  nivel_actual: number;
  puntos_actuales: number;
  siguiente_nivel: number | null;
  puntos_requeridos: number | null;
  falta_puntos: number;
  progreso_porcentaje: number;
};

export type StreamerProgress = {
  streamerId: number;
  nivel_actual: number;
  horas_totales: number;
  siguiente_nivel: number | null;
  horas_requeridas: number | null;
  falta_horas: number;
  progreso_porcentaje: number;
  es_nivel_maximo?: boolean;
};

export type ViewerPerfil = {
  viewerId: number;
  usuarioId: number;
  nombre: string;
  avatar_url: string | null;
  nivel_actual: number;
  puntos: number;
  horas_vistas: number;
  saldo_coins: number;
};

export type StreamerDashboard = {
  id: number;
  nivel_actual: number;
  horas_totales: number;
  titulo_canal: string | null;
};

export type ViewerRule = {
  id: number;
  nivel: number;
  puntos_requeridos: number;
  recompensa_coins: number;
  activo: boolean;
};

export type RouletteReward = { type: "coins" | "points"; amount: number; label: string; short?: string };

export const api = {
  // Auth
  login(email: string, password: string) {
    return request<AuthResponse>("/api/auth/login", { method: "POST", body: { email, password } });
  },
  register(
    nombre: string,
    email: string,
    password: string,
    rol: "streamer" | "espectador",
    extras?: { canal_slug?: string; titulo_canal?: string }
  ) {
    return request("/api/auth/register", { method: "POST", body: { nombre, email, password, rol, ...extras } });
  },
  refresh(refreshToken: string) {
    return request<AuthResponse>("/api/auth/refresh", { method: "POST", body: { refreshToken } });
  },
  logout(refreshToken: string) {
    return request("/api/auth/logout", { method: "POST", body: { refreshToken } });
  },

  // Viewer
  getViewerPerfil(viewerId: number, token?: string | null) {
    return request<ViewerPerfil>(`/api/viewers/${viewerId}/perfil`, { token });
  },
  getViewerProgreso(viewerId: number, token?: string | null) {
    return request<ViewerProgress>(`/api/viewers/${viewerId}/progreso-nivel`, { token });
  },
  getViewerSaldo(viewerId: number, token?: string | null) {
    return request<{ viewerId: number; usuarioId: number; saldo_coins: number }>(`/api/viewers/${viewerId}/saldo`, { token });
  },

  // Streamer
  getStreamerDashboard(userId: number, token?: string | null) {
    return request<StreamerDashboard>(`/api/streamers/${userId}/dashboard`, { token });
  },
  getStreamerProgreso(streamerId: number, token?: string | null) {
    return request<StreamerProgress>(`/api/streamers/${streamerId}/progreso-nivel`, { token });
  },
  getStream(streamId: number, token?: string | null) {
    return request<{ id: number; titulo: string; estado: string; streamerId: number; canal_slug?: string; room?: string }>(
      `/api/streams/${streamId}`,
      { token }
    );
  },
  getStreamerActividad(streamerId: number, limit = 10, token?: string | null) {
    return request<{ items: { tipo: string; actor: string; gift?: string | null; fecha: string; descripcion: string }[] }>(
      `/api/streamers/${streamerId}/actividad?limit=${limit}`,
      { token }
    );
  },
  startStream(streamerId: number, titulo: string, token?: string | null) {
    return request<{ streamId: number; message: string }>(`/api/streams/start`, { method: "POST", token, body: { streamerId, titulo } });
  },
  endStream(streamId: number, streamerId: number, token?: string | null) {
    return request(`/api/streams/end`, { method: "POST", token, body: { streamId, streamerId } });
  },

  // Streams interacciA3n
  sendMensaje(streamId: number, payload: { viewerId: number; mensaje: string }, token?: string | null) {
    return request(`/api/streams/${streamId}/mensajes`, { method: "POST", token, body: payload });
  },
  getMensajes(streamId: number, token?: string | null) {
    return request<any[]>(`/api/streams/${streamId}/mensajes`, { token });
  },
  enviarRegalo(streamId: number, regaloId: number, payload: { viewerId: number; cantidad?: number; mensaje?: string }, token?: string | null) {
    return request(`/api/streams/${streamId}/regalos/${regaloId}/enviar`, { method: "POST", token, body: payload });
  },
  getEventosRegalos(streamId: number, limit = 20, token?: string | null) {
    return request(`/api/streams/${streamId}/eventos/regalos?limit=${limit}`, { token });
  },
  generateVdoLink(streamId: number, streamerId: number, token?: string | null) {
    return request<{ streamId: number; streamerId: number; token: string; links: any }>(
      `/api/streams/${streamId}/vdo-link`,
      { method: "POST", token, body: { streamerId } }
    );
  },

  // Gifts (CRUD para streamer)
  listGifts(streamerId: number, token?: string | null) {
    return request<Gift[]>(`/api/streamers/${streamerId}/regalos`, { token });
  },
  createGift(
    streamerId: number,
    data: { nombre: string; costo_usd?: number | null; costo_coins: number; puntos_otorgados: number; emoji?: string | null; activo?: boolean },
    token?: string | null
  ) {
    return request<Gift>(`/api/streamers/${streamerId}/regalos`, { method: "POST", token, body: data });
  },
  updateGift(
    streamerId: number,
    regaloId: number,
    data: { nombre: string; costo_usd?: number | null; costo_coins: number; puntos_otorgados: number; emoji?: string | null; activo?: boolean },
    token?: string | null
  ) {
    return request<Gift>(`/api/streamers/${streamerId}/regalos/${regaloId}`, { method: "PUT", token, body: data });
  },
  deleteGift(streamerId: number, regaloId: number, token?: string | null) {
    return request(`/api/streamers/${streamerId}/regalos/${regaloId}`, { method: "DELETE", token });
  },

  // MonetizaciA3n
  listPaquetes(token?: string | null) {
    return request<{ id: number; coins: number; precio: number; nombre?: string; descripcion?: string }[]>(`/api/monetizacion/paquetes`, { token });
  },
  comprarPaquete(usuarioId: number, paqueteId: number, token?: string | null) {
    return request(`/api/monetizacion/comprar`, { method: "POST", token, body: { usuarioId, paqueteId } });
  },
  comprarPersonalizado(usuarioId: number, cantidadPersonalizada: number, token?: string | null) {
    return request(`/api/monetizacion/comprar`, { method: "POST", token, body: { usuarioId, cantidadPersonalizada } });
  },

  // Reglas de nivel para viewers (globales)
  listViewerRules(token?: string | null) {
    return request<ViewerRule[]>(`/api/niveles-viewer`, { token });
  },
  updateViewerRule(id: number, data: Partial<ViewerRule>, token?: string | null) {
    return request<ViewerRule>(`/api/niveles-viewer/${id}`, { method: "PUT", token, body: data });
  },

  // Ruleta diaria
  getRouletteStatus(viewerId: number, token?: string | null) {
    return request<{ claimed_today: boolean; reward: RouletteReward | null }>(
      `/api/viewers/${viewerId}/ruleta/status`,
      { token }
    );
  },
  claimRoulette(viewerId: number, token?: string | null) {
    return request<{ claimed_today: boolean; reward: RouletteReward; saldo_coins?: number; puntos?: number }>(
      `/api/viewers/${viewerId}/ruleta/claim`,
      { method: "POST", token }
    );
  },
};
