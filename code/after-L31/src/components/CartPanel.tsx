import { useCart } from "../cart/CartContext";
import { formatPrice } from "../lib/format";
import { QuantityStepper } from "./QuantityStepper";

type CartPanelProps = {
  onClose: () => void;
};

export function CartPanel({ onClose }: CartPanelProps) {
  const { items, total, changeQty, remove, clear } = useCart();

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
          <button type="button" className="cart-panel__clear" onClick={clear}>
            Empty the order
          </button>
        </>
      )}
    </aside>
  );
}
