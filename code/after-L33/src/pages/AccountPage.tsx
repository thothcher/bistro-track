import { useAuthStore } from "../auth/authStore";
import { Section } from "../components/Section";
import { useApi } from "../hooks/useApi";
import type { UserProfile } from "../types";

export function AccountPage() {
  const token = useAuthStore((s) => s.session?.token);
  // A protected endpoint. When the 2-minute token has expired, api() signs the guest out
  // and RequireAuth sends them to /login: no "sign in again" notice needed in this page.
  const { data, error, loading } = useApi<UserProfile>("/api/v1/profile", token);

  return (
    <Section eyebrow="Your table" title="My account">
      {loading && <p className="note">Loading…</p>}
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
  );
}
