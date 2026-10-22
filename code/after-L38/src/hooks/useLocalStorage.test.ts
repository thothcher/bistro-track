import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  afterEach(() => vi.restoreAllMocks());

  it("starts with the initial value when nothing was saved", () => {
    const { result } = renderHook(() => useLocalStorage("seats", 2));

    expect(result.current[0]).toBe(2);
  });

  it("starts with what was saved before the page was refreshed", () => {
    localStorage.setItem("seats", "6");

    const { result } = renderHook(() => useLocalStorage("seats", 2));

    expect(result.current[0]).toBe(6);
  });

  it("saves every change", () => {
    const { result } = renderHook(() => useLocalStorage("seats", 2));

    act(() => result.current[1](4));

    expect(result.current[0]).toBe(4);
    expect(localStorage.getItem("seats")).toBe("4");
  });

  it("ignores saved text that is not valid JSON", () => {
    localStorage.setItem("seats", "{oops");

    const { result } = renderHook(() => useLocalStorage("seats", 2));

    expect(result.current[0]).toBe(2);
  });

  it("keeps working when the browser refuses to save (storage full or blocked)", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("The quota has been exceeded.", "QuotaExceededError");
    });
    const { result } = renderHook(() => useLocalStorage("seats", 2));

    act(() => result.current[1](5));

    expect(result.current[0]).toBe(5); // it just forgets on refresh
  });
});
