import { lazy } from "react";
import { Route, Routes } from "react-router";
import { SiteLayout } from "./layouts/SiteLayout";
import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";
import { RequireAuth } from "./routes/RequireAuth";

// The home page and the menu are what most guests open first: they travel in the main file.
// Every other page is its own file, downloaded the first time a guest goes there.
// (The pages export a name, not "default", so each import() says which one it wants.)
const DishPage = lazy(() => import("./pages/DishPage").then((m) => ({ default: m.DishPage })));
const FaqPage = lazy(() => import("./pages/FaqPage").then((m) => ({ default: m.FaqPage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() =>
  import("./pages/RegisterPage").then((m) => ({ default: m.RegisterPage })),
);
const TableNotesPage = lazy(() =>
  import("./pages/TableNotesPage").then((m) => ({ default: m.TableNotesPage })),
);
const AccountPage = lazy(() =>
  import("./pages/AccountPage").then((m) => ({ default: m.AccountPage })),
);
const KitchenPage = lazy(() =>
  import("./pages/KitchenPage").then((m) => ({ default: m.KitchenPage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/StatusPages").then((m) => ({ default: m.NotFoundPage })),
);
const ForbiddenPage = lazy(() =>
  import("./pages/StatusPages").then((m) => ({ default: m.ForbiddenPage })),
);

// App only lists routes. Every page asks the stores for what it needs.
// The <Suspense> that waits for the lazy pages is in SiteLayout, around the <Outlet />.
export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="menu/:id" element={<DishPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="notes" element={<TableNotesPage />} />

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
