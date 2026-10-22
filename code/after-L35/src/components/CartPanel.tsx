import { Link } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../auth/authStore";
import { selectTotal, useCartStore } from "../cart/cartStore";
import { formatPrice } from "../lib/format";
import { useSendOrder } from "../queries/orders";
import { QuantityStepper } from "./QuantityStepper";

type CartPanelProps = {
  onClose: () => void;
};

export function CartPanel({ onClose }: CartPanelProps) {
  const items = useCartStore((s) => s.items);
  const hasNotes = useCartStore((s) => s.notes !== null);
  const total = useCartStore(selectTotal);
  const isSignedIn = useAuthStore((s) => s.session !== null);
  const sendOrder = useSendOrder();
  // Three actions in one object: useShallow compares the pieces, not the new object,
  // so the panel doesn't re-render just because the object was rebuilt.
  const { changeQty, remove, clear } = useCartStore(
    useShallow((s) => ({ changeQty: s.changeQty, remove: s.remove, clear: s.clear })),
  );

  return (
    <aside className="cart-panel">
      <div className="cart-panel__head">
        <h2 className="cart-panel__title">Your order</h2>
        <button type="button" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
      {items.length === 0 ? (
        <p className="note">Nothing here yet — the menu is waiting.</p>
      ) : (
        <>
          <ul className="cart-panel__list">
            {items.map((item) => (
              <li key={item.dish.id} className="cart-line">
                <span className="cart-line__name">{item.dish.name}</span>
                <QuantityStepper
                  qty={item.qty}
                  onDecrease={() => changeQty(item.dish.id, -1)}
                  onIncrease={() => changeQty(item.dish.id, 1)}
                />
                <button
                  type="button"
                  onClick={() => remove(item.dish.id)}
                  aria-label={`Remove ${item.dish.name}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <p className="cart-panel__total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </p>
          {isSignedIn ? (
            // isPending is true from the click until the server answers: no second click, no double order
            <button
              type="button"
              className="btn mt-4 w-full"
              disabled={sendOrder.isPending}
              onClick={() => sendOrder.mutate(undefined, { onSuccess: onClose })}
            >
              {sendOrder.isPending ? "Sending…" : "Send to the kitchen"}
            </button>
          ) : (
            <Link
              to="/login"
              state={{ from: "/menu" }}
              onClick={onClose}
              className="btn mt-4 w-full"
            >
              Sign in to send your order
            </Link>
          )}
          <Link to="/notes" onClick={onClose} className="cart-panel__notes">
            {hasNotes ? "Edit the table notes" : "Add table notes"}
          </Link>
          <button type="button" className="cart-panel__clear" onClick={clear}>
            Empty the order
          </button>
        </>
      )}
    </aside>
  );
}
