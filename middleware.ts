import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const loginUrl = new URL("/Pages/Login", req.url);
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.redirect(loginUrl);
    }
    const secret = new TextEncoder().encode(jwtSecret);

    const { payload } = await jwtVerify(token, secret);

    if (!payload.email) {
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/Pages/dashboard/:path*", "/Pages/Dashboard/:path*"],
};
