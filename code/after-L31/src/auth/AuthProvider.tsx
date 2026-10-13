import type { ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Session } from "../types";
import { AuthContext, type AuthContextValue } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  // Kept in localStorage for this course. The Next.js module moves sessions into httpOnly cookies.
  const [session, setSession] = useLocalStorage<Session | null>("bistro.session", null);

  const value: AuthContextValue = {
    session,
    login: (next) => setSession(next),
    logout: () => setSession(null),
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}
