import { memo } from "react";
import { formatItems, formatPrice } from "../lib/format";
import type { OrderStatus, QueueOrder } from "../types";

// The kitchen's workflow: which button belongs to which status
const NEXT: Record<string, { status: OrderStatus; label: string } | undefined> = {
  PENDING: { status: "COOKING", label: "Start cooking" },
  COOKING: { status: "READY", label: "Ready" },
  READY: { status: "DELIVERED", label: "Delivered" },
};

type OrderRowProps = {
  order: QueueOrder;
  onAdvance: (id: string, status: OrderStatus) => void;
};

// One ticket on the pass. The rows are made inside a .map(): the compiler cannot skip a row that its
// parent re-created, but memo can. With the same order and the same function, this ticket does not render again.
export const OrderRow = memo(function OrderRow({ order, onAdvance }: OrderRowProps) {
  const next = NEXT[order.status ?? ""];
  return (
    <div className="order">
      <span>
        <strong>{order.customerName ?? "Guest"}</strong> · {formatItems(order.itemCount)}
        <span className="order__status">{order.status}</span>
      </span>
      <span className="order__actions">
        <span className="order__total">{formatPrice(order.total)}</span>
        {next && (
          <button
            type="button"
            className="btn-outline"
            onClick={() => onAdvance(order.id, next.status)}
          >
            {next.label}
          </button>
        )}
      </span>
    </div>
  );
});
