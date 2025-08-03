import APP_CONFIG from "@/appConfig";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSessionMiddleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
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
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // TODO: Should this part be in separated middleware ?
  if (user && request.nextUrl.pathname.startsWith(APP_CONFIG.AUTH_PATH)) {
    const url = request.nextUrl.clone();
    url.pathname = APP_CONFIG.HOME_PATH;
    return NextResponse.redirect(url);
  }

  if (!user && !request.nextUrl.pathname.startsWith(APP_CONFIG.AUTH_PATH)) {
    const url = request.nextUrl.clone();
    url.pathname = APP_CONFIG.AUTH_PATH;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
