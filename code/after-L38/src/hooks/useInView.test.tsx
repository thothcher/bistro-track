import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { fakeIntersectionObserver } from "@/test/intersection";
import { useInView } from "./useInView";

// A hook needs a place to live. This tiny component is that place.
function EndOfList({ onEnter, enabled }: { onEnter: () => void; enabled?: boolean }) {
  const ref = useInView<HTMLDivElement>(onEnter, enabled);
  return <div ref={ref}>end of the list</div>;
}

describe("useInView", () => {
  it("calls onEnter when the element scrolls into view", () => {
    const io = fakeIntersectionObserver();
    const onEnter = vi.fn();
    render(<EndOfList onEnter={onEnter} />);

    expect(onEnter).not.toHaveBeenCalled(); // not yet: it is below the fold
    act(() => io.scrollIntoView());

    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(io.watchers[0].target).toBe(screen.getByText("end of the list"));
  });

  it("does not watch anything while it is disabled", () => {
    const io = fakeIntersectionObserver();
    render(<EndOfList onEnter={vi.fn()} enabled={false} />);

    expect(io.watchers).toHaveLength(0);
  });

  it("stops watching when the component goes away", () => {
    const io = fakeIntersectionObserver();
    const { unmount } = render(<EndOfList onEnter={vi.fn()} />);

    unmount();

    expect(io.watchers.every((w) => w.disconnected)).toBe(true); // the cleanup ran
  });
});
