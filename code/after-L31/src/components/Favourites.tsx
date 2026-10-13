import { useCart } from "../cart/CartContext";
import { useApi } from "../hooks/useApi";
import type { Dish } from "../types";
import { DishGrid, DishGridSkeleton } from "./DishGrid";
import { Section } from "./Section";

const favouriteIds = [5, 15, 21];

export function Favourites() {
  const { add } = useCart();
  const { data, error, loading } = useApi<Dish[]>("/api/v1/enterprise/dishes");
  const favourites = (data ?? []).filter((dish) => favouriteIds.includes(dish.id));

  return (
    <Section id="favourites" eyebrow="From the kitchen" title="Today's favourites">
      {loading && <DishGridSkeleton count={3} />}
      {error && <p className="error">We couldn't load the menu — please try again.</p>}
      {data && (
        <>
          <DishGrid dishes={favourites} />
          {/* Three tickets in a row. The reducer adds 1 to a dish that is already in the order */}
          <div className="section__actions">
            <button
              type="button"
              className="btn"
              onClick={() => favourites.forEach((dish) => add(dish))}
            >
              Order all three
            </button>
          </div>
        </>
      )}
    </Section>
  );
}
