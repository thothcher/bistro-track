import type { ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Link, useLocation } from "react-router";

// What a guest sees when the page they asked for crashes while it renders.
// The header and the footer are outside the boundary: the site around it keeps working.
function PageCrash({ resetErrorBoundary }: FallbackProps) {
  return (
    <section className="status-page" role="alert">
      <p className="eyebrow">Oh là là</p>
      <h1 className="title">Something burnt in the kitchen</h1>
      <p className="status-page__text">
        This page stopped working. The rest of the house is fine.
      </p>
      <div className="flex items-center justify-center gap-6">
        <button type="button" className="btn" onClick={resetErrorBoundary}>
          Try again
        </button>
        <Link to="/menu" className="link">
          Back to the menu
        </Link>
      </div>
    </section>
  );
}

// Catches an error thrown while a page renders (and a page whose code could not be downloaded).
// Reaching another page clears the error: the boundary resets when the address changes.
export function PageBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary
      FallbackComponent={PageCrash}
      resetKeys={[pathname]}
      // The place to tell someone: a log, a service such as Sentry. Here, the console.
      onError={(error, info) => console.error("A page crashed:", error, info.componentStack)}
    >
      {children}
    </ErrorBoundary>
  );
}
