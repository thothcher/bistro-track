import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import type { CartItem, Session } from "../types";
import { CartPanel } from "./CartPanel";

type HeaderProps = {
  cart: CartItem[];
  session: Session | null;
  onChangeQty: (dishId: number, delta: number) => void;
  onRemove: (dishId: number) => void;
  onLogout: () => void;
};

// NavLink tells us whether its route is the current page
function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? "nav-link-on" : "nav-link";
}

export function Header({ cart, session, onChangeQty, onRemove, onLogout }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const isStaff = session?.user.role === "kitchen" || session?.user.role === "waiter";

  function signOut() {
    onLogout();
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <Link to="/" className="logo">
          <span className="logo__name">Le Bistro</span>
          <span className="eyebrow">by IT Step</span>
        </Link>
        <nav className="nav">
          <NavLink to="/menu" className={navClass}>
            Menu
          </NavLink>
          {isStaff && (
            <NavLink to="/kitchen" className={navClass}>
              Kitchen
            </NavLink>
          )}
          {session && (
            <NavLink to="/account" className={navClass}>
              {session.user.displayName ?? "Account"}
            </NavLink>
          )}
          <button
            type="button"
            className="btn-outline"
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            Your order · {count}
          </button>
          {session ? (
            <button type="button" className="btn-outline" onClick={signOut}>
              Sign out
            </button>
          ) : (
            <Link to="/login" className="btn-outline">
              Log in
            </Link>
          )}
        </nav>
      </div>
      {isCartOpen && (
        <CartPanel
          items={cart}
          onChangeQty={onChangeQty}
          onRemove={onRemove}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </header>
  );
}
