import { useEffect, useState } from "react";
import { api, ApiError } from "../lib/api";

type Result<T> = { path: string; data: T | null; error: ApiError | null };

// Loads a path from the API. Pass null to load nothing.
// Every answer remembers which path it belongs to, so a slow old answer
// can never show up under a newer request (the race condition from lecture L29).
export function useApi<T>(path: string | null) {
  const [result, setResult] = useState<Result<T> | null>(null);

  useEffect(() => {
    if (path === null) return;
    const controller = new AbortController();

    api<T>(path, { signal: controller.signal })
      .then((data) => setResult({ path, data, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return; // we cancelled it ourselves
        const apiError =
          error instanceof ApiError ? error : new ApiError(0, "No connection");
        setResult({ path, data: null, error: apiError });
      });

    // Cleanup: runs when path changes or the component disappears
    return () => controller.abort();
  }, [path]);

  const current = result !== null && result.path === path ? result : null;

  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    loading: path !== null && current === null, // derived, never stored
  };
}
