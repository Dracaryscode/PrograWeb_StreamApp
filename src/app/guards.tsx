import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";
import type { ReactElement } from "react";
import type { Role } from "../types/user";

export function RequireAuth({ children }: { children: ReactElement }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
export function RequireRole({ role, children }: { role: Role; children: ReactElement }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === role ? children : <Navigate to="/" replace />;
}
