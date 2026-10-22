import { infiniteQueryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../auth/authStore";
import { useCartStore } from "../cart/cartStore";
import { api } from "../lib/api";
import { toKitchenNotes } from "../schemas/tableNotes";
import { toast } from "sonner";
import type { Order, Paged } from "../types";

const token = () => useAuthStore.getState().session?.token;

export const orderQueries = {
  // "My orders", three at a time. The page number is the "page param" of the infinite query.
  mine: (email: string) =>
    infiniteQueryOptions({
      queryKey: ["orders", "mine", email], // starts with "orders", like the kitchen's queue
      queryFn: ({ pageParam }) =>
        api<Paged<Order>>(`/api/v1/profile/orders?page=${pageParam}&size=3`, {}, token()),
      initialPageParam: 1,
      // undefined means "that was the last page": hasNextPage becomes false
      getNextPageParam: (last) => (last.hasNext ? last.page + 1 : undefined),
    }),
};

// Sends what is in the local cart to the kitchen. The server keeps its own copy of the cart
// and prices every dish itself, so we first make that copy match ours, then ask for the order.
export function useSendOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { items, notes } = useCartStore.getState();
      await api("/api/v1/learning/cart", { method: "DELETE" }, token()); // start from an empty copy
      for (const { dish, qty } of items) {
        await api(
          "/api/v1/learning/cart",
          { method: "POST", body: JSON.stringify({ dishId: dish.id, quantity: qty }) },
          token(),
        );
      }
      const kitchenNotes = notes ? toKitchenNotes(notes) : "";
      return api<Order>(
        "/api/v1/enterprise/orders",
        { method: "POST", body: JSON.stringify({ kitchenNotes }) },
        token(),
      );
    },
    onSuccess: () => {
      useCartStore.getState().clear(); // the order left the building: empty the local cart
      toast.success("Your order is with the kitchen.");
      // Everything that starts with "orders" is old now: the kitchen's queue and my history
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
