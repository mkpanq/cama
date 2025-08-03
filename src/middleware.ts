import type { NextRequest } from "next/server";
import { updateSessionMiddleware } from "./middleware/session.middleware";

export async function middleware(request: NextRequest) {
  return await updateSessionMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
