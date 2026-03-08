import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET as string;

async function getEmailFromCookie(req: NextRequest): Promise<string | null> {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    return (payload.email as string) ?? null;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  console.log("Middleware triggered for:", request.nextUrl.pathname);
    
  try {
    const email = await getEmailFromCookie(request);
    if (!email) {
      return NextResponse.redirect(new URL("/Pages/Login", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware execution error:", error);
    return NextResponse.redirect(new URL("/Pages/Login", request.url));
  }
}

export const config = {
  matcher: [
    "/Pages/dashboard",
    "/Pages/dashboard/:path*",
  ],
};
