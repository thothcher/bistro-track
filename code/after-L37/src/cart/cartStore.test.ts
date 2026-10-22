import { beforeEach, describe, expect, it } from "vitest";
import { cafeAuLait, coqAuVin, frenchOnionSoup } from "@/test/fixtures";
import { selectCount, selectQtyOf, selectTotal, useCartStore } from "./cartStore";

// A store lives outside React, so it can be tested without rendering anything.
// What it must NOT do is carry state from one test to the next: reset it every time.
describe("cartStore", () => {
  beforeEach(() => useCartStore.setState({ items: [], notes: null }));

  it("starts empty", () => {
    expect(useCartStore.getState().items).toEqual([]);
  });

  it("adds dishes and counts them", () => {
    const { add } = useCartStore.getState();

    add(coqAuVin);
    add(frenchOnionSoup);
    add(frenchOnionSoup);

    const state = useCartStore.getState();
    expect(selectCount(state)).toBe(3);
    expect(selectQtyOf(frenchOnionSoup.id)(state)).toBe(2);
    expect(selectQtyOf(cafeAuLait.id)(state)).toBe(0);
  });

  it("adds up the total from the prices", () => {
    const { add } = useCartStore.getState();

    add(coqAuVin); // 32
    add(frenchOnionSoup); // 14.5
    add(frenchOnionSoup);

    expect(selectTotal(useCartStore.getState())).toBe(32 + 14.5 * 2);
  });

  it("does not take a dish that is off the menu", () => {
    useCartStore.getState().add(cafeAuLait);

    expect(useCartStore.getState().items).toEqual([]);
  });

  it("saves itself in localStorage, under its own key", () => {
    useCartStore.getState().add(coqAuVin);

    const saved = JSON.parse(localStorage.getItem("bistro.cart") ?? "null");
    expect(saved.state.items).toEqual([{ dish: coqAuVin, qty: 1 }]);
    expect(saved.state).not.toHaveProperty("add"); // the data is saved, the functions are not
  });

  it("forgets the notes when the order is cleared", () => {
    useCartStore.getState().add(coqAuVin);
    useCartStore.getState().saveNotes({
      seats: 2,
      arrival: "19:30",
      special: [{ name: "Nino", need: "No mushrooms" }],
      note: "",
    });

    useCartStore.getState().clear();

    expect(useCartStore.getState()).toMatchObject({ items: [], notes: null });
  });
});
