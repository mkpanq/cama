import { NextResponse, type NextRequest } from "next/server";
import APP_CONFIG from "./lib/appConfig";
import type {
  AccessToken,
  RefreshToken,
} from "./lib/shared/apiToken/apiToken.type";
import {
  getRefreshedToken,
  isTokenValid,
} from "./lib/shared/apiToken/apiToken.service";
import { signOut } from "./lib/auth/auth.service";
import { isJWTTokenValid } from "./lib/auth/jwtUtils";

export async function middleware(request: NextRequest) {
  const outputResponse = NextResponse.next({
    request,
  });

  // TODO: Create normal, fully working AUTH mechanism
  const cookieToken = request.cookies.get(APP_CONFIG.AUTH_CONFIG.COOKIE_NAME);
  const verifiedToken = isJWTTokenValid(cookieToken?.value);

  if (
    !verifiedToken &&
    !request.nextUrl.pathname.startsWith(APP_CONFIG.ROUTE_CONFIG.AUTH_PATH)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = APP_CONFIG.ROUTE_CONFIG.AUTH_PATH;
    return NextResponse.redirect(url);
  } else if (
    verifiedToken &&
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
      if (!newAccessToken) {
        console.error("Failed to refresh access token! Logging out...");
        await signOut();

        const url = request.nextUrl.clone();
        url.pathname = APP_CONFIG.ROUTE_CONFIG.AUTH_PATH;
        return NextResponse.redirect(url);
      }
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
  runtime: "nodejs",
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/health|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
