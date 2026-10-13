import { createContext, useContext } from "react";
import type { Session } from "../types";

export type AuthContextValue = {
  session: Session | null;
  login: (session: Session) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

// Any component below <AuthProvider> can call useAuth(). No props needed.
export function useAuth() {
  const auth = useContext(AuthContext);
  if (auth === null) throw new Error("useAuth() must be used inside <AuthProvider>");
  return auth;
}
