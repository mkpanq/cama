import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "./supabaseClients";

export const getCurrentUser = async (): Promise<User> => {
  const client = await createServerSupabaseClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) throw new Error("No current user found!");

  return user;
};
