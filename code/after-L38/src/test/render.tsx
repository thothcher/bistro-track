import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router";
import { createQueryClient } from "@/lib/queryClient";
import { LocationDisplay } from "./LocationDisplay";

// A new cache for every test (no data left over from the last one), built with the app's own
// rules but without retries: a failing request should fail the test now, not after three tries.
export function makeTestQueryClient() {
  return createQueryClient({ retry: false });
}

type Options = {
  route?: string | { pathname: string; state?: unknown };
  queryClient?: QueryClient;
};

// Renders a component the way the app does: inside the cache provider and a router.
export function renderWithProviders(
  ui: ReactElement,
  { route = "/", queryClient = makeTestQueryClient() }: Options = {},
) {
  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>
          {ui}
          <LocationDisplay />
        </MemoryRouter>
      </QueryClientProvider>,
    ),
  };
}
