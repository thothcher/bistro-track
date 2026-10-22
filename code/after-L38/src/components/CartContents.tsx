import { Link } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "@/auth/authStore";
import { selectTotal, useCartStore } from "@/cart/cartStore";
import { QuantityStepper } from "@/components/QuantityStepper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useSendOrder } from "@/queries/orders";

type CartContentsProps = {
  onDone: () => void; // closes the sheet that holds this
};

// What used to be the CartPanel: the lines, the total and the buttons.
// The frame around it (focus, Esc, the dark backdrop) is now the Sheet's job.
export function CartContents({ onDone }: CartContentsProps) {
  const items = useCartStore((s) => s.items);
  const hasNotes = useCartStore((s) => s.notes !== null);
  const total = useCartStore(selectTotal);
  const isSignedIn = useAuthStore((s) => s.session !== null);
  const sendOrder = useSendOrder();
  const { changeQty, remove, clear } = useCartStore(
    useShallow((s) => ({ changeQty: s.changeQty, remove: s.remove, clear: s.clear })),
  );

  if (items.length === 0) {
    return <p className="note px-4">Nothing here yet — the menu is waiting.</p>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
      <ul className="cart-panel__list">
        {items.map((item) => (
          <li key={item.dish.id} className="cart-line">
            <span className="cart-line__name">{item.dish.name}</span>
            <QuantityStepper
              qty={item.qty}
              onDecrease={() => changeQty(item.dish.id, -1)}
              onIncrease={() => changeQty(item.dish.id, 1)}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => remove(item.dish.id)}
              aria-label={`Remove ${item.dish.name}`}
            >
              ✕
            </Button>
          </li>
        ))}
      </ul>
      <p className="cart-panel__total">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </p>
      {isSignedIn ? (
        <Button
          disabled={sendOrder.isPending}
          onClick={() => sendOrder.mutate(undefined, { onSuccess: onDone })}
        >
          {sendOrder.isPending ? "Sending…" : "Send to the kitchen"}
        </Button>
      ) : (
        <Button asChild>
          <Link to="/login" state={{ from: "/menu" }} onClick={onDone}>
            Sign in to send your order
          </Link>
        </Button>
      )}
      <Button asChild variant="link" size="sm">
        <Link to="/notes" onClick={onDone}>
          {hasNotes ? "Edit the table notes" : "Add table notes"}
        </Link>
      </Button>

      {/* Emptying the order cannot be undone: ask first. An AlertDialog is a Dialog that needs an
          answer: a click outside does not close it, and the focus starts on the safe choice, "Keep it". */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Empty the order
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Empty the order?</AlertDialogTitle>
            <AlertDialogDescription>
              Every dish and the table notes will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction onClick={clear}>Empty it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
