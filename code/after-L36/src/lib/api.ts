import { useAuthStore } from "../auth/authStore";

export class ApiError extends Error {
  status: number;
  retryAfter: number | null; // seconds, sent with 429 Too Many Requests

  constructor(status: number, message: string, retryAfter: number | null = null) {
    super(message);
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

// Calls a relative /api/... path. Vite (dev) and vercel.json (production) forward it to the real API.
// Pass a token to call endpoints that need a signed-in user.
export async function api<T>(
  path: string,
  init: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body) headers.set("Content-Type", "application/json");

  const res = await fetch(path, { ...init, headers });

  if (!res.ok) {
    const retryAfter = Number(res.headers.get("Retry-After")) || null;
    // The API's trap: tokens live 2 minutes, then every call answers 401 + X-Token-Expired
    const expired = res.status === 401 && res.headers.get("X-Token-Expired") === "true";
    // This file is not a component, yet it can reach the store: getState() works anywhere.
    // Signing out here makes RequireAuth send the guest to /login, from any page.
    if (expired) useAuthStore.getState().logout();
    // For "you sent something wrong" answers the API explains itself: { status, error, message, … }.
    // A form can show that sentence. Other failures stay generic.
    const problem =
      res.status === 400 || res.status === 409 || res.status === 422
        ? ((await res.json().catch(() => null)) as { message?: string } | null)
        : null;
    const message = expired
      ? "Your session has ended — please sign in again."
      : (problem?.message ?? `Request failed (HTTP ${res.status})`);
    throw new ApiError(res.status, message, retryAfter);
  }
  return (await res.json()) as T;
}
