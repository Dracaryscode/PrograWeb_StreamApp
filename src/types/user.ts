export type Role = "streamer" | "espectador";
export type AvatarKey = "perfil" | "perfil1" | "perfil2";

export interface User {
  email: string;
  role: Role;
  name: string;
  avatarKey: AvatarKey;
}
export interface AuthResponse { token: string; user: User; }
