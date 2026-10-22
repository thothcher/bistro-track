import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { useAuthStore } from "@/auth/authStore";
import { server } from "@/test/server";
import { api, ApiError } from "./api";

// MSW sits where the network would be, so api() runs for real: headers, status codes, JSON.
describe("api()", () => {
  it("returns the JSON of a successful answer", async () => {
    server.use(http.get("/api/v1/hello", () => HttpResponse.json({ greeting: "bonjour" })));

    await expect(api<{ greeting: string }>("/api/v1/hello")).resolves.toEqual({ greeting: "bonjour" });
  });

  it("sends the token as a Bearer header, and a JSON body with its content type", async () => {
    let seen: { auth: string | null; type: string | null; body: unknown } | undefined;
    server.use(
      http.post("/api/v1/echo", async ({ request }) => {
        seen = {
          auth: request.headers.get("Authorization"),
          type: request.headers.get("Content-Type"),
          body: await request.json(),
        };
        return HttpResponse.json({});
      }),
    );

    await api("/api/v1/echo", { method: "POST", body: JSON.stringify({ dishId: 1 }) }, "abc");

    expect(seen).toEqual({ auth: "Bearer abc", type: "application/json", body: { dishId: 1 } });
  });

  it("explains a 400 with the sentence the API sent", async () => {
    server.use(
      http.post("/api/v1/auth/register", () =>
        HttpResponse.json({ message: "Email is already taken." }, { status: 409 }),
      ),
    );

    await expect(api("/api/v1/auth/register", { method: "POST" })).rejects.toMatchObject({
      status: 409,
      message: "Email is already taken.",
    });
  });

  it("keeps a server error generic: the guest does not need the details", async () => {
    server.use(http.get("/api/v1/boom", () => HttpResponse.json({ message: "stack trace…" }, { status: 500 })));

    const error = await api("/api/v1/boom").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 500, message: "Request failed (HTTP 500)" });
  });

  it("remembers how long to wait after 429 Too Many Requests", async () => {
    server.use(
      http.get(
        "/api/v1/slow-down",
        () => new HttpResponse(null, { status: 429, headers: { "Retry-After": "42" } }),
      ),
    );

    await expect(api("/api/v1/slow-down")).rejects.toMatchObject({ status: 429, retryAfter: 42 });
  });

  it("signs the guest out when the 2-minute token has expired", async () => {
    useAuthStore.setState({
      session: { token: "old", user: { email: "a@b.co", displayName: null, role: "student" } },
    });
    server.use(
      http.get(
        "/api/v1/profile",
        () => new HttpResponse(null, { status: 401, headers: { "X-Token-Expired": "true" } }),
      ),
    );

    await expect(api("/api/v1/profile", {}, "old")).rejects.toThrow(
      "Your session has ended — please sign in again.",
    );
    expect(useAuthStore.getState().session).toBeNull();
  });

  it("does NOT sign the guest out for an ordinary 401", async () => {
    useAuthStore.setState({
      session: { token: "t", user: { email: "a@b.co", displayName: null, role: "student" } },
    });
    server.use(http.get("/api/v1/profile", () => new HttpResponse(null, { status: 401 })));

    await expect(api("/api/v1/profile", {}, "t")).rejects.toMatchObject({ status: 401 });
    expect(useAuthStore.getState().session).not.toBeNull();
  });
});
