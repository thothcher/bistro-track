import { vi } from "vitest";

// jsdom has no layout engine: every element is 0 × 0 pixels. A virtualized list asks its scrolling box
// "how tall is your window?", hears 0, and draws no rows at all. This gives every element a size.
// Call it in beforeEach; setup.ts gives the real getters back after each test (vi.restoreAllMocks).
export function giveElementsASize({ width = 800, height = 600 } = {}) {
  vi.spyOn(Element.prototype, "clientWidth", "get").mockReturnValue(width);
  vi.spyOn(Element.prototype, "clientHeight", "get").mockReturnValue(height);
}
