import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cafeAuLait, coqAuVin, frenchOnionSoup } from "@/test/fixtures";
import { renderWithProviders } from "@/test/render";
import type { Dish } from "@/types";
import { DishGrid } from "./DishGrid";

// The API sent no price for this dish: formatPrice(null) throws while the card renders
const noPrice = { ...frenchOnionSoup, price: null } as unknown as Dish;

describe("DishGrid", () => {
  beforeEach(() => vi.spyOn(console, "error").mockImplementation(() => {})); // React reports the caught error

  it("shows every dish when the data is good", () => {
    renderWithProviders(<DishGrid dishes={[coqAuVin, frenchOnionSoup, cafeAuLait]} cardHeading="h2" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(3);
  });

  it("shows one grey card for a dish with broken data, and keeps all the others", () => {
    renderWithProviders(<DishGrid dishes={[coqAuVin, noPrice, cafeAuLait]} cardHeading="h2" />);

    expect(screen.getByRole("heading", { name: /Coq au vin/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Café au lait/ })).toBeInTheDocument();
    expect(screen.getByText("French onion soup can't be shown right now.")).toBeInTheDocument();
  });

  it("gives the dish another try when the API sends a better one", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [dishes, setDishes] = useState([noPrice]);
      return (
        <>
          <button type="button" onClick={() => setDishes([frenchOnionSoup])}>
            A new answer arrives
          </button>
          <DishGrid dishes={dishes} cardHeading="h2" />
        </>
      );
    }
    renderWithProviders(<Harness />);
    expect(screen.getByText(/can't be shown right now/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "A new answer arrives" }));

    expect(screen.getByRole("heading", { name: /French onion soup/ })).toBeInTheDocument();
  });
});
