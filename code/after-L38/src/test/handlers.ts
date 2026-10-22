import { http, HttpResponse } from "msw";
import { categories, dishes, queue } from "./fixtures";

// The "happy" version of the Le Bistro API. Every test starts from this;
// a test that needs a failure overrides one route with server.use(...).
export const handlers = [
  http.get("/api/v1/enterprise/categories", () => HttpResponse.json(categories)),

  http.get("/api/v1/enterprise/dishes", ({ request }) => {
    const category = new URL(request.url).searchParams.get("category");
    return HttpResponse.json(
      category ? dishes.filter((d) => d.categorySlug === category) : dishes,
    );
  }),

  http.get("/api/v1/enterprise/search", ({ request }) => {
    const q = new URL(request.url).searchParams.get("q") ?? "";
    const items = dishes.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()));
    return HttpResponse.json({ query: q, count: items.length, items });
  }),

  http.post("/api/v1/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };
    if (email === "mari@example.com" && password === "correct-horse-1") {
      return HttpResponse.json({ accessToken: "token-123", refreshToken: "r-456", expiresIn: 120 });
    }
    return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }),

  http.get("/api/v1/auth/me", () =>
    HttpResponse.json({
      id: "u1",
      email: "mari@example.com",
      displayName: "Mari",
      role: "Waiter",
      preferredLanguage: "en",
      createdAt: "2026-10-01T10:00:00Z",
    }),
  ),

  // The API answers every cart call with the cart (see its /swagger page): items, totalItems, totalPrice
  http.delete("/api/v1/learning/cart", () =>
    HttpResponse.json({ items: [], totalItems: 0, totalPrice: 0 }),
  ),
  http.post("/api/v1/learning/cart", () =>
    HttpResponse.json({ items: [], totalItems: 0, totalPrice: 0 }),
  ),
  // The kitchen's queue (staff only) and the button that moves an order along
  http.get("/api/v1/enterprise/orders/queue", () =>
    HttpResponse.json({ serverTime: "2026-10-22T18:05:00Z", orders: queue }),
  ),
  http.patch("/api/v1/enterprise/orders/:id/status", () => HttpResponse.json({ ok: true })),
  http.post("/api/v1/enterprise/orders", () =>
    HttpResponse.json({
      id: "o-1",
      status: "PENDING",
      total: 46.5,
      createdAt: "2026-10-22T12:00:00Z",
      items: [],
    }),
  ),
];
