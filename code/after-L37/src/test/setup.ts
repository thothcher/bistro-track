import "@testing-library/jest-dom/vitest"; // adds toBeInTheDocument(), toBeDisabled(), toHaveFocus()…
import { cleanup, configure } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { useAuthStore } from "@/auth/authStore";
import { useCartStore } from "@/cart/cartStore";
import { server } from "./server";

// findBy… and waitFor give up after 1 second by default. A busy laptop or a shared robot needs more,
// and this is the one place to say so: not in every test.
configure({ asyncUtilTimeout: 5000 });

// "error": a request nobody planned for fails the test, loudly, instead of quietly reaching the internet
// (MSW 2 called this option onUnhandledRequest; MSW 3 calls it onUnhandledFrame, and the default is only "warn")
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));

afterEach(() => {
  cleanup(); // remove what the last test put on the page (automatic only when vitest globals are on)
  server.resetHandlers(); // forget the server.use(...) overrides of the last test
  vi.unstubAllGlobals(); // give back what vi.stubGlobal replaced (for example IntersectionObserver)
  // A store is a variable in memory: it outlives the test that filled it.
  // Empty both stores first, then the storage they write to.
  useAuthStore.setState({ session: null });
  useCartStore.setState({ items: [], notes: null });
  localStorage.clear();
});

afterAll(() => server.close());
