import { useEffect, useRef } from "react";

// Calls onEnter when the element (a "sentinel" below a list) scrolls into view.
// The browser's IntersectionObserver does the watching: no scroll listener, no maths.
export function useInView<T extends Element>(onEnter: () => void, enabled = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onEnter();
      },
      { rootMargin: "200px" }, // start a little before the sentinel is visible
    );
    observer.observe(node);
    return () => observer.disconnect(); // cleanup: stop watching
  }, [onEnter, enabled]);

  return ref;
}
