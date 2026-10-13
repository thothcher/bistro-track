import { formatPrice } from "../lib/format";
import { IMAGE_BASE } from "../lib/images";
import type { Dish } from "../types";

type DishCardProps = {
  dish: Dish;
};

export function DishCard({ dish }: DishCardProps) {
  return (
    <article className="card">
      <img src={IMAGE_BASE + dish.imageUrl} alt={dish.name} className="card__img" />
      <div className="card__body">
        <h3 className="card__title">
          {dish.name}
          <span className="card__leader" />
          <span className="card__price">{formatPrice(dish.price)}</span>
        </h3>
        <p className="card__desc">{dish.description}</p>
        {!dish.isAvailable && <p className="badge">Off the menu today</p>}
        <div className="card__actions">
          <button type="button" className="btn-outline" disabled={!dish.isAvailable}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
