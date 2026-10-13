import type { CartItem, Dish } from "../types";
import { DishCard } from "./DishCard";

type DishGridProps = {
  dishes: Dish[];
  cart: CartItem[];
  onAdd: (dish: Dish) => void;
  onChangeQty: (dishId: number, delta: number) => void;
};

export function DishGrid({ dishes, cart, onAdd, onChangeQty }: DishGridProps) {
  return (
    <div className="grid-3">
      {dishes.map((dish) => (
        <DishCard
          key={dish.id}
          dish={dish}
          qty={cart.find((item) => item.dish.id === dish.id)?.qty ?? 0}
          onAdd={() => onAdd(dish)}
          onChangeQty={(delta) => onChangeQty(dish.id, delta)}
        />
      ))}
    </div>
  );
}
