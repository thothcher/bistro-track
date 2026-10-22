import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { useAuthStore } from "@/auth/authStore";
import { renderWithProviders } from "@/test/render";
import { server } from "@/test/server";
import { LoginPage } from "./LoginPage";

// The login page navigates when it works, so it needs routes to navigate between.
function renderLogin(route: string | { pathname: string; state?: unknown } = "/login") {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/menu" element={<h1>The menu</h1>} />
    </Routes>,
    { route },
  );
}

describe("LoginPage", () => {
  it("asks for the email and the password", () => {
    renderLogin();

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument(); // the password input has no role: find it by its label
    expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled();
  });

  it("explains what is missing, field by field, and sends nothing", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    const messages = await screen.findAllByRole("alert");
    expect(messages.map((m) => m.textContent)).toEqual([
      "Enter your email address",
      "Enter your password",
    ]);
    expect(screen.getByLabelText("Email")).toBeInvalid();
    expect(useAuthStore.getState().session).toBeNull();
  });

  it("rejects an email that is not an email", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Email"), "mari@");
    await user.type(screen.getByLabelText("Password"), "whatever");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Enter your email address");
  });

  it("signs in, remembers the session and goes home", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Email"), "mari@example.com");
    await user.type(screen.getByLabelText("Password"), "correct-horse-1");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("heading", { name: "Home" })).toBeInTheDocument();
    expect(useAuthStore.getState().session).toEqual({
      token: "token-123",
      user: { email: "mari@example.com", displayName: "Mari", role: "waiter" },
    });
  });

  it("goes back to the page the guest wanted", async () => {
    const user = userEvent.setup();
    renderLogin({ pathname: "/login", state: { from: "/menu" } }); // what RequireAuth sends

    await user.type(screen.getByLabelText("Email"), "mari@example.com");
    await user.type(screen.getByLabelText("Password"), "correct-horse-1");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("heading", { name: "The menu" })).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/menu");
  });

  it("says so when the password is wrong, and stays on the page", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText("Email"), "mari@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "That email and password don't match. Try again.",
    );
    expect(screen.getByTestId("location")).toHaveTextContent("/login");
    expect(useAuthStore.getState().session).toBeNull();
  });

  it("disables the button while it is signing in", async () => {
    const user = userEvent.setup();
    // The kitchen answers when the TEST says so, not after a sleep: a sleep is a race, and it loses on a slow machine.
    let letTheKitchenAnswer = () => {};
    const gate = new Promise<void>((resolve) => (letTheKitchenAnswer = resolve));
    server.use(
      http.post("/api/v1/auth/login", async () => {
        await gate;
        return HttpResponse.json({ accessToken: "t", refreshToken: "r", expiresIn: 120 });
      }),
    );
    renderLogin();

    await user.type(screen.getByLabelText("Email"), "mari@example.com");
    await user.type(screen.getByLabelText("Password"), "correct-horse-1");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("button", { name: "Signing in…" })).toBeDisabled();

    letTheKitchenAnswer();
    expect(await screen.findByRole("heading", { name: "Home" })).toBeInTheDocument();
  });
});
