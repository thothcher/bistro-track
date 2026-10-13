import { useApi } from "../hooks/useApi";
import type { CartItem, Dish } from "../types";
import { DishGrid, DishGridSkeleton } from "./DishGrid";
import { Section } from "./Section";

const favouriteIds = [5, 15, 21];

type FavouritesProps = {
  cart: CartItem[];
  onAdd: (dish: Dish) => void;
  onChangeQty: (dishId: number, delta: number) => void;
};

export function Favourites({ cart, onAdd, onChangeQty }: FavouritesProps) {
  const { data, error, loading } = useApi<Dish[]>("/api/v1/enterprise/dishes");
  const favourites = (data ?? []).filter((dish) => favouriteIds.includes(dish.id));

  return (
    <Section id="favourites" eyebrow="From the kitchen" title="Today's favourites">
      {loading && <DishGridSkeleton count={3} />}
      {error && <p className="error">We couldn't load the menu — please try again.</p>}
      {data && (
        <DishGrid
          dishes={favourites}
          cart={cart}
          onAdd={onAdd}
          onChangeQty={onChangeQty}
        />
      )}
    </Section>
  );
}
