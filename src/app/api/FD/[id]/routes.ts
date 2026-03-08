// src/app/api/fd/[id]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// PUT    /api/fd/:id  → update an existing FD (recalculates maturityAmount)
// DELETE /api/fd/:id  → delete an FD (only if it belongs to the logged-in user)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import FD, { calcMaturity } from "@/src/app/model/FD";

const JWT_SECRET = process.env.JWT_SECRET as string;

// ── Utility: extract email from HttpOnly cookie ───────────────────────────────
function getEmailFromCookie(req: NextRequest): string | null {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return decoded.email ?? null;
  } catch {
    return null;
  }
}

// ── PUT /api/fd/:id ───────────────────────────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  // Validate
  if (!bankName || !principalAmount || !interestRate || !tenure || !maturityDate) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 });
  }

  await connectDB();

  // Recalculate maturity amount with the new values
  const maturityAmount = calcMaturity(
    principalAmount,
    interestRate,
    tenure,
    compoundingFrequency ?? 4
  );

  // Only update if the FD belongs to this user (userEmail check = security)
  const updated = await FD.findOneAndUpdate(
    { _id: params.id, userEmail: email },   // ← ensures users can't edit others' FDs
    {
      bankName,
      principalAmount,
      interestRate,
      tenure,
      compoundingFrequency: compoundingFrequency ?? 4,
      maturityDate,
      maturityAmount,
    },
    { new: true }  // return the updated document
  );

  if (!updated) {
    return NextResponse.json(
      { message: "FD not found or not authorized" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated, { status: 200 });
}

// ── DELETE /api/fd/:id ────────────────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const email = getEmailFromCookie(req);
  if (!email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  // userEmail check ensures a user cannot delete another user's FD
  const deleted = await FD.findOneAndDelete({
    _id: params.id,
    userEmail: email,
  });

  if (!deleted) {
    return NextResponse.json(
      { message: "FD not found or not authorized" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "FD deleted successfully" }, { status: 200 });
}