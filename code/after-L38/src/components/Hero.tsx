import { Link } from "react-router";
import { IMAGE_BASE } from "../lib/images";

export function Hero() {
  return (
    <section className="hero">
      {/* the biggest thing on the first screen: ask for it first (the opposite of lazy) */}
      <img
        src={IMAGE_BASE + "/images/duck-confit.jpg"}
        alt=""
        className="hero__img"
        fetchPriority="high"
      />
      <div className="hero__body">
        <p className="eyebrow">Vera · Tbilisi</p>
        <h1 className="hero__title">French cooking, at home in Tbilisi</h1>
        <p className="hero__lede">
          Slow-braised classics, a short wine list and warm rooms on Kiacheli Street.
        </p>
        <Link to="/menu" className="btn">
          View the menu
        </Link>
      </div>
    </section>
  );
}
