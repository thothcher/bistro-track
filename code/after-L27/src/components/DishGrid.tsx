import type { Dish } from "../types";
import { DishCard } from "./DishCard";

type DishGridProps = {
  dishes: Dish[];
};

export function DishGrid({ dishes }: DishGridProps) {
  return (
    <div className="grid-3">
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  );
}
