import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reloadWhenAFileIsGone } from "./preloadError";

// Vite sends this event when the file of a lazy page cannot be downloaded. cancelable: a listener may say "handled"
const preloadError = () => new Event("vite:preloadError", { cancelable: true });

describe("reloadWhenAFileIsGone", () => {
  let stop: () => void;
  const reload = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    reload.mockClear();
    stop = reloadWhenAFileIsGone(reload);
  });
  afterEach(() => {
    stop(); // the listener is on window: it must not live on into the next test
    vi.useRealTimers();
  });

  it("reloads the page once, and says the error is handled", () => {
    const event = preloadError();

    window.dispatchEvent(event);

    expect(reload).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it("does not reload again a moment later: the second failure is a real problem", () => {
    window.dispatchEvent(preloadError());
    const second = preloadError();

    window.dispatchEvent(second);

    expect(reload).toHaveBeenCalledTimes(1);
    expect(second.defaultPrevented).toBe(false); // the error reaches the error boundary
  });

  it("reloads again for a later deploy", () => {
    window.dispatchEvent(preloadError());

    vi.advanceTimersByTime(11_000);
    window.dispatchEvent(preloadError());

    expect(reload).toHaveBeenCalledTimes(2);
  });

  it("does nothing once it has been switched off", () => {
    stop();

    window.dispatchEvent(preloadError());

    expect(reload).not.toHaveBeenCalled();
  });
});
