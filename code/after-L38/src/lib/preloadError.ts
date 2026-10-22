const KEY = "bistro.reloaded-at";

// After a new version of the site goes live, the files of the old version can be gone. A guest who
// still has the old page open clicks a link, the browser asks for KitchenPage-4fa81c2.js and gets a 404.
// Vite announces that with an event. The answer: load the new version, once.
// If it happens again a moment after the reload, something else is wrong: let the error boundary speak.
export function reloadWhenAFileIsGone(reload: () => void = () => window.location.reload()) {
  function onPreloadError(event: Event) {
    try {
      const last = Number(sessionStorage.getItem(KEY));
      if (Date.now() - last < 10_000) return;
      sessionStorage.setItem(KEY, String(Date.now()));
    } catch {
      return; // storage blocked: we cannot remember that we tried, so we must not try
    }
    event.preventDefault(); // "we have it": no error for this click
    reload();
  }
  window.addEventListener("vite:preloadError", onPreloadError);
  return () => window.removeEventListener("vite:preloadError", onPreloadError); // a test removes it again
}
