import { useQuery } from "@tanstack/react-query";
import { Section } from "../components/Section";
import { formatPrice } from "../lib/format";
import { kitchenQueries } from "../queries/kitchen";

export function KitchenPage() {
  // Staff only: a guest's token gets 403 here, even if they type /kitchen by hand.
  // The query asks again every 5 seconds, and when the guest comes back to the tab.
  const queue = useQuery(kitchenQueries.queue());
  const orders = queue.data?.orders ?? [];

  return (
    <Section eyebrow="Service" title="The pass">
      {/* isPending: nothing to show yet. isFetching: a refresh is running, the old queue stays visible */}
      {queue.isPending && <p className="note">Loading the queue…</p>}
      {queue.isFetching && !queue.isPending && <p className="note">Updating…</p>}
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
