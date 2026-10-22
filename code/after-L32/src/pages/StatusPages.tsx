import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <section className="status-page">
      <p className="eyebrow">404</p>
      <h1 className="title">Not on the menu</h1>
      <p className="status-page__text">
        The page you're looking for isn't served here — but dinner is.
      </p>
      <Link to="/menu" className="btn">
        Back to the menu
      </Link>
    </section>
  );
}

export function ForbiddenPage() {
  return (
    <section className="status-page">
      <p className="eyebrow">403</p>
      <h1 className="title">Staff only</h1>
      <p className="status-page__text">
        This part of the house is for the team. Sign in with a staff account.
      </p>
      <Link to="/menu" className="btn">
        Back to the menu
      </Link>
    </section>
  );
}
