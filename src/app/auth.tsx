import { createContext, useContext, useMemo, useState } from "react";
import type { User } from "../types/user";
import { api } from "../services/api";

type AuthCtx = {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => void;
};
const AuthContext = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });

  const login = async (email: string, pass: string) => {
    const { user } = await api.login(email, pass);
    setUser(user);
  };
  const register = async (email: string, pass: string) => {
    const { user } = await api.register(email, pass);
    setUser(user);
  };
  const logout = () => { localStorage.removeItem("user"); setUser(null); };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
