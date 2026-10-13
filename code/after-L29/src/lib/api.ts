export class ApiError extends Error {
  status: number;
  retryAfter: number | null; // seconds, sent with 429 Too Many Requests

  constructor(status: number, message: string, retryAfter: number | null = null) {
    super(message);
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

// GET a relative /api/... path. Vite (vite.config.ts) forwards it to the real API.
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, init);

  if (!res.ok) {
    const retryAfter = Number(res.headers.get("Retry-After")) || null;
    throw new ApiError(res.status, `Request failed (HTTP ${res.status})`, retryAfter);
  }
  return (await res.json()) as T;
}
