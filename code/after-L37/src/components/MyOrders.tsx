import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "../auth/authStore";
import { useInView } from "../hooks/useInView";
import { formatItems, formatPrice } from "../lib/format";
import { orderQueries } from "../queries/orders";
import { Section } from "./Section";

export function MyOrders() {
  const email = useAuthStore((s) => s.session?.user.email ?? "");
  const { data, isPending, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(orderQueries.mine(email));

  // The sentinel is an empty div under the list. When it scrolls into view, load the next page.
  const sentinel = useInView<HTMLDivElement>(
    () => void fetchNextPage(),
    hasNextPage && !isFetchingNextPage,
  );

  // data.pages is a list of pages, each with its items: flatten them into one list
  const orders = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <Section eyebrow="Your dinners" title="My orders">
      {isPending && <p className="note">Loading…</p>}
      {isError && <p className="error">We couldn't load your orders.</p>}
      {data && orders.length === 0 && (
        <p className="note">No orders yet — the menu is waiting.</p>
      )}
      <ul className="orders">
        {orders.map((order) => (
          <li key={order.id} className="order">
            <span>
              {new Date(order.createdAt).toLocaleString()} ·{" "}
              {formatItems(order.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0)}
              <span className="order__status">{order.status}</span>
            </span>
            <span className="order__total">{formatPrice(order.total)}</span>
          </li>
        ))}
      </ul>
      <div ref={sentinel} />
      {/* A real button too: keyboard users, and anyone who scrolls with the mouse wheel off */}
      {hasNextPage && (
        <div className="section__actions">
          <button
            type="button"
            className="btn-outline"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading…" : "Show more orders"}
          </button>
        </div>
      )}
    </Section>
  );
}
