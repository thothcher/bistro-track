import { Outlet } from "react-router";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import type { CartItem, Session } from "../types";

type SiteLayoutProps = {
  cart: CartItem[];
  session: Session | null;
  onChangeQty: (dishId: number, delta: number) => void;
  onRemove: (dishId: number) => void;
  onLogout: () => void;
};

// The frame every page shares. <Outlet /> is the hole where the current page goes.
export function SiteLayout({
  cart,
  session,
  onChangeQty,
  onRemove,
  onLogout,
}: SiteLayoutProps) {
  return (
    <>
      <Header
        cart={cart}
        session={session}
        onChangeQty={onChangeQty}
        onRemove={onRemove}
        onLogout={onLogout}
      />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
