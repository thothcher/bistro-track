import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "@/auth/authStore";
import { renderWithProviders } from "@/test/render";
import type { Role } from "@/types";
import { RequireAuth } from "./RequireAuth";

function signInAs(role: Role) {
  useAuthStore.setState({
    session: { token: "t", user: { email: "mari@example.com", displayName: "Mari", role } },
  });
}

function renderAt(route: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<h1>Please sign in</h1>} />
      <Route path="/forbidden" element={<h1>Staff only</h1>} />
      <Route element={<RequireAuth />}>
        <Route path="/account" element={<h1>My account</h1>} />
      </Route>
      <Route element={<RequireAuth roles={["kitchen", "waiter"]} />}>
        <Route path="/kitchen" element={<h1>The kitchen queue</h1>} />
      </Route>
    </Routes>,
    { route },
  );
}

describe("RequireAuth", () => {
  beforeEach(() => useAuthStore.setState({ session: null }));

  it("sends a guest to the login page", () => {
    renderAt("/account");

    expect(screen.getByRole("heading", { name: "Please sign in" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "My account" })).not.toBeInTheDocument();
  });

  it("lets a signed-in guest in", () => {
    signInAs("student");
    renderAt("/account");

    expect(screen.getByRole("heading", { name: "My account" })).toBeInTheDocument();
  });

  it("keeps a guest out of the kitchen, even when signed in", () => {
    signInAs("student");
    renderAt("/kitchen");

    expect(screen.getByRole("heading", { name: "Staff only" })).toBeInTheDocument();
  });

  it.each<Role>(["kitchen", "waiter"])("lets %s into the kitchen", (role) => {
    signInAs(role);
    renderAt("/kitchen");

    expect(screen.getByRole("heading", { name: "The kitchen queue" })).toBeInTheDocument();
  });
});
