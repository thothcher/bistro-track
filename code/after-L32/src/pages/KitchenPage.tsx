import { useAuthStore } from "../auth/authStore";
import { Section } from "../components/Section";
import { useApi } from "../hooks/useApi";
import { formatPrice } from "../lib/format";
import type { OrderQueue } from "../types";

export function KitchenPage() {
  const token = useAuthStore((s) => s.session?.token);
  // Staff only: a guest's token gets 403 here, even if they type /kitchen by hand
  const queue = useApi<OrderQueue>("/api/v1/enterprise/orders/queue", token);
  const orders = queue.data?.orders ?? [];

  return (
    <Section eyebrow="Service" title="The pass">
      {queue.loading && <p className="note">Loading the queue…</p>}
      {queue.error && <p className="error">{queue.error.message}</p>}

      {queue.data && orders.length === 0 && (
        <p className="note">All quiet — no open orders.</p>
      )}
      <ul className="orders">
        {orders.map((order) => (
          <li key={order.id} className="order">
            <span>
              <b>{order.customerName ?? "Guest"}</b> · {order.itemCount} items
              <span className="order__status">{order.status}</span>
            </span>
            <span className="order__total">{formatPrice(order.total)}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
