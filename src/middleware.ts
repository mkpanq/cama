import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import APP_CONFIG from "./appConfig";
import getNewApiToken from "./shared/apiToken/getNewApiToken.request";
import type {
  AccessToken,
  ApiToken,
  RefreshToken,
} from "./shared/apiToken/apiToken.type";
import refreshApiToken from "./shared/apiToken/refreshApiToken.request";
import { isTokenValid } from "./shared/apiToken/apiToken";

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

  // Last - do not let user to access auth if it's logged in
  if (!user && !request.nextUrl.pathname.startsWith(APP_CONFIG.AUTH_PATH)) {
    const url = request.nextUrl.clone();
    url.pathname = APP_CONFIG.AUTH_PATH;
    return NextResponse.redirect(url);
  } else if (
    user &&
    request.nextUrl.pathname.startsWith(APP_CONFIG.AUTH_PATH)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = APP_CONFIG.HOME_PATH;
    return NextResponse.redirect(url);
  }

  const cookieValue = request.cookies.get(
    APP_CONFIG.API_ACCESS_TOKEN_COOKIE_NAME,
  );

  if (!cookieValue) {
    try {
      const token = await getNewApiToken();

      const accessToken: AccessToken = {
        access: token.access,
        access_expires: token.access_expires,
      };
      const refreshToken: RefreshToken = {
        refresh: token.refresh,
        refresh_expires: token.refresh_expires,
      };

      outputResponse.cookies.set(
        APP_CONFIG.API_ACCESS_TOKEN_COOKIE_NAME,
        JSON.stringify(accessToken),
      );
      outputResponse.cookies.set(
        APP_CONFIG.API_REFRESH_TOKEN_COOKIE_NAME,
        JSON.stringify(refreshToken),
      );
    } catch (error) {
      console.error(error);

      return outputResponse;
    }

    return outputResponse;
  }

  const currentApiToken = JSON.parse(cookieValue.value) as ApiToken;

  if (!isTokenValid(currentApiToken)) {
    try {
      const newAccessToken = await refreshApiToken(currentApiToken.refresh);
      outputResponse.cookies.set(
        APP_CONFIG.API_ACCESS_TOKEN_COOKIE_NAME,
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
