import type { Dish } from "../types";
import { DishCard } from "./DishCard";

type DishGridProps = {
  dishes: Dish[];
  cardHeading?: "h2" | "h3"; // h2 on a page whose title is the h1, h3 under a section's h2
};

export function DishGrid({ dishes, cardHeading }: DishGridProps) {
  return (
    <div className="grid-3">
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} as={cardHeading} />
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
