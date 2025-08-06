import "server-only";
import { createServerSupabaseClient } from "../shared/supabaseClients";
import { cookies } from "next/headers";
import { getNewToken } from "@/lib/shared/apiToken/apiToken.service";
import APP_CONFIG from "@/lib/appConfig";

export async function signInWithPassword(email: string, password: string) {
  const cookieStore = await cookies();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error("Failed to sign in", error);

  const newApiToken = await getNewToken();
  if (!newApiToken?.access || !newApiToken?.refresh) return;

  cookieStore.set(
    APP_CONFIG.API_CONFIG.API_ACCESS_TOKEN_COOKIE_NAME,
    JSON.stringify(newApiToken.access),
  );
  cookieStore.set(
    APP_CONFIG.API_CONFIG.API_REFRESH_TOKEN_COOKIE_NAME,
    JSON.stringify(newApiToken.refresh),
  );
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  const cookieStore = await cookies();

  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) throw new Error("Failed to sign out", error);

  cookieStore.delete(APP_CONFIG.API_CONFIG.API_ACCESS_TOKEN_COOKIE_NAME);
  cookieStore.delete(APP_CONFIG.API_CONFIG.API_REFRESH_TOKEN_COOKIE_NAME);
}
