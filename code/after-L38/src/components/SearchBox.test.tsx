import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SearchBox } from "./SearchBox";

const box = () => screen.getByRole("searchbox", { name: "Search the menu" });

describe("SearchBox", () => {
  // The clock stands still until a test moves it. shouldAdvanceTime lets Testing Library's own small
  // waits finish (it cannot move a Vitest clock by itself); the tests move the big jumps by hand.
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  // user-event waits between keys with setTimeout: with a fake clock it must be told how to move it
  const setup = () => userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  it("shows every letter at once, and tells the page only after a pause", async () => {
    const user = setup();
    const onChange = vi.fn();
    render(<SearchBox value="" onChange={onChange} />);

    await user.type(box(), "soup");

    expect(box()).toHaveValue("soup"); // the box never waits
    expect(onChange).not.toHaveBeenCalled(); // the page has heard nothing yet

    act(() => void vi.advanceTimersByTime(400));

    expect(onChange).toHaveBeenCalledExactlyOnceWith("soup");
  });

  it("does not report the text it started with", () => {
    const onChange = vi.fn();
    render(<SearchBox value="soup" onChange={onChange} />);

    act(() => void vi.advanceTimersByTime(1000));

    expect(box()).toHaveValue("soup");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("follows the address when something else changes it, like the Back button", () => {
    const { rerender } = render(<SearchBox value="soup" onChange={vi.fn()} />);

    rerender(<SearchBox value="" onChange={vi.fn()} />);

    expect(box()).toHaveValue("");
  });

  it("does not overwrite newer typing when the address repeats an older pause", async () => {
    const user = setup();
    const { rerender } = render(<SearchBox value="" onChange={vi.fn()} />);
    await user.type(box(), "so");
    act(() => void vi.advanceTimersByTime(400)); // the page is told "so", and puts it in the address
    await user.type(box(), "u"); // the guest keeps typing before the address has caught up

    rerender(<SearchBox value="so" onChange={vi.fn()} />); // the address arrives with the older text

    expect(box()).toHaveValue("sou");
  });

  it("does not undo a change of address when the page hands it a new function", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = render(<SearchBox value="soup" onChange={first} />);

    // the Back button empties the address, and the page renders again with a new function
    rerender(<SearchBox value="" onChange={second} />);
    act(() => void vi.advanceTimersByTime(1000));

    expect(box()).toHaveValue("");
    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled(); // it did not say "soup" again, to the new function
  });
});
