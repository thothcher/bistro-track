import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../auth/authStore";
import { api } from "../lib/api";
import type { OrderQueue, OrderStatus } from "../types";

const token = () => useAuthStore.getState().session?.token;

export const kitchenQueries = {
  queue: () =>
    queryOptions({
      queryKey: ["orders", "queue"],
      queryFn: async () => {
        const queue = await api<OrderQueue>("/api/v1/enterprise/orders/queue", {}, token());
        // Development only: /kitchen?rush=800 adds pretend orders (the production build has no such code)
        if (import.meta.env.DEV) {
          const rush = Number(new URLSearchParams(location.search).get("rush"));
          if (rush > 0) return (await import("../dev/rush")).withRush(queue, rush);
        }
        return queue;
      },
      staleTime: 0, // orders arrive all the time: never trust an old queue
      refetchInterval: 5_000, // ask again every 5 seconds while the page is open
    }),
};

// The kitchen presses "Start cooking": the card changes at once, the server answers later.
export function useSetOrderStatus() {
  const queryClient = useQueryClient();
  const queueKey = kitchenQueries.queue().queryKey;

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      api(
        `/api/v1/enterprise/orders/${id}/status`,
        { method: "PATCH", body: JSON.stringify({ status }) },
        token(),
      ),

    // 1. Before the request: change the cached queue as if the server had already said yes
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: queueKey }); // a refresh now would overwrite us
      const previous = queryClient.getQueryData(queueKey);
      queryClient.setQueryData(queueKey, (queue) =>
        queue
          ? {
              ...queue,
              orders:
                queue.orders?.map((o) => (o.id === id ? { ...o, status } : o)) ?? null,
            }
          : queue,
      );
      return { previous }; // kept for onError
    },

    // 2. The server said no: put the old queue back. (The error toast comes from the QueryClient.)
    onError: (_error, _vars, context) => {
      if (context) queryClient.setQueryData(queueKey, context.previous);
    },

    // 3. Win or lose, ask the server what is true now
    onSettled: () => queryClient.invalidateQueries({ queryKey: queueKey }),
  });
}
