// Shapes from the Le Bistro API (srmsapi.stepacademy.ge/swagger)
export type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  categorySlug: string;
  categoryName: string;
  imageUrl: string;
  isAvailable: boolean;
};

export type Category = {
  id: number;
  slug: string;
  nameEn: string;
  nameKa: string;
  sortOrder: number;
  dishCount: number;
};

// GET /api/v1/enterprise/search?q=...
export type SearchResponse = {
  query: string;
  count: number;
  items: Dish[];
};

// One line of the order: which dish, how many
export type CartItem = {
  dish: Dish;
  qty: number;
};
