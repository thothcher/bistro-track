import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Session } from "../types";

type AuthState = {
  session: Session | null;
  login: (session: Session) => void;
  logout: () => void;
};

// The session lives in a store too. Kept in localStorage for this course;
// the Next.js module moves sessions into httpOnly cookies.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      login: (session) => set({ session }),
      logout: () => set({ session: null }),
    }),
    {
      name: "bistro.session",
      partialize: (s) => ({ session: s.session }),
    },
  ),
);
