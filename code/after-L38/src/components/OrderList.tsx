import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import type { OrderStatus, QueueOrder } from "../types";
import { OrderRow } from "./OrderRow";

const ROW_HEIGHT = 84; // px: a ticket (about 72) and the gap under it

type OrderListProps = {
  orders: QueueOrder[];
  onAdvance: (id: string, status: OrderStatus) => void;
};

// A long list that only draws what you can see. The scrolling box has a fixed height; inside it
// a tall, empty <ul> makes the scrollbar the right size, and only the rows near the window exist.
export function OrderList({ orders, onAdvance }: OrderListProps) {
  const scrollBox = useRef<HTMLDivElement>(null);
  // The React Compiler skips a component that calls this hook: the virtualizer hands out functions that
  // are not safe to remember. That is fine here (the rows are separate, compiled components), so the
  // linter's notice is switched off for this one line, on purpose.
  // oxlint-disable-next-line react/incompatible-library
  const virtualizer = useVirtualizer({
    count: orders.length,
    getScrollElement: () => scrollBox.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 6, // a few rows above and below the window, so a fast scroll never shows a hole
  });

  return (
    // tabIndex: a keyboard user can focus the box and scroll it with the arrow keys and Page Down
    <div ref={scrollBox} className="order-scroll" tabIndex={0} aria-label="Open orders">
      <ul className="order-spacer" style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((row) => (
          <li
            key={orders[row.index].id}
            className="order-slot"
            // a screen reader cannot count rows that are not on the page: tell it the numbers
            aria-posinset={row.index + 1}
            aria-setsize={orders.length}
            style={{ height: row.size, transform: `translateY(${row.start}px)` }}
          >
            <OrderRow order={orders[row.index]} onAdvance={onAdvance} />
          </li>
        ))}
      </ul>
    </div>
  );
}
