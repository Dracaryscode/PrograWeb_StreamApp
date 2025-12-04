import { api, type StreamerProgress } from "./api";

export async function fetchStreamerProgress(streamerId: number, token?: string | null): Promise<StreamerProgress> {
  return api.getStreamerProgreso(streamerId, token);
}

export async function startStreamSession(streamerId: number, titulo: string, token?: string | null) {
  return api.startStream(streamerId, titulo, token);
}

export async function stopStreamSession(streamId: number, streamerId: number, token?: string | null) {
  return api.endStream(streamId, streamerId, token);
}
