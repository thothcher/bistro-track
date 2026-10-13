import { Favourites } from "./components/Favourites";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { MenuSection } from "./components/MenuSection";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { CartItem, Dish } from "./types";

export default function App() {
  // Same as useState, but saved in localStorage: the order survives a refresh.
  const [cart, setCart] = useLocalStorage<CartItem[]>("bistro.cart", []);

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

  return (
    <>
      <Header cart={cart} onChangeQty={changeQty} onRemove={removeFromCart} />
      <main>
        <Hero />
        <Favourites cart={cart} onAdd={addToCart} onChangeQty={changeQty} />
        <MenuSection cart={cart} onAdd={addToCart} onChangeQty={changeQty} />
      </main>
      <Footer />
    </>
  );
}
