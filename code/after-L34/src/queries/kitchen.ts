import { queryOptions } from "@tanstack/react-query";
import { useAuthStore } from "../auth/authStore";
import { api } from "../lib/api";
import type { OrderQueue } from "../types";

export const kitchenQueries = {
  queue: () =>
    queryOptions({
      queryKey: ["orders", "queue"],
      queryFn: () =>
        api<OrderQueue>(
          "/api/v1/enterprise/orders/queue",
          {},
          useAuthStore.getState().session?.token,
        ),
      staleTime: 0, // orders arrive all the time: never trust an old queue
      refetchInterval: 5_000, // ask again every 5 seconds while the page is open
    }),
};
