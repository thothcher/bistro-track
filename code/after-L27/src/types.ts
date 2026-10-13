// One dish, with the same fields as the Le Bistro API (srmsapi.stepacademy.ge/swagger, DishResponse)
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
  slug: string;
  nameEn: string;
};
