import { Route, Routes } from "react-router";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { SiteLayout } from "./layouts/SiteLayout";
import { AccountPage } from "./pages/AccountPage";
import { DishPage } from "./pages/DishPage";
import { HomePage } from "./pages/HomePage";
import { KitchenPage } from "./pages/KitchenPage";
import { LoginPage } from "./pages/LoginPage";
import { MenuPage } from "./pages/MenuPage";
import { ForbiddenPage, NotFoundPage } from "./pages/StatusPages";
import { RequireAuth } from "./routes/RequireAuth";
import type { CartItem, Dish, Session } from "./types";

export default function App() {
  const [cart, setCart] = useLocalStorage<CartItem[]>("bistro.cart", []);
  // Kept in localStorage for this course. The Next.js module moves sessions into httpOnly cookies.
  const [session, setSession] = useLocalStorage<Session | null>("bistro.session", null);

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

  const logout = () => setSession(null);

  return (
    <Routes>
      <Route
        element={
          <SiteLayout
            cart={cart}
            session={session}
            onChangeQty={changeQty}
            onRemove={removeFromCart}
            onLogout={logout}
          />
        }
      >
        <Route
          index
          element={<HomePage cart={cart} onAdd={addToCart} onChangeQty={changeQty} />}
        />
        <Route
          path="menu"
          element={<MenuPage cart={cart} onAdd={addToCart} onChangeQty={changeQty} />}
        />
        <Route
          path="menu/:id"
          element={<DishPage cart={cart} onAdd={addToCart} onChangeQty={changeQty} />}
        />
        <Route path="login" element={<LoginPage onLogin={setSession} />} />

        {/* any signed-in guest */}
        <Route element={<RequireAuth session={session} />}>
          <Route
            path="account"
            element={session && <AccountPage session={session} onExpired={logout} />}
          />
        </Route>

        {/* staff only: the roles the API lets into the order queue */}
        <Route element={<RequireAuth session={session} roles={["kitchen", "waiter"]} />}>
          <Route
            path="kitchen"
            element={session && <KitchenPage session={session} onExpired={logout} />}
          />
        </Route>

        <Route path="forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
