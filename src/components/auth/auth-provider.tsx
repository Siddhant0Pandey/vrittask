"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SessionUser } from "@/types/auth";

interface AuthContextValue {
  user: SessionUser | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Exposes the server-resolved session to client components. */
export function AuthProvider({ user, children }: { user: SessionUser | null; children: ReactNode }) {
  return <AuthContext.Provider value={{ user, isAuthenticated: user !== null }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within <AuthProvider>");
  return context;
}
