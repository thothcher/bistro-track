import { describe, expect, it } from "vitest";
import { tableNotesSchema, type TableNotes } from "./tableNotes";

const valid: TableNotes = {
  seats: 4,
  arrival: "19:30",
  special: [{ name: "Nino", need: "No mushrooms" }],
  note: "  Birthday — a candle, please.  ",
};

describe("tableNotesSchema", () => {
  it("accepts a complete form", () => {
    expect(tableNotesSchema.safeParse(valid).success).toBe(true);
  });

  // The schema is the rulebook: test the rules at their edges.
  it.each([
    { seats: 0, message: "At least one seat" },
    { seats: 9, message: "Up to eight seats" },
  ])("refuses $seats seats", ({ seats, message }) => {
    const result = tableNotesSchema.safeParse({ ...valid, seats });

    expect(result.error?.issues[0].message).toBe(message);
  });

  it("refuses an arrival time when the kitchen is closed", () => {
    const result = tableNotesSchema.safeParse({ ...valid, arrival: "03:00" });

    expect(result.success).toBe(false);
  });

  it("points at the exact guest that is missing a detail", () => {
    const result = tableNotesSchema.safeParse({
      ...valid,
      special: [{ name: "Nino", need: "No mushrooms" }, { name: "G", need: "" }],
    });

    expect(result.error?.issues.map((i) => i.path.join("."))).toEqual([
      "special.1.name",
      "special.1.need",
    ]);
  });
});
