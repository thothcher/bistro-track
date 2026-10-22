import { MutationCache, QueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../auth/authStore";
import { toast } from "../toast/toastStore";
import { ApiError } from "./api";

// The cache of everything we fetched. One for the whole app (see main.tsx).
export const queryClient = new QueryClient({
  // One place that tells the guest when ANY change (mutation) fails.
  // No mutation has to remember to show an error.
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "No connection. Try again.",
      );
    },
  }),
  defaultOptions: {
    queries: {
      // The menu rarely changes: what we fetched counts as fresh for a minute
      staleTime: 60_000,
      // Retry a network hiccup or a 5xx, never a 4xx: a 404 or a 429 won't fix itself
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status >= 400 && error.status < 500) &&
        failureCount < 2,
    },
  },
});

// Data that belongs to a guest must not outlive the guest: when the session ends,
// the cache is emptied. subscribe() is a store feature that works outside React.
useAuthStore.subscribe((state, previous) => {
  if (previous.session && !state.session) queryClient.clear();
});
