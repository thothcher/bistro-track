import type { OrderQueue, QueueOrder } from "../types";

const FIRST = ["Nino", "Giorgi", "Ana", "Luka", "Mariam", "Davit", "Tamar", "Sandro", "Keti", "Irakli"];
const LAST = ["K.", "M.", "T.", "B.", "G.", "D.", "S.", "L."];
const STATUSES = ["PENDING", "PENDING", "COOKING", "COOKING", "COOKING", "READY"];

// Development only. Open /kitchen?rush=800 and 800 pretend orders are added to the real ones,
// so you can feel what a Friday night does to this page. (The real queue is short.)
// The ids are always the same ("rush-0001" ...), like the id of a real order.
export function withRush(queue: OrderQueue, count: number): OrderQueue {
  const now = Date.parse(queue.serverTime) || Date.now();
  const fake: QueueOrder[] = Array.from({ length: count }, (_, i) => ({
    id: `rush-${String(i + 1).padStart(4, "0")}`,
    status: STATUSES[i % STATUSES.length],
    customerName: `${FIRST[i % FIRST.length]} ${LAST[(i * 3) % LAST.length]}`,
    itemCount: 1 + (i % 5),
    total: 12 + ((i * 7) % 60),
    createdAt: new Date(now - ((i * 37) % 5400) * 1000).toISOString(),
    slaDeadline: new Date(now + 15 * 60_000).toISOString(),
    assignedWaiter: null,
  }));
  return { ...queue, orders: [...(queue.orders ?? []), ...fake] };
}
