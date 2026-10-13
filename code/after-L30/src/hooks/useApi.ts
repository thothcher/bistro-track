import { useEffect, useState } from "react";
import { api, ApiError } from "../lib/api";

type Result<T> = { key: string; data: T | null; error: ApiError | null };

// Loads a path from the API. Pass null to load nothing, and a token for protected endpoints.
// Every answer remembers which request it belongs to, so a slow old answer
// can never show up under a newer request (the race condition from lecture L29).
export function useApi<T>(path: string | null, token?: string) {
  const key = path === null ? null : `${path}|${token ?? ""}`;
  const [result, setResult] = useState<Result<T> | null>(null);

  useEffect(() => {
    if (path === null || key === null) return;
    const controller = new AbortController();

    api<T>(path, { signal: controller.signal }, token)
      .then((data) => setResult({ key, data, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return; // we cancelled it ourselves
        const apiError =
          error instanceof ApiError ? error : new ApiError(0, "No connection");
        setResult({ key, data: null, error: apiError });
      });

    // Cleanup: runs when the request changes or the component disappears
    return () => controller.abort();
  }, [key, path, token]);

  const current = result !== null && result.key === key ? result : null;

  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    loading: key !== null && current === null, // derived, never stored
  };
}
