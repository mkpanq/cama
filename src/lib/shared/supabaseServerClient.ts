/** biome-ignore-all lint/style/noNonNullAssertion: This is a workaround for the fact that `process.env` can be undefined in some environments. */
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            console.error("Failed to set cookies", cookiesToSet);
          }
        },
      },
    },
  );
}

export const getCurrentUser = async (): Promise<User> => {
  const client = await createServerSupabaseClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) throw new Error("No current user found!");

  return user;
};
