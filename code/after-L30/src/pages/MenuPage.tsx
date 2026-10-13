import { useSearchParams } from "react-router";
import { CategoryChips } from "../components/CategoryChips";
import { DishGrid, DishGridSkeleton } from "../components/DishGrid";
import { SearchBox } from "../components/SearchBox";
import { Section } from "../components/Section";
import { useApi } from "../hooks/useApi";
import { useDebounce } from "../hooks/useDebounce";
import type { CartItem, Category, Dish, SearchResponse } from "../types";

type MenuPageProps = {
  cart: CartItem[];
  onAdd: (dish: Dish) => void;
  onChangeQty: (dishId: number, delta: number) => void;
};

export function MenuPage({ cart, onAdd, onChangeQty }: MenuPageProps) {
  // The filters live in the URL: /menu?category=drinks or /menu?q=soup
  // Such a link can be shared and bookmarked, and the Back button works.
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "all";
  const query = params.get("q") ?? "";

  const search = useDebounce(query.trim(), 400);
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
    setParams(slug === "all" ? {} : { category: slug });
  }

  function changeQuery(text: string) {
    setParams(text ? { q: text } : {}, { replace: true }); // typing adds no history entries
  }

  return (
    <Section eyebrow="La carte" title="The menu">
      <div className="toolbar">
        <CategoryChips
          categories={categories.data ?? []}
          selected={searching ? "" : category}
          onSelect={selectCategory}
        />
        <SearchBox value={query} onChange={changeQuery} />
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
