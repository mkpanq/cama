/** biome-ignore-all lint/style/noNonNullAssertion: This is a workaround for the fact that `process.env` can be undefined in some environments. */
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export const getCurrentUser = async (): Promise<User> => {
  const client = createBrowserSupabaseClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) throw new Error("No current user found!");

  return user;
};
