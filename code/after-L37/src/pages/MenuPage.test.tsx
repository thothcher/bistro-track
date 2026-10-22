import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { useCartStore } from "@/cart/cartStore";
import { dishes } from "@/test/fixtures";
import { renderWithProviders } from "@/test/render";
import { server } from "@/test/server";
import { MenuPage } from "./MenuPage";

function renderMenu(route = "/menu") {
  return renderWithProviders(
    <Routes>
      <Route path="/menu" element={<MenuPage />} />
    </Routes>,
    { route },
  );
}

// The names of the dishes on the screen: each card has an <h2> with the dish's name
const dishNames = () =>
  screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent?.replace(/₾.*$/, ""));

describe("MenuPage", () => {
  it("shows grey cards while loading, then the dishes", async () => {
    renderMenu();

    expect(screen.getByLabelText("Loading dishes")).toBeInTheDocument(); // the first thing a guest sees

    expect(await screen.findByRole("heading", { name: /Coq au vin/ })).toBeInTheDocument();
    expect(screen.queryByLabelText("Loading dishes")).not.toBeInTheDocument();
    expect(dishNames()).toEqual(["Coq au vin", "French onion soup", "Café au lait"]);
  });

  it("shows a price next to every dish", async () => {
    renderMenu();

    const soup = (await screen.findByRole("heading", { name: /French onion soup/ })).closest("article")!;

    expect(within(soup).getByText("₾14.50")).toBeInTheDocument();
  });

  it("filters by category and puts the category in the address", async () => {
    const user = userEvent.setup();
    renderMenu();
    await screen.findByRole("heading", { name: /Coq au vin/ });

    await user.click(await screen.findByRole("button", { name: "Drinks" }));

    expect(await screen.findByRole("heading", { name: /Café au lait/ })).toBeInTheDocument();
    await screen.findByRole("button", { name: "Drinks", pressed: true });
    expect(dishNames()).toEqual(["Café au lait"]);
    expect(screen.getByTestId("location")).toHaveTextContent("/menu?category=drinks");
  });

  it("opens a shared link with the filter already on", async () => {
    renderMenu("/menu?category=mains");

    expect(await screen.findByRole("heading", { name: /Coq au vin/ })).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Mains", pressed: true })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /French onion soup/ })).not.toBeInTheDocument();
  });

  it("searches after the guest stops typing", async () => {
    const user = userEvent.setup();
    renderMenu();
    await screen.findByRole("heading", { name: /Coq au vin/ });

    await user.type(screen.getByRole("searchbox", { name: "Search the menu" }), "soup");

    expect(await screen.findByText(/Results for “soup”/, {}, { timeout: 2000 })).toBeInTheDocument();
    expect(screen.getByText("· 1 found")).toBeInTheDocument();
    expect(dishNames()).toEqual(["French onion soup"]);
    expect(screen.getByTestId("location")).toHaveTextContent("/menu?q=soup");
  });

  it("says so when nothing matches", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.type(screen.getByRole("searchbox", { name: "Search the menu" }), "pizza");

    expect(
      await screen.findByText("Nothing on the menu matches “pizza”.", {}, { timeout: 2000 }),
    ).toBeInTheDocument();
  });

  it('jumps into the search box when "/" is pressed', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.keyboard("/");

    expect(screen.getByRole("searchbox", { name: "Search the menu" })).toHaveFocus();
  });

  it("turns 'Add to cart' into a stepper and updates the cart", async () => {
    const user = userEvent.setup();
    renderMenu();
    const card = (await screen.findByRole("heading", { name: /Coq au vin/ })).closest("article")!;

    await user.click(within(card).getByRole("button", { name: "Add to cart" }));
    await user.click(within(card).getByRole("button", { name: "One more" }));

    expect(within(card).getByRole("status")).toHaveTextContent("2");
    expect(useCartStore.getState().items).toEqual([
      expect.objectContaining({ qty: 2, dish: expect.objectContaining({ name: "Coq au vin" }) }),
    ]);
  });

  it("does not let a guest order a dish that is off the menu", async () => {
    renderMenu();
    const card = (await screen.findByRole("heading", { name: /Café au lait/ })).closest("article")!;

    expect(within(card).getByText("Off the menu today")).toBeInTheDocument();
    expect(within(card).getByRole("button", { name: "Add to cart" })).toBeDisabled();
  });

  describe("when the API misbehaves", () => {
    it("offers a retry after a server error, and the retry works", async () => {
      const user = userEvent.setup();
      server.use(
        // { once: true }: this answer is used for the first request only
        http.get("/api/v1/enterprise/dishes", () => new HttpResponse(null, { status: 500 }), {
          once: true,
        }),
      );
      renderMenu();

      expect(await screen.findByText(/We couldn't load the menu/)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Try again" }));

      expect(await screen.findByRole("heading", { name: /Coq au vin/ })).toBeInTheDocument();
      expect(screen.queryByText(/We couldn't load the menu/)).not.toBeInTheDocument();
    });

    it("shows grey cards for as long as a slow kitchen takes, then the dishes", async () => {
      server.use(
        http.get("/api/v1/enterprise/dishes", async () => {
          await delay(1500); // a kitchen that needs a moment (the real main courses need 3 seconds)
          return HttpResponse.json(dishes);
        }),
      );
      renderMenu();

      expect(screen.getByLabelText("Loading dishes")).toBeInTheDocument();

      // 1.5 seconds: more than findBy's default second, less than the 5 seconds that setup.ts allows
      expect(await screen.findByRole("heading", { name: /Coq au vin/ })).toBeInTheDocument();
      expect(screen.queryByLabelText("Loading dishes")).not.toBeInTheDocument();
    });

    it("gives the same message when the network is down", async () => {
      server.use(http.get("/api/v1/enterprise/dishes", () => HttpResponse.error()));
      renderMenu();

      expect(await screen.findByText(/We couldn't load the menu/)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    });

    it("tells the guest how long to wait when the search is rate-limited", async () => {
      const user = userEvent.setup();
      server.use(
        http.get(
          "/api/v1/enterprise/search",
          () => new HttpResponse(null, { status: 429, headers: { "Retry-After": "60" } }),
        ),
      );
      renderMenu();

      await user.type(screen.getByRole("searchbox", { name: "Search the menu" }), "soup");

      expect(
        await screen.findByText("One moment — you can search again in 60 s.", {}, { timeout: 2000 }),
      ).toBeInTheDocument();
    });
  });
});
