import type { QueueOrder } from "../types";

// The filters of the kitchen page: a status, and the name of a guest
export type StatusFilter = "ALL" | "PENDING" | "COOKING" | "READY";

export const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "New" },
  { value: "COOKING", label: "Cooking" },
  { value: "READY", label: "Ready" },
];

// Which orders to show: the chosen status, and the guests whose name contains the text.
export function filterOrders(orders: QueueOrder[], status: StatusFilter, text: string) {
  const needle = text.trim().toLowerCase();
  return orders.filter(
    (o) =>
      (status === "ALL" || o.status === status) &&
      (needle === "" || (o.customerName ?? "Guest").toLowerCase().includes(needle)),
  );
}

// How many orders each tab would show: the numbers on the tabs
export function countByStatus(orders: QueueOrder[]): Record<StatusFilter, number> {
  const counts: Record<StatusFilter, number> = { ALL: orders.length, PENDING: 0, COOKING: 0, READY: 0 };
  for (const o of orders) {
    if (o.status === "PENDING" || o.status === "COOKING" || o.status === "READY") counts[o.status]++;
  }
  return counts;
}
