/** biome-ignore-all lint/style/noNonNullAssertion: This is a temporary fix to avoid linting errors */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import APP_CONFIG from "./appConfig";
import type {
  AccessToken,
  RefreshToken,
} from "./shared/apiToken/apiToken.type";
import { getRefreshedToken, isTokenValid } from "./shared/apiToken/apiToken";

// TODO: Right now I've decided to go with one middleware file due to need of creating separate parser for multiple middleware files
// Will do it later, when more middlewares will be needed
export async function middleware(request: NextRequest) {
  let outputResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          outputResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            outputResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith(APP_CONFIG.ROUTE_CONFIG.AUTH_PATH)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = APP_CONFIG.ROUTE_CONFIG.AUTH_PATH;
    return NextResponse.redirect(url);
  } else if (
    user &&
    request.nextUrl.pathname.startsWith(APP_CONFIG.ROUTE_CONFIG.AUTH_PATH)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = APP_CONFIG.ROUTE_CONFIG.HOME_PATH;
    return NextResponse.redirect(url);
  }

  const accessCookieValue = request.cookies.get(
    APP_CONFIG.API_CONFIG.API_ACCESS_TOKEN_COOKIE_NAME,
  );
  const refreshCookieValue = request.cookies.get(
    APP_CONFIG.API_CONFIG.API_REFRESH_TOKEN_COOKIE_NAME,
  );

  const accessingApiToken = accessCookieValue
    ? (JSON.parse(accessCookieValue.value) as AccessToken)
    : undefined;

  const refreshingApiToken = refreshCookieValue
    ? (JSON.parse(refreshCookieValue.value) as RefreshToken)
    : undefined;

  if (
    accessingApiToken &&
    refreshingApiToken &&
    !isTokenValid(accessingApiToken)
  ) {
    try {
      const newAccessToken = await getRefreshedToken(
        refreshingApiToken.refresh,
      );
      if (!newAccessToken) throw new Error("Failed to refresh access token");
      outputResponse.cookies.set(
        APP_CONFIG.API_CONFIG.API_ACCESS_TOKEN_COOKIE_NAME,
        JSON.stringify(newAccessToken),
      );
    } catch (error) {
      console.error(error);
      return outputResponse;
    }
  }

  return outputResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
