import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Link, MemoryRouter, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PageBoundary } from "./PageBoundary";

// A page that breaks on purpose, the way a real one breaks: while it renders
function Bomb({ explode }: { explode: boolean }) {
  if (explode) throw new Error("boom");
  return <p>The page is fine</p>;
}

describe("PageBoundary", () => {
  // React and the boundary both report a caught error in the console; the tests do not need to read it
  beforeEach(() => vi.spyOn(console, "error").mockImplementation(() => {}));

  it("shows a message instead of a blank page when the page crashes, and keeps the rest of the site", () => {
    render(
      <MemoryRouter>
        <header>The header</header>
        <PageBoundary>
          <Bomb explode />
        </PageBoundary>
      </MemoryRouter>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Something burnt in the kitchen");
    expect(screen.getByText("The header")).toBeInTheDocument();
    expect(screen.queryByText("The page is fine")).not.toBeInTheDocument();
  });

  it("tells the console what broke, so that somebody can find out", () => {
    render(
      <MemoryRouter>
        <PageBoundary>
          <Bomb explode />
        </PageBoundary>
      </MemoryRouter>,
    );

    expect(console.error).toHaveBeenCalledWith("A page crashed:", expect.objectContaining({ message: "boom" }), expect.any(String));
  });

  it("tries the page again when the guest presses 'Try again'", async () => {
    const user = userEvent.setup();
    function Fixable() {
      const [broken, setBroken] = useState(true);
      return (
        <>
          <button type="button" onClick={() => setBroken(false)}>
            Fix it
          </button>
          <PageBoundary>
            <Bomb explode={broken} />
          </PageBoundary>
        </>
      );
    }
    render(
      <MemoryRouter>
        <Fixable />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Fix it" })); // the cause is gone
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(screen.getByText("The page is fine")).toBeInTheDocument();
  });

  it("clears the message when the guest goes to another page", async () => {
    const user = userEvent.setup();
    // the page that breaks only at the address /broken
    function Page() {
      return <Bomb explode={useLocation().pathname === "/broken"} />;
    }
    render(
      <MemoryRouter initialEntries={["/broken"]}>
        <Link to="/fine">Go to the fine page</Link>
        <PageBoundary>
          <Page />
        </PageBoundary>
      </MemoryRouter>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Go to the fine page" }));

    expect(screen.getByText("The page is fine")).toBeInTheDocument();
  });
});
