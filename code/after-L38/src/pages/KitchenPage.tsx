import { useQuery } from "@tanstack/react-query";
import { useDeferredValue, useState, useTransition } from "react";
import { OrderList } from "../components/OrderList";
import { Section } from "../components/Section";
import { StatusTabs } from "../components/StatusTabs";
import { countByStatus, filterOrders, type StatusFilter } from "../lib/orders";
import { kitchenQueries, useSetOrderStatus } from "../queries/kitchen";
import type { OrderStatus } from "../types";

export function KitchenPage() {
  // Staff only: a guest's token gets 403 here, even if they type /kitchen by hand.
  // The query asks again every 5 seconds, and when the guest comes back to the tab.
  const queue = useQuery(kitchenQueries.queue());
  // Take "mutate" out of the mutation object: the function never changes, the object changes at every
  // render. A row that receives the function can only be skipped when the function stays the same.
  const { mutate } = useSetOrderStatus();
  const orders = queue.data?.orders ?? [];

  // Two filters, two tools for the same wish: "the control must never lag behind my fingers".
  // The tab is a state we set ourselves, so we mark that update as not urgent (a transition).
  const [status, setStatusFilter] = useState<StatusFilter>("ALL");
  const [switching, startTransition] = useTransition();
  // The text is a value we only receive: we ask for a copy of it that is allowed to run late.
  // (We measured: with 800 orders the virtual list does most of the work, the transition halves the
  // tab click, and the late copy changes little here. It earns its place when the list is heavy.)
  const [text, setText] = useState("");
  const lateText = useDeferredValue(text);

  const shown = filterOrders(orders, status, lateText);
  const catchingUp = switching || text !== lateText;

  function advance(id: string, next: OrderStatus) {
    mutate({ id, status: next });
  }

  return (
    <Section eyebrow="Service" title="The pass" as="h1">
      {queue.isPending && <p className="note">Loading the queue…</p>}
      {queue.error && <p className="error">{queue.error.message}</p>}

      {queue.data && orders.length === 0 && (
        <p className="note">All quiet — no open orders.</p>
      )}
      {orders.length > 0 && (
        <>
          <div className="toolbar">
            <StatusTabs
              value={status}
              counts={countByStatus(orders)}
              onChange={(next) => startTransition(() => setStatusFilter(next))}
            />
            <input
              type="search"
              className="search"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Find a guest…"
              aria-label="Find a guest"
            />
          </div>
          <p className="results" aria-live="polite">
            {shown.length} of {orders.length} orders
          </p>
          <div className={catchingUp ? "opacity-60 transition-opacity" : "transition-opacity"} aria-busy={catchingUp}>
            {shown.length > 0 ? (
              <OrderList orders={shown} onAdvance={advance} />
            ) : (
              <p className="note">No order matches.</p>
            )}
          </div>
        </>
      )}
    </Section>
  );
}
