import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getEmailFromCookie(req: NextRequest): Promise<string | null> {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.log("[v0] No token found in cookies");
      return null;
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    const email = payload.email as string;
    console.log("[v0] Email extracted from token:", email);
    return email ?? null;
  } catch (error) {
    console.error("[v0] JWT verification failed:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  console.log("[v0] Middleware triggered for:", request.nextUrl.pathname);
    
  try {
    const email = await getEmailFromCookie(request);
    if (!email) {
      console.log("[v0] No email found, redirecting to login");
      return NextResponse.redirect(new URL("/Pages/Login", request.url));
    }
    console.log("[v0] Email verified, allowing access:", email);
    return NextResponse.next();
  } catch (error) {
    console.error("[v0] Middleware execution error:", error);
    return NextResponse.redirect(new URL("/Pages/Login", request.url));
  }
}

export const config = {
  matcher: [
    "/Pages/Dashboard",
    "/Pages/Dashboard/:path*",
  ],
};
