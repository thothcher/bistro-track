export function Header() {
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
          <button type="button" className="btn-outline">
            Your order · 0
          </button>
          <button type="button" className="btn-outline">
            Log in
          </button>
        </nav>
      </div>
    </header>
  );
}
