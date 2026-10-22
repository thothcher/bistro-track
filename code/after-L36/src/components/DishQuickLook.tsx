import { AddToCart } from "@/components/AddToCart";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/format";
import { IMAGE_BASE } from "@/lib/images";
import type { Dish } from "@/types";

// A closer look at a dish without leaving the menu. The title becomes the dialog's accessible
// name, the first thing a screen reader says. Without one the dialog is just "dialog".
export function DishQuickLook({ dish }: { dish: Dish }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" aria-label={`Quick look at ${dish.name}`}>
          Quick look
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <img
          src={IMAGE_BASE + dish.imageUrl}
          alt=""
          className="aspect-4/3 w-full object-cover"
        />
        <DialogHeader>
          <DialogTitle className="text-3xl text-primary">{dish.name}</DialogTitle>
          <DialogDescription className="font-display text-lg italic">
            {dish.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="items-center sm:justify-between">
          <span className="font-display text-2xl">{formatPrice(dish.price)}</span>
          <AddToCart dish={dish} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
