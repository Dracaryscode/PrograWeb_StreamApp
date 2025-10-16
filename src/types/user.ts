export type Role = "streamer" | "espectador";
export interface User { email: string; role: Role; }
export interface AuthResponse { token: string; user: User; }
