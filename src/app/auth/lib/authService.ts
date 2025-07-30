import "server-only";
import { createServerSupabaseClient } from "../../../lib/supabase/serverClient";

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error("Failed to sign in", error);
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) throw new Error("Failed to sign out", error);
}
