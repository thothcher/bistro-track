import { useState } from "react";
import { categories } from "../data/categories";
import { dishes } from "../data/dishes";
import type { CartItem, Dish } from "../types";
import { CategoryChips } from "./CategoryChips";
import { DishGrid } from "./DishGrid";
import { SearchBox } from "./SearchBox";
import { Section } from "./Section";

type MenuSectionProps = {
  cart: CartItem[];
  onAdd: (dish: Dish) => void;
  onChangeQty: (dishId: number, delta: number) => void;
};

export function MenuSection({ cart, onAdd, onChangeQty }: MenuSectionProps) {
  // MenuSection is the closest common parent of the chips, the search box and the grid.
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  // Derived: calculated on every render from state and data, never stored in state.
  const visible = dishes.filter(
    (dish) =>
      (category === "all" || dish.categorySlug === category) &&
      dish.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Section id="menu" eyebrow="La carte" title="The menu">
      <div className="toolbar">
        <CategoryChips
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />
        <SearchBox value={query} onChange={setQuery} />
      </div>
      {visible.length === 0 ? (
        <p className="note">Nothing on the menu matches “{query}”.</p>
      ) : (
        <DishGrid dishes={visible} cart={cart} onAdd={onAdd} onChangeQty={onChangeQty} />
      )}
    </Section>
  );
}
