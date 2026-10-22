import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { manyOrders, queue } from "@/test/fixtures";
import { giveElementsASize } from "@/test/layout";
import { renderWithProviders } from "@/test/render";
import { server } from "@/test/server";
import type { QueueOrder } from "@/types";
import { KitchenPage } from "./KitchenPage";

const QUEUE_URL = "/api/v1/enterprise/orders/queue";
const answerWith = (orders: QueueOrder[] | null) =>
  http.get(QUEUE_URL, () => HttpResponse.json({ serverTime: "2026-10-22T18:05:00Z", orders }));

// The names of the guests whose tickets are on the screen
const guests = () => screen.getAllByRole("listitem").map((li) => within(li).getByRole("strong").textContent);

describe("KitchenPage", () => {
  // jsdom draws nothing, so a virtualized list would think its window is 0 pixels tall and show no rows
  beforeEach(() => giveElementsASize({ height: 600 }));

  it("shows the open orders, and how many each tab would show", async () => {
    renderWithProviders(<KitchenPage />);

    expect(await screen.findByText("5 of 5 orders")).toBeInTheDocument();
    expect(guests()).toEqual(["Mari K.", "Nino T.", "Mariam B.", "Giorgi M.", "Guest"]);
    expect(screen.getByRole("button", { name: "All · 5" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "New · 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cooking · 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ready · 1" })).toBeInTheDocument();
  });

  it("shows only the orders of the tab the cook chooses", async () => {
    const user = userEvent.setup();
    renderWithProviders(<KitchenPage />);
    await screen.findByText("5 of 5 orders");

    await user.click(screen.getByRole("button", { name: "Cooking · 2" }));

    expect(await screen.findByText("2 of 5 orders")).toBeInTheDocument();
    expect(guests()).toEqual(["Nino T.", "Guest"]);
    expect(screen.getByRole("button", { name: "Cooking · 2" })).toHaveAttribute("aria-pressed", "true");
  });

  it("finds a guest while the cook types", async () => {
    const user = userEvent.setup();
    renderWithProviders(<KitchenPage />);
    await screen.findByText("5 of 5 orders");

    await user.type(screen.getByRole("searchbox", { name: "Find a guest" }), "mari");

    expect(await screen.findByText("2 of 5 orders")).toBeInTheDocument();
    expect(guests()).toEqual(["Mari K.", "Mariam B."]);
  });

  it("says so when nobody matches", async () => {
    const user = userEvent.setup();
    renderWithProviders(<KitchenPage />);
    await screen.findByText("5 of 5 orders");

    await user.type(screen.getByRole("searchbox", { name: "Find a guest" }), "zzz");

    expect(await screen.findByText("No order matches.")).toBeInTheDocument();
  });

  it("says all quiet when there are no open orders", async () => {
    server.use(answerWith([]));
    renderWithProviders(<KitchenPage />);

    expect(await screen.findByText("All quiet — no open orders.")).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("moves the order to cooking when the cook presses 'Start cooking'", async () => {
    const user = userEvent.setup();
    // A kitchen that remembers: the first order is PENDING until somebody changes it
    let firstStatus = "PENDING";
    server.use(
      http.get(QUEUE_URL, () =>
        HttpResponse.json({
          serverTime: "2026-10-22T18:05:00Z",
          orders: queue.map((o) => (o.id === "q-1" ? { ...o, status: firstStatus } : o)),
        }),
      ),
      http.patch("/api/v1/enterprise/orders/:id/status", async ({ request }) => {
        firstStatus = ((await request.json()) as { status: string }).status;
        return HttpResponse.json({ ok: true });
      }),
    );
    renderWithProviders(<KitchenPage />);
    await screen.findByText("5 of 5 orders");
    const ticket = screen.getAllByRole("listitem")[0]; // Mari K., PENDING

    await user.click(within(ticket).getByRole("button", { name: "Start cooking" }));

    expect(await within(ticket).findByText("COOKING")).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "New · 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cooking · 3" })).toBeInTheDocument();
  });

  it("draws only the tickets near the window, so a Friday night of 800 orders stays light", async () => {
    server.use(answerWith(manyOrders(800)));
    renderWithProviders(<KitchenPage />);

    expect(await screen.findByText("800 of 800 orders")).toBeInTheDocument();

    const tickets = screen.getAllByRole("listitem");
    expect(tickets.length).toBeGreaterThan(5); // the window shows about seven...
    expect(tickets.length).toBeLessThan(25); // ...and a few more wait just outside it
    expect(tickets[0]).toHaveAttribute("aria-setsize", "800"); // a screen reader is told how many there are
    expect(tickets[0]).toHaveAttribute("aria-posinset", "1");
  });
});
