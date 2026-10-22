import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";

type Dish = { id: number; name: string; price: number | null };
const MENU: Dish[] = [
  { id: 1, name: "French onion soup", price: 14.5 },
  { id: 2, name: "Coq au vin", price: 32 },
  { id: 3, name: "Steak frites", price: 39 },
  { id: 4, name: "Crème brûlée", price: 13 },
  { id: 5, name: "Café au lait", price: 6 },
  { id: 6, name: "Bordeaux rouge", price: 28 },
];

// The same function as Le Bistro's lib/format.ts: it does not expect a price that is null
function formatPrice(price: number) {
  return Number.isInteger(price) ? `₾${price}` : `₾${price.toFixed(2)}`;
}

function DishCard({ dish }: { dish: Dish }) {
  return (
    <li className="pl-dish">
      <b>{dish.name}</b>
      <span>{formatPrice(dish.price as number)}</span>
    </li>
  );
}

function BrokenCard({ name }: { name: string }) {
  return <li className="pl-dish is-broken">{name} can't be shown right now.</li>;
}

function PageCrash({ resetErrorBoundary }: { resetErrorBoundary: () => void }) {
  return (
    <div className="pl-crash" role="alert">
      <b>Something burnt in the kitchen</b>
      <span>This page stopped working. The rest of the house is fine.</span>
      <button type="button" onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export type BoundaryLevel = "none" | "page" | "card";

// The page of the lab: a header, the menu, a footer. If the menu cannot render and nothing catches the error, React removes the whole tree.
function Site({ dishes, level }: { dishes: Dish[]; level: BoundaryLevel }) {
  const list = (
    <ul className="pl-menu">
      {dishes.map((d) =>
        level === "card" ? (
          <ErrorBoundary key={d.id} fallback={<BrokenCard name={d.name} />} resetKeys={[d]}>
            <DishCard dish={d} />
          </ErrorBoundary>
        ) : (
          <DishCard key={d.id} dish={d} />
        ),
      )}
    </ul>
  );
  return (
    <div className="pl-site">
      <header>Le Bistro <small>Menu · FAQ · Cart</small></header>
      <main>
        {level === "page" ? (
          <ErrorBoundary FallbackComponent={PageCrash} resetKeys={[dishes]}>
            {list}
          </ErrorBoundary>
        ) : (
          list
        )}
      </main>
      <footer>Kiacheli Street · Tbilisi</footer>
    </div>
  );
}

export function BoundaryLab() {
  const [level, setLevel] = useState<BoundaryLevel>("none");
  const [broken, setBroken] = useState(false);
  const [blank, setBlank] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  // The site lives in its own React root, so that "the whole app is gone" really is a root with nothing in it.
  // A new answer (or a new level) starts a fresh root, like a guest who reloads the page.
  useEffect(() => {
    const el = stage.current!;
    const dishes = MENU.map((d) => (broken && d.id === 3 ? { ...d, price: null } : d));
    const root = createRoot(el, {
      onUncaughtError: () => setBlank(true), // no boundary caught it: React has removed the root
      onCaughtError: () => {},
      onRecoverableError: () => {},
    });
    setBlank(false);
    root.render(<Site dishes={dishes} level={level} />);
    return () => root.unmount();
  }, [level, broken]);

  return (
    <div className="pl-lab pl-boundary">
      <div className="pl-controls">
        <div className="pl-group" role="group" aria-label="Where is the boundary?">
          <span className="pl-k">Boundary</span>
          <button type="button" className={level === "none" ? "is-on" : ""} onClick={() => setLevel("none")}>none</button>
          <button type="button" className={level === "page" ? "is-on" : ""} onClick={() => setLevel("page")}>around the page</button>
          <button type="button" className={level === "card" ? "is-on" : ""} onClick={() => setLevel("card")}>around each card</button>
        </div>
        <button type="button" className={broken ? "pl-go is-fix" : "pl-go"} onClick={() => setBroken((b) => !b)}>
          {broken ? "Fix the price of dish 3" : "The API sends no price for dish 3"}
        </button>
      </div>
      <div className="pl-stage pl-stage--boundary">
        <div ref={stage} className="pl-frame" data-blank={blank ? "1" : "0"} aria-label="The site" />
        {blank && (
          <p className="pl-blank" role="status">
            The whole page is gone. React could not render one card, found no boundary, and took everything down.
          </p>
        )}
      </div>
    </div>
  );
}
