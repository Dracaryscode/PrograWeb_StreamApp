import { createContext, useContext, useMemo, useState } from "react";
import type { User } from "../types/user";
import { api } from "../services/api";

type AuthCtx = {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
};
const AuthContext = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const normalizeUser = (data: any): User => ({
    email: data?.email ?? "",
    role: data?.role ?? "espectador",
    name: data?.name ?? (data?.email ? data.email.split("@")[0] : "Usuario"),
    avatarKey: data?.avatarKey ?? "perfil",
  });

  const [user, setUser] = useState<User | null>(() => {
    try { 
      const raw = JSON.parse(localStorage.getItem("user") || "null");
      return raw ? normalizeUser(raw) : null; 
    } catch { 
      return null; 
    }
  });

  const setUserAndPersist = (next: User | null) => {
    if (next) localStorage.setItem("user", JSON.stringify(next));
    else localStorage.removeItem("user");
    setUser(next);
  };

  const login = async (email: string, pass: string) => {
    const { user } = await api.login(email, pass);
    setUserAndPersist(normalizeUser(user));
  };
  const register = async (email: string, pass: string) => {
    const { user } = await api.register(email, pass);
    setUserAndPersist(normalizeUser(user));
  };
  const logout = () => { localStorage.removeItem("user"); setUser(null); };

  const updateProfile = (updates: Partial<User>) => {
    setUser(prev => {
      const merged = normalizeUser({ ...prev, ...updates });
      setUserAndPersist(merged);
      return merged;
    });
  };

  const value = useMemo(() => ({ user, login, register, logout, updateProfile }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
