import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MAX_QTY } from "@/cart/cartReducer";
import { QuantityStepper } from "./QuantityStepper";

describe("QuantityStepper", () => {
  it("shows the quantity", () => {
    render(<QuantityStepper qty={3} onDecrease={vi.fn()} onIncrease={vi.fn()} />);

    expect(screen.getByRole("status")).toHaveTextContent("3"); // <output> has the role "status"
  });

  it("tells its parent which button was pressed", async () => {
    const user = userEvent.setup();
    const onDecrease = vi.fn(); // a spy: remembers every call
    const onIncrease = vi.fn();
    render(<QuantityStepper qty={2} onDecrease={onDecrease} onIncrease={onIncrease} />);

    await user.click(screen.getByRole("button", { name: "One more" }));
    await user.click(screen.getByRole("button", { name: "One more" }));
    await user.click(screen.getByRole("button", { name: "One less" }));

    expect(onIncrease).toHaveBeenCalledTimes(2);
    expect(onDecrease).toHaveBeenCalledTimes(1);
  });

  it("cannot go above the maximum", async () => {
    const user = userEvent.setup();
    const onIncrease = vi.fn();
    render(<QuantityStepper qty={MAX_QTY} onDecrease={vi.fn()} onIncrease={onIncrease} />);

    const more = screen.getByRole("button", { name: "One more" });
    expect(more).toBeDisabled();

    await user.click(more); // a real user can try; nothing happens
    expect(onIncrease).not.toHaveBeenCalled();
  });

  it("works from the keyboard", async () => {
    const user = userEvent.setup();
    const onIncrease = vi.fn();
    render(<QuantityStepper qty={1} onDecrease={vi.fn()} onIncrease={onIncrease} />);

    await user.tab(); // "One less"
    await user.tab(); // "One more"
    await user.keyboard("{Enter}");

    expect(onIncrease).toHaveBeenCalledTimes(1);
  });
});
