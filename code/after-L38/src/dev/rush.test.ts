import { describe, expect, it } from "vitest";
import { queue } from "@/test/fixtures";
import { withRush } from "./rush";

const real = { serverTime: "2026-10-22T18:05:00Z", orders: queue };

describe("withRush", () => {
  it("adds the pretend orders after the real ones", () => {
    const rushed = withRush(real, 800);

    expect(rushed.orders).toHaveLength(805);
    expect(rushed.orders?.slice(0, 5)).toEqual(queue);
  });

  it("gives the same ids every time, so a row keeps its place when the queue is fetched again", () => {
    const ids = (q: typeof real) => withRush(q, 50).orders?.map((o) => o.id);

    expect(ids(real)).toEqual(ids(real));
    expect(new Set(ids(real)).size).toBe(55); // and no two orders share one
  });

  it("works when the real queue is empty (the API sends null)", () => {
    expect(withRush({ ...real, orders: null }, 10).orders).toHaveLength(10);
  });
});
