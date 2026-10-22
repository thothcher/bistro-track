import { describe, expect, it } from "vitest";
import { cafeAuLait, coqAuVin, frenchOnionSoup } from "@/test/fixtures";
import type { CartItem } from "@/types";
import { cartReducer, MAX_QTY } from "./cartReducer";

// A pure function is the easiest thing to test: put something in, look at what comes out.
describe("cartReducer", () => {
  const withSoup: CartItem[] = [{ dish: frenchOnionSoup, qty: 1 }];

  it("adds a new dish with quantity 1", () => {
    const cart = cartReducer([], { type: "added", dish: coqAuVin });

    expect(cart).toEqual([{ dish: coqAuVin, qty: 1 }]);
  });

  it("adds the same dish again by raising its quantity, not by adding a second line", () => {
    const cart = cartReducer(withSoup, { type: "added", dish: frenchOnionSoup });

    expect(cart).toHaveLength(1);
    expect(cart[0].qty).toBe(2);
  });

  it("never goes above the maximum quantity", () => {
    const full: CartItem[] = [{ dish: frenchOnionSoup, qty: MAX_QTY }];

    const cart = cartReducer(full, { type: "added", dish: frenchOnionSoup });

    expect(cart[0].qty).toBe(MAX_QTY);
  });

  // The test above quotes MAX_QTY from the code, so if somebody changes the limit to 11 it still passes.
  // The limit is a rule of the restaurant: write it down in plain numbers, once, in a test.
  it("stops at ten of a dish, whatever the code says", () => {
    const nine: CartItem[] = [{ dish: coqAuVin, qty: 9 }];

    const ten = cartReducer(nine, { type: "added", dish: coqAuVin });
    const stillTen = cartReducer(ten, { type: "added", dish: coqAuVin });

    expect(ten[0].qty).toBe(10);
    expect(stillTen[0].qty).toBe(10);
  });

  it("ignores a dish that is off the menu today", () => {
    const cart = cartReducer(withSoup, { type: "added", dish: cafeAuLait });

    expect(cart).toBe(withSoup); // the very same array: nothing was even copied
  });

  // The same rule, many inputs: one line per case, and the report names every row.
  it.each([
    { start: 2, delta: 1, expected: 3 },
    { start: 2, delta: -1, expected: 1 },
    { start: 9, delta: 5, expected: MAX_QTY },
  ])("changes quantity $start by $delta to $expected", ({ start, delta, expected }) => {
    const cart = cartReducer([{ dish: coqAuVin, qty: start }], {
      type: "qtyChanged",
      dishId: coqAuVin.id,
      delta,
    });

    expect(cart[0].qty).toBe(expected);
  });

  it("removes the line when the quantity reaches zero", () => {
    const cart = cartReducer(withSoup, { type: "qtyChanged", dishId: frenchOnionSoup.id, delta: -1 });

    expect(cart).toEqual([]);
  });

  it("removes one dish and keeps the others", () => {
    const two: CartItem[] = [
      { dish: coqAuVin, qty: 1 },
      { dish: frenchOnionSoup, qty: 2 },
    ];

    const cart = cartReducer(two, { type: "removed", dishId: coqAuVin.id });

    expect(cart).toEqual([{ dish: frenchOnionSoup, qty: 2 }]);
  });

  it("clears everything", () => {
    expect(cartReducer(withSoup, { type: "cleared" })).toEqual([]);
  });

  it("does not change the cart it was given", () => {
    const before = structuredClone(withSoup);

    cartReducer(withSoup, { type: "added", dish: frenchOnionSoup });

    expect(withSoup).toEqual(before); // a reducer returns a new cart, it never edits the old one
  });
});
