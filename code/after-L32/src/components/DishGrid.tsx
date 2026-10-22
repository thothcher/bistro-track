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

// Grey placeholder cards while the dishes are loading
export function DishGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid-3" aria-busy="true" aria-label="Loading dishes">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton" />
      ))}
    </div>
  );
}
