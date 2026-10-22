import { queryOptions } from "@tanstack/react-query";
import { useAuthStore } from "../auth/authStore";
import { api } from "../lib/api";
import type { UserProfile } from "../types";

export const accountQueries = {
  // Data of one guest: the guest is part of the key, so two accounts never share an entry
  profile: (email: string) =>
    queryOptions({
      queryKey: ["profile", email],
      queryFn: () =>
        api<UserProfile>("/api/v1/profile", {}, useAuthStore.getState().session?.token),
    }),
};
