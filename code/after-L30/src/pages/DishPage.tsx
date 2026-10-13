import { Link, useParams } from "react-router";
import { DishGrid } from "../components/DishGrid";
import { QuantityStepper } from "../components/QuantityStepper";
import { Section } from "../components/Section";
import { useApi } from "../hooks/useApi";
import { formatPrice } from "../lib/format";
import { IMAGE_BASE } from "../lib/images";
import type { CartItem, Dish } from "../types";
import { NotFoundPage } from "./StatusPages";

type DishPageProps = {
  cart: CartItem[];
  onAdd: (dish: Dish) => void;
  onChangeQty: (dishId: number, delta: number) => void;
};

export function DishPage({ cart, onAdd, onChangeQty }: DishPageProps) {
  const { id } = useParams(); // from the URL /menu/5. Always a string: "5"
  // The API has no public "one dish" endpoint, so we load the menu and find the dish.
  const { data, error, loading } = useApi<Dish[]>("/api/v1/enterprise/dishes");

  if (loading) return <p className="status">Loading…</p>;
  if (error) return <p className="status">We couldn't load this dish.</p>;

  const dish = data?.find((d) => d.id === Number(id));
  if (!dish) return <NotFoundPage />;

  const qty = cart.find((item) => item.dish.id === dish.id)?.qty ?? 0;
  const pairWith = dish.categorySlug === "drinks" ? "desserts" : "drinks";
  const pairs = (data ?? []).filter((d) => d.categorySlug === pairWith).slice(0, 3);

  return (
    <>
      <div className="dish">
        <Link to="/menu" className="back-link">
          ← Back to the menu
        </Link>
        <article className="dish__grid">
          <img src={IMAGE_BASE + dish.imageUrl} alt={dish.name} className="dish__img" />
          <div className="dish__info">
            <p className="eyebrow">{dish.categoryName}</p>
            <h1 className="dish__name">{dish.name}</h1>
            <p className="dish__desc">{dish.description}</p>
            <p className="dish__price">{formatPrice(dish.price)}</p>
            {qty === 0 ? (
              <button
                type="button"
                className="btn"
                disabled={!dish.isAvailable}
                onClick={() => onAdd(dish)}
              >
                Add to cart · {formatPrice(dish.price)}
              </button>
            ) : (
              <QuantityStepper
                qty={qty}
                onDecrease={() => onChangeQty(dish.id, -1)}
                onIncrease={() => onChangeQty(dish.id, 1)}
              />
            )}
          </div>
        </article>
      </div>
      <Section eyebrow="From the cellar and the pastry case" title="Goes well with">
        <DishGrid dishes={pairs} cart={cart} onAdd={onAdd} onChangeQty={onChangeQty} />
      </Section>
    </>
  );
}
