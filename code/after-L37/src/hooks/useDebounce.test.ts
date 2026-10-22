import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  // Fake timers: the test moves the clock by hand, so a 400 ms wait takes 0 ms.
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("starts with the value it was given", () => {
    const { result } = renderHook(() => useDebounce("soup", 400));

    expect(result.current).toBe("soup");
  });

  it("changes only after the value has stopped changing", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: "so" },
    });

    rerender({ value: "sou" });
    act(() => void vi.advanceTimersByTime(399));
    expect(result.current).toBe("so"); // one millisecond too early

    act(() => void vi.advanceTimersByTime(1));
    expect(result.current).toBe("sou");
  });

  it("restarts the wait on every new keystroke", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: "s" },
    });

    rerender({ value: "so" });
    act(() => void vi.advanceTimersByTime(300));
    rerender({ value: "sou" }); // typed again before the 400 ms ended
    act(() => void vi.advanceTimersByTime(300));
    expect(result.current).toBe("s"); // 600 ms passed, yet nothing was sent

    act(() => void vi.advanceTimersByTime(100));
    expect(result.current).toBe("sou");
  });
});
