import { Link, useParams } from "react-router";
import { useCart } from "../cart/CartContext";
import { DishGrid } from "../components/DishGrid";
import { QuantityStepper } from "../components/QuantityStepper";
import { Section } from "../components/Section";
import { useApi } from "../hooks/useApi";
import { formatPrice } from "../lib/format";
import { IMAGE_BASE } from "../lib/images";
import type { Dish } from "../types";
import { NotFoundPage } from "./StatusPages";

export function DishPage() {
  const { id } = useParams(); // from the URL /menu/5. Always a string: "5"
  const { qtyOf, add, changeQty } = useCart();
  // The API has no public "one dish" endpoint, so we load the menu and find the dish.
  const { data, error, loading } = useApi<Dish[]>("/api/v1/enterprise/dishes");

  if (loading) return <p className="status">Loading…</p>;
  if (error) return <p className="status">We couldn't load this dish.</p>;

  const dish = data?.find((d) => d.id === Number(id));
  if (!dish) return <NotFoundPage />;

  const qty = qtyOf(dish.id);
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
                onClick={() => add(dish)}
              >
                Add to cart · {formatPrice(dish.price)}
              </button>
            ) : (
              <QuantityStepper
                qty={qty}
                onDecrease={() => changeQty(dish.id, -1)}
                onIncrease={() => changeQty(dish.id, 1)}
              />
            )}
          </div>
        </article>
      </div>
      <Section eyebrow="From the cellar and the pastry case" title="Goes well with">
        <DishGrid dishes={pairs} />
      </Section>
    </>
  );
}
