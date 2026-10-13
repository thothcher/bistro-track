import { useState } from "react";
import { useApi } from "../hooks/useApi";
import { useDebounce } from "../hooks/useDebounce";
import type { CartItem, Category, Dish, SearchResponse } from "../types";
import { CategoryChips } from "./CategoryChips";
import { DishGrid, DishGridSkeleton } from "./DishGrid";
import { SearchBox } from "./SearchBox";
import { Section } from "./Section";

type MenuSectionProps = {
  cart: CartItem[];
  onAdd: (dish: Dish) => void;
  onChangeQty: (dishId: number, delta: number) => void;
};

export function MenuSection({ cart, onAdd, onChangeQty }: MenuSectionProps) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const search = useDebounce(query.trim(), 400); // waits until typing stops
  const searching = search !== "" && query.trim() !== "";

  const menuPath =
    category === "all"
      ? "/api/v1/enterprise/dishes"
      : `/api/v1/enterprise/dishes?category=${category}`;
  const searchPath = `/api/v1/enterprise/search?q=${encodeURIComponent(search)}`;

  const categories = useApi<Category[]>("/api/v1/enterprise/categories");
  const menu = useApi<Dish[]>(searching ? null : menuPath);
  const results = useApi<SearchResponse>(searching ? searchPath : null);

  const dishes = searching ? (results.data?.items ?? null) : menu.data;
  const error = searching ? results.error : menu.error;
  const loading = searching ? results.loading : menu.loading;

  function selectCategory(slug: string) {
    setQuery("");
    setCategory(slug);
  }

  return (
    <Section id="menu" eyebrow="La carte" title="The menu">
      <div className="toolbar">
        <CategoryChips
          categories={categories.data ?? []}
          selected={searching ? "" : category}
          onSelect={selectCategory}
        />
        <SearchBox value={query} onChange={setQuery} />
      </div>

      {searching && results.data && (
        <p className="results">
          Results for “{search}”{" "}
          <span className="results__count">· {results.data.count} found</span>
        </p>
      )}
      {loading && <DishGridSkeleton />}
      {error?.status === 429 && (
        <p className="error">
          One moment — you can search again in {error.retryAfter ?? 60} s.
        </p>
      )}
      {error && error.status !== 429 && (
        <p className="error">We couldn't load the menu — please try again.</p>
      )}
      {dishes?.length === 0 && (
        <p className="note">Nothing on the menu matches “{search}”.</p>
      )}
      {dishes && dishes.length > 0 && (
        <DishGrid dishes={dishes} cart={cart} onAdd={onAdd} onChangeQty={onChangeQty} />
      )}
    </Section>
  );
}
