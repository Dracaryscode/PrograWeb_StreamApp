export type Role = "streamer" | "espectador";
export type AvatarKey = "perfil" | "perfil1" | "perfil2";

export interface User {
  id: number;
  email: string;
  role: Role;
  name: string;
  perfilId?: number;       // id en perfiles_streamer o perfiles_viewer
  canalSlug?: string | null;
  avatarKey?: AvatarKey;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  refresh_expires_at?: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: Role;
  };
  perfilId?: number;
  canal_slug?: string | null;
}
