import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { CategoryChips } from "../components/CategoryChips";
import { DishGrid, DishGridSkeleton } from "../components/DishGrid";
import { SearchBox } from "../components/SearchBox";
import { Section } from "../components/Section";
import { useDebounce } from "../hooks/useDebounce";
import { ApiError } from "../lib/api";
import { dishQueries } from "../queries/dishes";

export function MenuPage() {
  const queryClient = useQueryClient();
  // The filters live in the URL: /menu?category=drinks or /menu?q=soup
  // Such a link can be shared and bookmarked, and the Back button works.
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "all";
  const query = params.get("q") ?? "";

  const search = useDebounce(query.trim(), 400);
  const searching = search !== "" && query.trim() !== "";

  const categories = useQuery(dishQueries.categories());
  // keepPreviousData: while another category loads, the old dishes stay on screen
  const menu = useQuery({
    ...dishQueries.list(category),
    placeholderData: keepPreviousData,
    enabled: !searching,
  });
  const results = useQuery({ ...dishQueries.search(search), enabled: searching });

  const active = searching ? results : menu;
  const dishes = searching ? results.data?.items : menu.data;
  const rateLimited = active.error instanceof ApiError && active.error.status === 429;

  function selectCategory(slug: string) {
    setParams(slug === "all" ? {} : { category: slug });
  }

  function changeQuery(text: string) {
    setParams(text ? { q: text } : {}, { replace: true }); // typing adds no history entries
  }

  return (
    <Section eyebrow="La carte" title="The menu" as="h1">
      <div className="toolbar">
        <CategoryChips
          categories={categories.data ?? []}
          selected={searching ? "" : category}
          onSelect={selectCategory}
          // Start the request when the pointer arrives: by the click the dishes are often here
          onHover={(slug) => void queryClient.prefetchQuery(dishQueries.list(slug))}
        />
        <SearchBox value={query} onChange={changeQuery} />
      </div>

      {searching && results.data && (
        <p className="results">
          Results for “{search}”{" "}
          <span className="results__count">· {results.data.count} found</span>
        </p>
      )}
      {active.isLoading && <DishGridSkeleton />}
      {rateLimited && active.error instanceof ApiError && (
        <p className="error">
          One moment — you can search again in {active.error.retryAfter ?? 60} s.
        </p>
      )}
      {active.isError && !rateLimited && (
        <p className="error">
          We couldn't load the menu.{" "}
          <button type="button" className="link" onClick={() => void active.refetch()}>
            Try again
          </button>
        </p>
      )}
      {dishes?.length === 0 && (
        <p className="note">Nothing on the menu matches “{search}”.</p>
      )}
      {dishes && dishes.length > 0 && (
        <div
          aria-busy={active.isPlaceholderData}
          className={active.isPlaceholderData ? "opacity-50 transition" : "transition"}
        >
          <DishGrid dishes={dishes} cardHeading="h2" />
        </div>
      )}
    </Section>
  );
}
