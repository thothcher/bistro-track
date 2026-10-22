import { selectQtyOf, useCartStore } from "@/cart/cartStore";
import { QuantityStepper } from "@/components/QuantityStepper";
import { Button } from "@/components/ui/button";
import type { Dish } from "@/types";

// The button that becomes a stepper once the dish is in the order.
// The card and the quick look share it, so the two can never disagree.
export function AddToCart({ dish }: { dish: Dish }) {
  // Each button asks the store one question: "how many of MY dish are in the order?"
  const qty = useCartStore(selectQtyOf(dish.id));
  const add = useCartStore((s) => s.add);
  const changeQty = useCartStore((s) => s.changeQty);

  if (qty === 0) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={!dish.isAvailable}
        onClick={() => add(dish)}
      >
        Add to cart
      </Button>
    );
  }
  return (
    <QuantityStepper
      qty={qty}
      onDecrease={() => changeQty(dish.id, -1)}
      onIncrease={() => changeQty(dish.id, 1)}
    />
  );
}
