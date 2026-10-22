import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuthStore } from "../auth/authStore";
import { selectCount, useCartStore } from "../cart/cartStore";
import { CartPanel } from "./CartPanel";

// NavLink tells us whether its route is the current page
function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? "nav-link-on" : "nav-link";
}

export function Header() {
  // Two stores, three questions. The Header re-renders only when one of the answers changes.
  const session = useAuthStore((s) => s.session);
  const logout = useAuthStore((s) => s.logout);
  const count = useCartStore(selectCount);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const isStaff = session?.user.role === "kitchen" || session?.user.role === "waiter";

  function signOut() {
    logout();
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
          <NavLink to="/faq" className={navClass}>
            FAQ
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
      {isCartOpen && <CartPanel onClose={() => setIsCartOpen(false)} />}
    </header>
  );
}
