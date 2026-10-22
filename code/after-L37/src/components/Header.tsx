import { Link, NavLink } from "react-router";
import { CartSheet } from "@/components/CartSheet";
import { UserMenu } from "@/components/UserMenu";

// NavLink tells us whether its route is the current page
function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? "nav-link-on" : "nav-link";
}

// The cart and the user menu are shadcn components with their own state: this file shrank.
export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__bar">
        <Link to="/" className="logo">
          <span className="logo__name">Le Bistro</span>
          <span className="eyebrow">by IT Step</span>
        </Link>
        <nav className="nav" aria-label="Main">
          <NavLink to="/menu" className={navClass}>
            Menu
          </NavLink>
          <NavLink to="/faq" className={navClass}>
            FAQ
          </NavLink>
          <CartSheet />
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}
