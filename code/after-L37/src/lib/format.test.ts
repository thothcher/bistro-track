import { describe, expect, it } from "vitest";
import { formatItems, formatPrice } from "./format";

describe("formatPrice", () => {
  it.each([
    [32, "₾32"],
    [14.5, "₾14.50"],
    [0, "₾0"],
    [9.999, "₾10.00"],
  ])("formats %s as %s", (price, expected) => {
    expect(formatPrice(price)).toBe(expected);
  });
});

describe("formatItems", () => {
  it("uses the singular for exactly one", () => {
    expect(formatItems(1)).toBe("1 item");
  });

  it.each([0, 2, 11])("uses the plural for %i", (count) => {
    expect(formatItems(count)).toBe(`${count} items`);
  });
});
