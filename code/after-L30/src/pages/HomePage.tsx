import { Favourites } from "../components/Favourites";
import { Hero } from "../components/Hero";
import type { CartItem, Dish } from "../types";

type HomePageProps = {
  cart: CartItem[];
  onAdd: (dish: Dish) => void;
  onChangeQty: (dishId: number, delta: number) => void;
};

export function HomePage({ cart, onAdd, onChangeQty }: HomePageProps) {
  return (
    <>
      <Hero />
      <Favourites cart={cart} onAdd={onAdd} onChangeQty={onChangeQty} />
    </>
  );
}
