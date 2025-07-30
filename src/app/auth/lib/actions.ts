"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signInWithPassword, signOut } from "./authService";
import APP_CONFIG from "@/appConfig";

export async function login(formData: FormData) {
  // TODO: Think about zod library for parsing and validate such input
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signInWithPassword(email, password);
  } catch (error) {
    console.error("Failed to sign in", error);
    redirect(APP_CONFIG.AUTH_PATH);
  }

  revalidatePath(APP_CONFIG.HOME_PATH);
  redirect(APP_CONFIG.HOME_PATH);
}

export async function logoutUser() {
  try {
    await signOut();
  } catch (error) {
    console.error("Failed to sign out", error);
    revalidatePath(APP_CONFIG.HOME_PATH);
    redirect(APP_CONFIG.HOME_PATH);
  }

  revalidatePath(APP_CONFIG.AUTH_PATH);
  redirect(APP_CONFIG.AUTH_PATH);
}
