import { describe, expect, it } from "vitest";
import { queue } from "@/test/fixtures";
import { countByStatus, filterOrders } from "./orders";

describe("filterOrders", () => {
  it("shows every order for 'All' and no text", () => {
    expect(filterOrders(queue, "ALL", "")).toHaveLength(5);
  });

  it("keeps only the orders with the chosen status", () => {
    const cooking = filterOrders(queue, "COOKING", "");

    expect(cooking.map((o) => o.status)).toEqual(["COOKING", "COOKING"]);
  });

  it("finds a guest by part of the name, in any letter case", () => {
    const found = filterOrders(queue, "ALL", "  MARI ");

    expect(found.map((o) => o.customerName)).toEqual(["Mari K.", "Mariam B."]);
  });

  it("calls a guest with no name 'Guest', like the page does", () => {
    expect(filterOrders(queue, "ALL", "guest")).toHaveLength(1);
  });

  it("applies the status and the text together", () => {
    const found = filterOrders(queue, "PENDING", "mariam");

    expect(found.map((o) => o.customerName)).toEqual(["Mariam B."]);
  });
});

describe("countByStatus", () => {
  it("counts every tab", () => {
    expect(countByStatus(queue)).toEqual({ ALL: 5, PENDING: 2, COOKING: 2, READY: 1 });
  });

  it("is all zeros for an empty queue", () => {
    expect(countByStatus([])).toEqual({ ALL: 0, PENDING: 0, COOKING: 0, READY: 0 });
  });
});
