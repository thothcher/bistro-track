import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { useAuthStore } from "@/auth/authStore";
import { renderWithProviders } from "@/test/render";
import type { Role } from "@/types";
import { UserMenu } from "./UserMenu";

function signInAs(role: Role) {
  useAuthStore.setState({
    session: { token: "t", user: { email: "mari@example.com", displayName: "Mari", role } },
  });
}

describe("UserMenu", () => {
  it("offers a guest a way in", () => {
    renderWithProviders(<UserMenu />);

    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
  });

  it("opens with the keyboard and closes with Escape, giving the focus back", async () => {
    const user = userEvent.setup();
    signInAs("student");
    renderWithProviders(<UserMenu />);

    await user.tab();
    const button = screen.getByRole("button", { name: /Mari/ });
    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "My account and orders" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it("shows the kitchen only to staff", async () => {
    const user = userEvent.setup();
    signInAs("kitchen");
    renderWithProviders(<UserMenu />);

    await user.click(screen.getByRole("button", { name: /Mari/ }));

    expect(await screen.findByRole("menuitem", { name: "The pass (kitchen)" })).toBeInTheDocument();
  });

  it("hides the kitchen from a student", async () => {
    const user = userEvent.setup();
    signInAs("student");
    renderWithProviders(<UserMenu />);

    await user.click(screen.getByRole("button", { name: /Mari/ }));

    await screen.findByRole("menu");
    expect(screen.queryByRole("menuitem", { name: "The pass (kitchen)" })).not.toBeInTheDocument();
  });

  it("signs out and goes to the home page", async () => {
    const user = userEvent.setup();
    signInAs("student");
    renderWithProviders(<UserMenu />, { route: "/account" });

    await user.click(screen.getByRole("button", { name: /Mari/ }));
    await user.click(await screen.findByRole("menuitem", { name: "Sign out" }));

    expect(useAuthStore.getState().session).toBeNull();
    expect(screen.getByTestId("location")).toHaveTextContent("/");
    expect(await screen.findByRole("link", { name: "Log in" })).toBeInTheDocument();
  });
});
