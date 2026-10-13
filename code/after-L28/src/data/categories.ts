import type { Category } from "../types";

// The five categories of the real menu (GET /api/v1/enterprise/categories)
export const categories: Category[] = [
  { slug: "starters", nameEn: "Starters" },
  { slug: "main-courses", nameEn: "Main Courses" },
  { slug: "pastries", nameEn: "Bakery & Pastries" },
  { slug: "desserts", nameEn: "Desserts" },
  { slug: "drinks", nameEn: "Drinks" },
];
