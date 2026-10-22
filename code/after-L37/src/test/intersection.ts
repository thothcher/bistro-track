import { vi } from "vitest";

type Callback = (entries: Pick<IntersectionObserverEntry, "isIntersecting" | "target">[]) => void;

// jsdom is not a browser: it has no IntersectionObserver, and `new IntersectionObserver()` throws.
// This stand-in remembers who watches what, and lets a test say "that element just scrolled into view".
export function fakeIntersectionObserver() {
  const watchers: { callback: Callback; target: Element; disconnected: boolean }[] = [];

  class FakeObserver {
    #callback: Callback;
    constructor(callback: Callback) {
      this.#callback = callback;
    }
    observe(target: Element) {
      watchers.push({ callback: this.#callback, target, disconnected: false });
    }
    disconnect() {
      for (const w of watchers) if (w.callback === this.#callback) w.disconnected = true;
    }
    unobserve() {}
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", FakeObserver); // setup.ts puts the real (missing) one back after each test

  return {
    watchers,
    scrollIntoView() {
      for (const w of watchers) {
        if (!w.disconnected) w.callback([{ isIntersecting: true, target: w.target }]);
      }
    },
  };
}
