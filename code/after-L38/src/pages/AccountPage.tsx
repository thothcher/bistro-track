import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../auth/authStore";
import { MyOrders } from "../components/MyOrders";
import { Section } from "../components/Section";
import { accountQueries } from "../queries/account";

export function AccountPage() {
  const email = useAuthStore((s) => s.session?.user.email ?? "");
  // A protected endpoint. When the 2-minute token has expired, api() signs the guest out
  // and RequireAuth sends them to /login: no "sign in again" notice needed in this page.
  const { data, error, isPending } = useQuery(accountQueries.profile(email));

  return (
    <>
      <Section eyebrow="Your table" title="My account" as="h1">
        {isPending && <p className="note">Loading…</p>}
        {error && <p className="error">{error.message}</p>}

        {data && (
          <dl className="profile">
            <dt className="eyebrow">Name</dt>
            <dd>{data.displayName ?? "—"}</dd>
            <dt className="eyebrow">Email</dt>
            <dd>{data.email}</dd>
            <dt className="eyebrow">Role</dt>
            <dd>{data.role}</dd>
            <dt className="eyebrow">Language</dt>
            <dd>{data.preferredLanguage}</dd>
            <dt className="eyebrow">Guest since</dt>
            <dd>{new Date(data.createdAt).toLocaleDateString()}</dd>
          </dl>
        )}
      </Section>
      <MyOrders />
    </>
  );
}
