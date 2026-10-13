import { Route, Routes } from "react-router";
import { SiteLayout } from "./layouts/SiteLayout";
import { AccountPage } from "./pages/AccountPage";
import { DishPage } from "./pages/DishPage";
import { FaqPage } from "./pages/FaqPage";
import { HomePage } from "./pages/HomePage";
import { KitchenPage } from "./pages/KitchenPage";
import { LoginPage } from "./pages/LoginPage";
import { MenuPage } from "./pages/MenuPage";
import { ForbiddenPage, NotFoundPage } from "./pages/StatusPages";
import { RequireAuth } from "./routes/RequireAuth";

// The cart and the session now live in context (main.tsx): no more props through every page.
export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="menu/:id" element={<DishPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="login" element={<LoginPage />} />

        {/* any signed-in guest */}
        <Route element={<RequireAuth />}>
          <Route path="account" element={<AccountPage />} />
        </Route>

        {/* staff only: the roles the API lets into the order queue */}
        <Route element={<RequireAuth roles={["kitchen", "waiter"]} />}>
          <Route path="kitchen" element={<KitchenPage />} />
        </Route>

        <Route path="forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
