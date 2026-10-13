import { useState } from "react";
import type { CartItem } from "../types";
import { CartPanel } from "./CartPanel";

type HeaderProps = {
  cart: CartItem[];
  onChangeQty: (dishId: number, delta: number) => void;
  onRemove: (dishId: number) => void;
};

export function Header({ cart, onChangeQty, onRemove }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const count = cart.reduce((sum, item) => sum + item.qty, 0); // derived, never stored

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <a href="#top" className="logo">
          <span className="logo__name">Le Bistro</span>
          <span className="eyebrow">by IT Step</span>
        </a>
        <nav className="nav">
          <a href="#favourites">Favourites</a>
          <a href="#menu">Menu</a>
          <button
            type="button"
            className="btn-outline"
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            Your order · {count}
          </button>
          <button type="button" className="btn-outline">
            Log in
          </button>
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
