import { describe, expect, it } from "vitest";
import type { TableNotes } from "../schemas/tableNotes";
import { toKitchenNotes } from "./kitchenNotes";

const valid: TableNotes = {
  seats: 4,
  arrival: "19:30",
  special: [{ name: "Nino", need: "No mushrooms" }],
  note: "  Birthday — a candle, please.  ",
};

describe("toKitchenNotes", () => {
  it("writes one sentence the kitchen can read", () => {
    expect(toKitchenNotes(valid)).toBe(
      "Table of 4, arriving 19:30. Nino: No mushrooms. Birthday — a candle, please.",
    );
  });

  it("leaves out an empty note", () => {
    expect(toKitchenNotes({ ...valid, special: [], note: "   " })).toBe(
      "Table of 4, arriving 19:30.",
    );
  });
});
