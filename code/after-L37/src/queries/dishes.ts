import { queryOptions } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Category, Dish, SearchResponse } from "../types";

// The query key is the address of the data in the cache: the same key, the same entry.
// Every key about dishes starts with "dishes", so one call can refresh them all together.
export const dishQueries = {
  list: (category: string) =>
    queryOptions({
      queryKey: ["dishes", "list", category],
      queryFn: () =>
        api<Dish[]>(
          category === "all"
            ? "/api/v1/enterprise/dishes"
            : `/api/v1/enterprise/dishes?category=${category}`,
        ),
    }),

  search: (text: string) =>
    queryOptions({
      queryKey: ["dishes", "search", text],
      queryFn: () =>
        api<SearchResponse>(`/api/v1/enterprise/search?q=${encodeURIComponent(text)}`),
    }),

  categories: () =>
    queryOptions({
      queryKey: ["categories"],
      queryFn: () => api<Category[]>("/api/v1/enterprise/categories"),
      staleTime: 10 * 60_000, // the categories almost never change
    }),
};
