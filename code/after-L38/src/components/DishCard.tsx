import { Link } from "react-router";
import { AddToCart } from "@/components/AddToCart";
import { DishQuickLook } from "@/components/DishQuickLook";
import { formatPrice } from "@/lib/format";
import { IMAGE_BASE } from "@/lib/images";
import type { Dish } from "@/types";

type DishCardProps = {
  dish: Dish;
  as?: "h2" | "h3"; // one level below the heading of the section the card is in
};

export function DishCard({ dish, as: Heading = "h3" }: DishCardProps) {
  return (
    <article className="card">
      <Link to={`/menu/${dish.id}`}>
        {/* lazy: a photo far below the window waits until the guest scrolls near it (the box has its shape already, so nothing jumps) */}
        <img
          src={IMAGE_BASE + dish.imageUrl}
          alt={dish.name}
          className="card__img"
          loading="lazy"
          decoding="async"
        />
      </Link>
      <div className="card__body">
        <Heading className="card__title">
          <Link to={`/menu/${dish.id}`}>{dish.name}</Link>
          <span className="card__leader" />
          <span className="card__price">{formatPrice(dish.price)}</span>
        </Heading>
        <p className="card__desc">{dish.description}</p>
        {!dish.isAvailable && <p className="badge">Off the menu today</p>}
        <div className="card__actions">
          <DishQuickLook dish={dish} />
          <AddToCart dish={dish} />
        </div>
      </div>
    </article>
  );
}
