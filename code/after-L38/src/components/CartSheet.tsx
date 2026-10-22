import { useState } from "react";
import { selectCount, useCartStore } from "@/cart/cartStore";
import { CartContents } from "@/components/CartContents";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// A panel that slides in from the side. Radix does the hard parts: it moves the focus inside,
// keeps Tab from leaving, closes on Esc, gives the focus back to the button, and tells screen
// readers "this is a dialog" (title and description included).
export function CartSheet() {
  const [open, setOpen] = useState(false);
  const count = useCartStore(selectCount);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Your order · {count}
        </Button>
      </SheetTrigger>
      <SheetContent className="gap-0">
        <SheetHeader>
          <SheetTitle className="text-3xl text-primary">Your order</SheetTitle>
          <SheetDescription>
            Check your dishes, then send them to the kitchen.
          </SheetDescription>
        </SheetHeader>
        <CartContents onDone={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
