import "server-only";
import { cookies } from "next/headers";
import { getNewToken } from "@/lib/shared/apiToken/apiToken.service";
import APP_CONFIG from "@/lib/appConfig";
import { generateToken } from "./jwtUtils";

export async function signInWithPassword(email: string, password: string) {
  const cookieStore = await cookies();

  const correct = credentialsCheck(email, password);
  if (!correct) throw new Error("Failed to sign in");

  const token = generateToken();
  cookieStore.set(APP_CONFIG.AUTH_CONFIG.COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
  });

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
  const cookieStore = await cookies();

  cookieStore.delete(APP_CONFIG.AUTH_CONFIG.COOKIE_NAME);
  cookieStore.delete(APP_CONFIG.API_CONFIG.API_ACCESS_TOKEN_COOKIE_NAME);
  cookieStore.delete(APP_CONFIG.API_CONFIG.API_REFRESH_TOKEN_COOKIE_NAME);
}

const credentialsCheck = (email: string, password: string) => {
  if (!email || !password) return false;

  return (
    email === process.env.DASHBOARD_USER &&
    password === process.env.DASHBOARD_PASSWORD
  );
};
