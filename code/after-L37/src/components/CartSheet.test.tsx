import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { useAuthStore } from "@/auth/authStore";
import { useCartStore } from "@/cart/cartStore";
import { Toaster } from "@/components/ui/sonner";
import { coqAuVin, frenchOnionSoup } from "@/test/fixtures";
import { renderWithProviders } from "@/test/render";
import { server } from "@/test/server";
import { CartSheet } from "./CartSheet";

function renderCart() {
  return renderWithProviders(
    <>
      <CartSheet />
      <Toaster />
    </>,
  );
}

function fillCart() {
  const { add } = useCartStore.getState();
  add(coqAuVin); // ₾32
  add(frenchOnionSoup); // ₾14.50
  add(frenchOnionSoup);
}

function signIn() {
  useAuthStore.setState({
    session: {
      token: "token-123",
      user: { email: "mari@example.com", displayName: "Mari", role: "student" },
    },
  });
}

// Opens the sheet and returns the dialog, the way a guest would do it
async function openCart(user: ReturnType<typeof userEvent.setup>, count = 3) {
  await user.click(screen.getByRole("button", { name: `Your order · ${count}` }));
  return screen.findByRole("dialog", { name: "Your order" });
}

describe("CartSheet", () => {
  it("counts the dishes on its button", () => {
    fillCart();
    renderCart();

    expect(screen.getByRole("button", { name: "Your order · 3" })).toBeInTheDocument();
  });

  it("opens as a dialog that lists the order and the total", async () => {
    const user = userEvent.setup();
    fillCart();
    renderCart();

    const dialog = await openCart(user);

    expect(within(dialog).getByText("Coq au vin")).toBeInTheDocument();
    expect(within(dialog).getByText("French onion soup")).toBeInTheDocument();
    expect(within(dialog).getByText("₾61")).toBeInTheDocument(); // 32 + 2 × 14.50
  });

  // The four checks of lecture L36, which took ten minutes by hand and now take a second.
  describe("for a guest who uses the keyboard", () => {
    it("moves the focus into the cart when it opens", async () => {
      const user = userEvent.setup();
      fillCart();
      renderCart();

      const dialog = await openCart(user);

      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    });

    it("keeps Tab inside the cart, however often it is pressed", async () => {
      const user = userEvent.setup();
      fillCart();
      renderCart();
      const dialog = await openCart(user);

      for (let press = 0; press < 12; press++) {
        await user.tab();
        expect(dialog).toContainElement(document.activeElement as HTMLElement); // never out in the page behind
      }
    });

    it("closes on Escape", async () => {
      const user = userEvent.setup();
      fillCart();
      renderCart();
      await openCart(user);

      await user.keyboard("{Escape}");

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("gives the focus back to the button that opened it", async () => {
      const user = userEvent.setup();
      fillCart();
      renderCart();
      const trigger = screen.getByRole("button", { name: "Your order · 3" });
      await openCart(user);
      await user.tab(); // the guest moves around inside the cart first: without this the test could pass by accident

      await user.keyboard("{Escape}");

      expect(trigger).toHaveFocus();
    });
  });

  it("says the menu is waiting when the order is empty", async () => {
    const user = userEvent.setup();
    renderCart();

    await openCart(user, 0);

    expect(screen.getByText("Nothing here yet — the menu is waiting.")).toBeInTheDocument();
  });

  it("changes a quantity and updates the total", async () => {
    const user = userEvent.setup();
    fillCart();
    renderCart();
    const dialog = await openCart(user);
    const soupLine = within(dialog).getByText("French onion soup").closest("li")!;

    await user.click(within(soupLine).getByRole("button", { name: "One less" }));

    expect(within(soupLine).getByRole("status")).toHaveTextContent("1");
    expect(within(dialog).getByText("₾46.50")).toBeInTheDocument(); // 32 + 14.50
  });

  it("removes a line", async () => {
    const user = userEvent.setup();
    fillCart();
    renderCart();
    const dialog = await openCart(user);

    await user.click(within(dialog).getByRole("button", { name: "Remove Coq au vin" }));

    expect(within(dialog).queryByText("Coq au vin")).not.toBeInTheDocument();
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  describe("emptying the order", () => {
    it("asks first, and 'Keep it' keeps everything", async () => {
      const user = userEvent.setup();
      fillCart();
      renderCart();
      const dialog = await openCart(user);

      await user.click(within(dialog).getByRole("button", { name: "Empty the order" }));
      const question = await screen.findByRole("alertdialog", { name: "Empty the order?" });
      await user.click(within(question).getByRole("button", { name: "Keep it" }));

      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
      expect(useCartStore.getState().items).toHaveLength(2);
    });

    it("'Empty it' empties it", async () => {
      const user = userEvent.setup();
      fillCart();
      renderCart();
      const dialog = await openCart(user);

      await user.click(within(dialog).getByRole("button", { name: "Empty the order" }));
      await user.click(await screen.findByRole("button", { name: "Empty it" }));

      expect(await screen.findByText("Nothing here yet — the menu is waiting.")).toBeInTheDocument();
      expect(useCartStore.getState().items).toEqual([]);
    });
  });

  describe("sending the order", () => {
    it("sends a guest to the login page instead of the kitchen", async () => {
      const user = userEvent.setup();
      fillCart();
      renderCart();
      const dialog = await openCart(user);

      expect(within(dialog).queryByRole("button", { name: "Send to the kitchen" })).not.toBeInTheDocument();
      await user.click(within(dialog).getByRole("link", { name: "Sign in to send your order" }));

      expect(screen.getByTestId("location")).toHaveTextContent("/login");
    });

    it("sends the order in the right sequence, then empties the cart and says thanks", async () => {
      const user = userEvent.setup();
      const calls: string[] = [];
      server.use(
        http.delete("/api/v1/learning/cart", () => {
          calls.push("DELETE cart");
          return HttpResponse.json({ items: [], totalItems: 0, totalPrice: 0 });
        }),
        http.post("/api/v1/learning/cart", async ({ request }) => {
          const { dishId, quantity } = (await request.json()) as { dishId: number; quantity: number };
          calls.push(`POST cart dish ${dishId} × ${quantity}`);
          return HttpResponse.json({ items: [], totalItems: 0, totalPrice: 0 });
        }),
        http.post("/api/v1/enterprise/orders", async ({ request }) => {
          calls.push(`POST order with ${request.headers.get("Authorization")}`);
          return HttpResponse.json({ id: "o-1", status: "PENDING", total: 61, createdAt: "", items: [] });
        }),
      );
      signIn();
      fillCart();
      renderCart();
      const dialog = await openCart(user);

      await user.click(within(dialog).getByRole("button", { name: "Send to the kitchen" }));

      expect(await screen.findByText("Your order is with the kitchen.")).toBeInTheDocument();
      expect(calls).toEqual([
        "DELETE cart",
        "POST cart dish 1 × 1",
        "POST cart dish 2 × 2",
        "POST order with Bearer token-123",
      ]);
      expect(useCartStore.getState().items).toEqual([]);
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("keeps the order and tells the guest when the kitchen is down", async () => {
      const user = userEvent.setup();
      server.use(
        http.post("/api/v1/enterprise/orders", () => new HttpResponse(null, { status: 503 })),
      );
      signIn();
      fillCart();
      renderCart();
      const dialog = await openCart(user);

      await user.click(within(dialog).getByRole("button", { name: "Send to the kitchen" }));

      expect(await screen.findByText("Request failed (HTTP 503)")).toBeInTheDocument();
      expect(useCartStore.getState().items).toHaveLength(2); // nothing was lost
      expect(within(dialog).getByRole("button", { name: "Send to the kitchen" })).toBeEnabled(); // they can try again
    });
  });
});
