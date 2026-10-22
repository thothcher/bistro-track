import { afterEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";

// The setup file promises that no test can reach the real internet by accident. Prove it.
describe("the safety net", () => {
  afterEach(() => vi.restoreAllMocks());

  it("fails a request nobody planned for, and names it", async () => {
    // MSW reports through console.error; we listen, so the report does not clutter the test output
    const report = vi.spyOn(console, "error").mockImplementation(() => {});

    const error = await api("/api/v1/nobody-planned-this").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(TypeError); // fetch failed: the request never left the machine
    expect(String(report.mock.calls[0]?.[0])).toContain("GET /api/v1/nobody-planned-this");
  });
});
