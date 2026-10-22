import { api } from "../lib/api";
import type { AuthResponse, Role, UserProfile } from "../types";
import { useAuthStore } from "./authStore";

const ROLES: Role[] = ["admin", "waiter", "kitchen", "student"];

// The API sends roles like "Kitchen". Anything unknown is treated as a guest (student).
function toRole(value: string | null): Role {
  const role = (value ?? "").toLowerCase();
  return ROLES.find((r) => r === role) ?? "student";
}

// Login and registration both end the same way, so the steps live in one place.
export async function signIn(email: string, password: string) {
  const auth = await api<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const me = await api<UserProfile>("/api/v1/auth/me", {}, auth.accessToken);
  useAuthStore.getState().login({
    token: auth.accessToken,
    user: {
      email: me.email ?? email,
      displayName: me.displayName,
      role: toRole(me.role),
    },
  });
}
