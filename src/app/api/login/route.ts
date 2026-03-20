// token architecture-
// userID and email


import user from "@/src/app/model/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json();
    const existinguser = await user.findOne({ email });
    if (!existinguser) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existinguser.password,
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "invalid password" },
        { status: 401 },
      );
    }
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT secret is not defined");
    }
    const token = jwt.sign(
      { userId: existinguser._id, email: existinguser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );
    const response = NextResponse.json(
      { message: "login successful", token },
      { status: 200 }
    );
    // Create HTTP ONLY cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error("login error:", error);
    return NextResponse.json(
      { message: "internal server error", error: error.message },
      { status: 500 },
    );
  }
}
// export async function POST(request: NextRequest) {
//     try {
//         await connectDB();
//         const { email, password } = await request.json();
//         const existinguser = await user.findOne({ email });
//         if (!existinguser) {
//             return NextResponse.json({ message: `User not found` }, { status: 404 })
//         }
//         const isPasswordValid = await bcrypt.compare(password, existinguser.password);
//         if (!isPasswordValid) {
//             return NextResponse.json({ message: `Invalid password` }, { status: 401 })
//         }
//         return NextResponse.json({ message: "Login successful" }, { status: 200 })
//     }
//     catch (error: any) {
//         console.error("Login error:", error);
//         return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 })
//     }
// }
