import { Link } from "react-router";
import { useCart } from "../cart/CartContext";
import { formatPrice } from "../lib/format";
import { IMAGE_BASE } from "../lib/images";
import type { Dish } from "../types";
import { QuantityStepper } from "./QuantityStepper";

type DishCardProps = {
  dish: Dish;
};

export function DishCard({ dish }: DishCardProps) {
  const { qtyOf, add, changeQty } = useCart(); // straight from context: no cart props
  const qty = qtyOf(dish.id);

  return (
    <article className="card">
      <Link to={`/menu/${dish.id}`}>
        <img src={IMAGE_BASE + dish.imageUrl} alt={dish.name} className="card__img" />
      </Link>
      <div className="card__body">
        <h3 className="card__title">
          <Link to={`/menu/${dish.id}`}>{dish.name}</Link>
          <span className="card__leader" />
          <span className="card__price">{formatPrice(dish.price)}</span>
        </h3>
        <p className="card__desc">{dish.description}</p>
        {!dish.isAvailable && <p className="badge">Off the menu today</p>}
        <div className="card__actions">
          {qty === 0 ? (
            <button
              type="button"
              className="btn-outline"
              disabled={!dish.isAvailable}
              onClick={() => add(dish)}
            >
              Add to cart
            </button>
          ) : (
            <QuantityStepper
              qty={qty}
              onDecrease={() => changeQty(dish.id, -1)}
              onIncrease={() => changeQty(dish.id, 1)}
            />
          )}
        </div>
      </div>
    </article>
  );
}
