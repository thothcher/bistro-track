import { Navigate, Outlet, useLocation } from "react-router";
import type { Role, Session } from "../types";

type RequireAuthProps = {
  session: Session | null;
  roles?: Role[]; // leave out: any signed-in user may enter
};

// A sign on the door, not a lock: the API checks the token and the role again on every request.
export function RequireAuth({ session, roles }: RequireAuthProps) {
  const location = useLocation();

  if (session === null) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(session.user.role)) {
    return <Navigate to="/forbidden" replace />;
  }
  return <Outlet />;
}
