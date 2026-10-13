import { formatPrice } from "../lib/format";
import type { CartItem } from "../types";
import { QuantityStepper } from "./QuantityStepper";

type CartPanelProps = {
  items: CartItem[];
  onChangeQty: (dishId: number, delta: number) => void;
  onRemove: (dishId: number) => void;
  onClose: () => void;
};

export function CartPanel({ items, onChangeQty, onRemove, onClose }: CartPanelProps) {
  const total = items.reduce((sum, item) => sum + item.dish.price * item.qty, 0);

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
                  onDecrease={() => onChangeQty(item.dish.id, -1)}
                  onIncrease={() => onChangeQty(item.dish.id, 1)}
                />
                <button
                  type="button"
                  onClick={() => onRemove(item.dish.id)}
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
        </>
      )}
    </aside>
  );
}
