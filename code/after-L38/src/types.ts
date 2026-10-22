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

// POST /api/v1/auth/login. The access token expires after 2 minutes (a deliberate trap).
export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

// GET /api/v1/auth/me and GET /api/v1/profile
export type UserProfile = {
  id: string;
  email: string | null;
  displayName: string | null;
  role: string | null;
  preferredLanguage: string | null;
  createdAt: string;
};

export type Role = "admin" | "waiter" | "kitchen" | "student";

// What the app remembers about the signed-in user
export type Session = {
  token: string;
  user: { email: string; displayName: string | null; role: Role };
};

// GET /api/v1/enterprise/orders/queue (staff only)
export type QueueOrder = {
  id: string;
  status: string | null;
  customerName: string | null;
  itemCount: number;
  total: number;
  createdAt: string;
  slaDeadline: string;
  assignedWaiter: string | null;
};

export type OrderQueue = {
  serverTime: string;
  orders: QueueOrder[] | null;
};

// What the API sends for a page of results: GET /api/v1/profile/orders?page=1&size=3
export type Paged<T> = {
  items: T[];
  totalCount: number;
  hasNext: boolean;
  page: number;
  size: number;
};

// A placed order, as the kitchen's workflow knows it: PENDING → COOKING → READY → DELIVERED
export type OrderStatus = "PENDING" | "COOKING" | "READY" | "DELIVERED" | "CANCELLED";

export type OrderItem = {
  dishId: number;
  dishName: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  status: string | null;
  total: number;
  createdAt: string;
  items: OrderItem[] | null;
};
