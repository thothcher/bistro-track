import type { Category, Dish, Order } from "@/types";

// Small, fixed data for the tests. The real API has 40+ dishes and they change;
// a test needs the same three every time, or "it passed yesterday" means nothing.
export const coqAuVin: Dish = {
  id: 1,
  name: "Coq au vin",
  description: "Chicken braised in red wine with mushrooms.",
  price: 32,
  categorySlug: "mains",
  categoryName: "Mains",
  imageUrl: "/images/coq-au-vin.jpg",
  isAvailable: true,
};

export const frenchOnionSoup: Dish = {
  id: 2,
  name: "French onion soup",
  description: "Slow onions, beef broth, melted gruyère.",
  price: 14.5,
  categorySlug: "starters",
  categoryName: "Starters",
  imageUrl: "/images/onion-soup.jpg",
  isAvailable: true,
};

export const cafeAuLait: Dish = {
  id: 3,
  name: "Café au lait",
  description: "Strong coffee, hot milk.",
  price: 6,
  categorySlug: "drinks",
  categoryName: "Drinks",
  imageUrl: "/images/cafe-au-lait.jpg",
  isAvailable: false, // off the menu today
};

export const dishes: Dish[] = [coqAuVin, frenchOnionSoup, cafeAuLait];

// Five finished dinners, newest first. The API sends them three at a time.
export const orders: Order[] = [
  order("o-5", "DELIVERED", [[coqAuVin, 1], [frenchOnionSoup, 1], [cafeAuLait, 1]], "2026-10-20T19:10:00Z"),
  order("o-4", "DELIVERED", [[frenchOnionSoup, 2]], "2026-10-18T12:30:00Z"),
  order("o-3", "CANCELLED", [[coqAuVin, 1]], "2026-10-15T20:00:00Z"),
  order("o-2", "DELIVERED", [[coqAuVin, 2], [cafeAuLait, 2]], "2026-10-10T18:45:00Z"),
  order("o-1", "DELIVERED", [[frenchOnionSoup, 1]], "2026-10-02T13:05:00Z"),
];

function order(id: string, status: string, lines: [Dish, number][], createdAt: string): Order {
  const items = lines.map(([dish, quantity]) => ({
    dishId: dish.id,
    dishName: dish.name,
    unitPrice: dish.price,
    quantity,
    lineTotal: dish.price * quantity,
  }));
  return { id, status, createdAt, items, total: items.reduce((sum, i) => sum + i.lineTotal, 0) };
}

export const categories: Category[] = [
  { id: 1, slug: "starters", nameEn: "Starters", nameKa: "წინა კერძები", sortOrder: 1, dishCount: 1 },
  { id: 2, slug: "mains", nameEn: "Mains", nameKa: "მთავარი კერძები", sortOrder: 2, dishCount: 1 },
  { id: 3, slug: "drinks", nameEn: "Drinks", nameKa: "სასმელები", sortOrder: 3, dishCount: 1 },
];
