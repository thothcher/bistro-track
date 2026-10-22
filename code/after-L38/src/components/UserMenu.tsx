import { ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@/auth/authStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// One button instead of three links. The menu is keyboard-ready: Enter opens it, the arrow keys
// move, typing a letter jumps, Esc closes and the focus returns to the button.
export function UserMenu() {
  const session = useAuthStore((s) => s.session);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  if (session === null) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link to="/login">Log in</Link>
      </Button>
    );
  }

  const isStaff = session.user.role === "kitchen" || session.user.role === "waiter";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {session.user.displayName ?? "Account"}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{session.user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/account">My account and orders</Link>
        </DropdownMenuItem>
        {isStaff && (
          <DropdownMenuItem asChild>
            <Link to="/kitchen">The pass (kitchen)</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            logout();
            navigate("/");
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
