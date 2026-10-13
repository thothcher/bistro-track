import { useState } from "react";
import { DishGrid } from "./components/DishGrid";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { MenuSection } from "./components/MenuSection";
import { Section } from "./components/Section";
import { dishes } from "./data/dishes";
import type { CartItem, Dish } from "./types";

const favouriteIds = [5, 15, 21];

export default function App() {
  // The cart lives here: App is the closest common parent of the Header and every DishCard.
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(dish: Dish) {
    setCart((current) => [...current, { dish, qty: 1 }]);
  }

  function changeQty(dishId: number, delta: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.dish.id === dishId ? { ...item, qty: item.qty + delta } : item,
        )
        .filter((item) => item.qty > 0),
    );
  }

  function removeFromCart(dishId: number) {
    setCart((current) => current.filter((item) => item.dish.id !== dishId));
  }

  const favourites = dishes.filter((dish) => favouriteIds.includes(dish.id));

  return (
    <>
      <Header cart={cart} onChangeQty={changeQty} onRemove={removeFromCart} />
      <main>
        <Hero />
        <Section id="favourites" eyebrow="From the kitchen" title="Today's favourites">
          <DishGrid
            dishes={favourites}
            cart={cart}
            onAdd={addToCart}
            onChangeQty={changeQty}
          />
        </Section>
        <MenuSection cart={cart} onAdd={addToCart} onChangeQty={changeQty} />
      </main>
      <Footer />
    </>
  );
}
