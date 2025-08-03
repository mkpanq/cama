/** biome-ignore-all lint/style/noNonNullAssertion: This is a workaround for the fact that `process.env` can be undefined in some environments. */
import { createBrowserClient } from "@supabase/ssr";

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
