import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

function getEmailFromToken(token: string): string | null {
  try {
    if (!JWT_SECRET) {
      console.error("[v0] JWT_SECRET is not set");
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; userId: string };
    console.log("[v0] Email extracted from token:", decoded.email);
    return decoded.email || null;
  } catch (error: any) {
    console.error("[v0] JWT verification failed:", error.message);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log("[v0] Middleware triggered for:", pathname);

  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      console.log("[v0] No token found in cookies, redirecting to login");
      return NextResponse.redirect(new URL("/Pages/Login", request.url));
    }

    // Verify token and extract email
    const email = getEmailFromToken(token);
    
    if (!email) {
      console.log("[v0] Email not found in token, redirecting to login");
      return NextResponse.redirect(new URL("/Pages/Login", request.url));
    }

    console.log("[v0] User authenticated with email:", email);
    return NextResponse.next();
  } catch (error) {
    console.error("[v0] Middleware execution error:", error);
    return NextResponse.redirect(new URL("/Pages/Login", request.url));
  }
}

export const config = {
  matcher: [
    "/Pages/Dashboard/:path*",
  ],
};
