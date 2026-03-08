// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import FD from "@/src/app/model/FD";
// import connectDB from "@/lib/mongodb";

// export async function GET() {

//   try{
//     await connectDB();
//     const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   if (!token) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

//   const fds = await FD.find({ userId: decoded.userId });

//   return Response.json(fds);
//   }
//   catch(error){
//     console.log(error)
//     return new Response("Internal Server Error", { status: 500 });  
//   }
// }

// src/app/api/fd/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/fd  → returns all FDs belonging to the logged-in user
// POST /api/fd  → creates a new FD for the logged-in user
//
// User identity is resolved by reading the HttpOnly JWT cookie.
// Your existing middleware.ts already protects routes, but we verify
// the token here too so we can extract the email safely.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";          // ← your existing db connection
import FD, { calcMaturity } from "@/src/app/model/FD";

const JWT_SECRET = process.env.JWT_SECRET as string;

// ── Utility: extract email from the HttpOnly cookie ───────────────────────────
function getEmailFromCookie(req: NextRequest): string | null {
  try {
    // Your auth flow stores the JWT in a cookie named "token" — change if different
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return decoded.email ?? null;
  } catch {
    return null;
  }
}

// ── GET /api/fd ───────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const email = getEmailFromCookie(req);
  if (!email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const fds = await FD.find({ userEmail: email }).sort({ createdAt: -1 });
  return NextResponse.json(fds, { status: 200 });
}

// ── POST /api/fd ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const email = getEmailFromCookie(req);
  if (!email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    bankName,
    principalAmount,
    interestRate,
    tenure,
    compoundingFrequency,
    maturityDate,
  } = body;

  // ── Validate ──────────────────────────────────────────────────────────────
  if (!bankName || !principalAmount || !interestRate || !tenure || !maturityDate) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });
  }
  if (principalAmount <= 0 || interestRate <= 0 || tenure <= 0) {
    return NextResponse.json({ message: "Amounts and tenure must be positive" }, { status: 400 });
  }

  await connectDB();

  // maturityAmount is calculated inside the pre-save hook of the model
  const fd = new FD({
    userEmail: email,
    bankName,
    principalAmount,
    interestRate,
    tenure,
    compoundingFrequency: compoundingFrequency ?? 4, // default quarterly
    maturityDate,
  });

  await fd.save();
  return NextResponse.json(fd, { status: 201 });
}