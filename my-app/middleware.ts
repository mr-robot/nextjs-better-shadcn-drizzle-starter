import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // TODO: Implement proper Better Auth middleware when available
  // For now, this is a basic middleware structure
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // Basic protection - in production, use Better Auth middleware
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
