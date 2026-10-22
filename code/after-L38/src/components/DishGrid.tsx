import { ErrorBoundary } from "react-error-boundary";
import type { Dish } from "../types";
import { DishCard } from "./DishCard";

type DishGridProps = {
  dishes: Dish[];
  cardHeading?: "h2" | "h3"; // h2 on a page whose title is the h1, h3 under a section's h2
};

// One broken dish must not blank the whole menu: every card has its own boundary.
// A dish whose data is wrong (say, a price that is null) becomes one grey card, and the rest stay.
function BrokenCard({ name }: { name: string }) {
  return (
    <article className="card">
      <div className="card__body">
        <p className="note">{name} can't be shown right now.</p>
      </div>
    </article>
  );
}

export function DishGrid({ dishes, cardHeading }: DishGridProps) {
  return (
    <div className="grid-3">
      {dishes.map((dish) => (
        <ErrorBoundary
          key={dish.id}
          fallback={<BrokenCard name={dish.name} />}
          resetKeys={[dish]} // a new answer from the API gives the card another try
        >
          <DishCard dish={dish} as={cardHeading} />
        </ErrorBoundary>
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
