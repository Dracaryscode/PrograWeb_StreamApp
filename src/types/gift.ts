export interface Gift {
  id: number;
  streamer_id?: number | null;
  nombre: string;
  costo_usd: number | null;
  costo_coins: number;
  puntos_otorgados: number;
  activo?: boolean;
  emoji?: string | null;
}
