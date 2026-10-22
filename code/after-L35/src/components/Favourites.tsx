import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "../cart/cartStore";
import { dishQueries } from "../queries/dishes";
import { DishGrid, DishGridSkeleton } from "./DishGrid";
import { Section } from "./Section";

const favouriteIds = [5, 15, 21];

export function Favourites() {
  const add = useCartStore((s) => s.add);
  // The same cache entry as the menu page: the first page to ask fetches, the rest reuse it
  const { data, isPending, isError } = useQuery(dishQueries.list("all"));
  const favourites = (data ?? []).filter((dish) => favouriteIds.includes(dish.id));

  return (
    <Section id="favourites" eyebrow="From the kitchen" title="Today's favourites">
      {isPending && <DishGridSkeleton count={3} />}
      {isError && <p className="error">We couldn't load the menu — please try again.</p>}
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
