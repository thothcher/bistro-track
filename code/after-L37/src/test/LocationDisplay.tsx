import { useLocation } from "react-router";

// Shows where the router is, as text, so a test can say "the guest was sent to /login".
export function LocationDisplay() {
  const location = useLocation();
  return <p data-testid="location">{location.pathname + location.search}</p>;
}
