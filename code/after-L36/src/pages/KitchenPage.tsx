import { useQuery } from "@tanstack/react-query";
import { Section } from "../components/Section";
import { formatItems, formatPrice } from "../lib/format";
import { kitchenQueries, useSetOrderStatus } from "../queries/kitchen";
import type { OrderStatus } from "../types";

// The kitchen's workflow: which button belongs to which status
const NEXT: Record<string, { status: OrderStatus; label: string } | undefined> = {
  PENDING: { status: "COOKING", label: "Start cooking" },
  COOKING: { status: "READY", label: "Ready" },
  READY: { status: "DELIVERED", label: "Delivered" },
};

export function KitchenPage() {
  // Staff only: a guest's token gets 403 here, even if they type /kitchen by hand.
  // The query asks again every 5 seconds, and when the guest comes back to the tab.
  const queue = useQuery(kitchenQueries.queue());
  const setStatus = useSetOrderStatus();
  const orders = queue.data?.orders ?? [];

  return (
    <Section eyebrow="Service" title="The pass" as="h1">
      {queue.isPending && <p className="note">Loading the queue…</p>}
      {queue.error && <p className="error">{queue.error.message}</p>}

      {queue.data && orders.length === 0 && (
        <p className="note">All quiet — no open orders.</p>
      )}
      <ul className="orders">
        {orders.map((order) => {
          const next = NEXT[order.status ?? ""];
          return (
            <li key={order.id} className="order">
              <span>
                <b>{order.customerName ?? "Guest"}</b> · {formatItems(order.itemCount)}
                <span className="order__status">{order.status}</span>
              </span>
              <span className="order__actions">
                <span className="order__total">{formatPrice(order.total)}</span>
                {next && (
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() =>
                      setStatus.mutate({ id: order.id, status: next.status })
                    }
                  >
                    {next.label}
                  </button>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
