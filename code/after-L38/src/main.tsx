import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "./index.css";
import { RootCrash } from "./components/RootCrash";
import { queryClient } from "./lib/queryClient";
import { reloadWhenAFileIsGone } from "./lib/preloadError";

// A guest with an old tab open, and a page whose file was replaced by a new deploy: reload once
reloadWhenAFileIsGone();

// The cache needs one provider. The cart and the session stay in stores (L32).
// The outermost boundary is the last safety net: pages and dishes have their own, closer to the problem.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={RootCrash}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        {/* The inspector for the cache. It is left out of the production build. */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
