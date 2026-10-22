import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/render";
import App from "./App";

describe("App", () => {
  it("shows a loading message while the code of a lazy page arrives, then the page", async () => {
    renderWithProviders(<App />, { route: "/faq" });

    expect(screen.getByRole("status")).toHaveTextContent("Loading the page…");

    expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.queryByText("Loading the page…")).not.toBeInTheDocument();
  });

  it("keeps the header while a lazy page is loading", async () => {
    renderWithProviders(<App />, { route: "/faq" });

    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument(); // the layout is not lazy
    await screen.findByRole("heading", { level: 1 });
  });

  it("says 'Not on the menu' for an address that does not exist (a lazy page too)", async () => {
    renderWithProviders(<App />, { route: "/no-such-page" });

    expect(await screen.findByRole("heading", { name: "Not on the menu" })).toBeInTheDocument();
  });
});
