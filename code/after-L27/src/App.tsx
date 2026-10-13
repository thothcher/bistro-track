import { CategoryChips } from "./components/CategoryChips";
import { DishGrid } from "./components/DishGrid";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Section } from "./components/Section";
import { categories } from "./data/categories";
import { dishes } from "./data/dishes";

const favouriteIds = [5, 15, 21];

export default function App() {
  const favourites = dishes.filter((dish) => favouriteIds.includes(dish.id));

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Section id="favourites" eyebrow="From the kitchen" title="Today's favourites">
          <DishGrid dishes={favourites} />
        </Section>
        <Section id="menu" eyebrow="La carte" title="The menu">
          <CategoryChips categories={categories} />
          <DishGrid dishes={dishes} />
        </Section>
      </main>
      <Footer />
    </>
  );
}
