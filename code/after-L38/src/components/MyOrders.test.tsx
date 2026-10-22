import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "@/auth/authStore";
import { orders } from "@/test/fixtures";
import { fakeIntersectionObserver } from "@/test/intersection";
import { renderWithProviders } from "@/test/render";
import { server } from "@/test/server";
import { MyOrders } from "./MyOrders";

// The API sends three orders at a time: page 1 has three, page 2 has the last two.
function ordersApi() {
  return http.get("/api/v1/profile/orders", ({ request }) => {
    const page = Number(new URL(request.url).searchParams.get("page") ?? 1);
    const items = orders.slice((page - 1) * 3, page * 3);
    return HttpResponse.json({
      items,
      totalCount: orders.length,
      hasNext: page * 3 < orders.length,
      page,
      size: 3,
    });
  });
}

describe("MyOrders", () => {
  let io: ReturnType<typeof fakeIntersectionObserver>;

  beforeEach(() => {
    io = fakeIntersectionObserver(); // MyOrders watches its last line; jsdom cannot, so we fake it
    useAuthStore.setState({
      session: { token: "t", user: { email: "mari@example.com", displayName: "Mari", role: "student" } },
    });
  });

  it("lists the first three orders, then the rest on demand", async () => {
    const user = userEvent.setup();
    server.use(ordersApi());
    renderWithProviders(<MyOrders />);

    const list = await screen.findByRole("list");
    expect(await within(list).findAllByRole("listitem")).toHaveLength(3);

    await user.click(screen.getByRole("button", { name: "Show more orders" }));

    await within(list).findByText("₾14.50"); // the fifth order's total: the new page has arrived
    expect(within(list).getAllByRole("listitem")).toHaveLength(5);
    expect(screen.queryByRole("button", { name: "Show more orders" })).not.toBeInTheDocument();
  });

  it("loads the next page by itself when the end of the list scrolls into view", async () => {
    server.use(ordersApi());
    renderWithProviders(<MyOrders />);
    const list = await screen.findByRole("list");
    await within(list).findAllByRole("listitem");

    act(() => io.scrollIntoView());

    await within(list).findByText("₾14.50");
    expect(within(list).getAllByRole("listitem")).toHaveLength(5);
  });

  it("shows the status and the total of each order", async () => {
    server.use(ordersApi());
    renderWithProviders(<MyOrders />);

    const first = (await screen.findAllByRole("listitem"))[0];

    expect(first).toHaveTextContent("DELIVERED");
    expect(first).toHaveTextContent("₾52.50");
    expect(first).toHaveTextContent("3 items");
  });

  it("says the menu is waiting when there are no orders", async () => {
    server.use(
      http.get("/api/v1/profile/orders", () =>
        HttpResponse.json({ items: [], totalCount: 0, hasNext: false, page: 1, size: 3 }),
      ),
    );
    renderWithProviders(<MyOrders />);

    expect(await screen.findByText("No orders yet — the menu is waiting.")).toBeInTheDocument();
  });

  it("says so when the orders cannot be loaded", async () => {
    server.use(http.get("/api/v1/profile/orders", () => new HttpResponse(null, { status: 500 })));
    renderWithProviders(<MyOrders />);

    expect(await screen.findByText("We couldn't load your orders.")).toBeInTheDocument();
  });
});
