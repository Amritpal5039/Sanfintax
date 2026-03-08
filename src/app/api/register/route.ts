import user from "@/src/app/model/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/lib/mongodb";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { Name, password, email } = await request.json();

        const existingEmail = await user.findOne({ email });
        if (existingEmail) {
            return NextResponse.json({ message: `Email already exists` }, { status: 400 })
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const newuser = await user.create({ Name, password: hashedpassword, email })
        return NextResponse.json({ message: "User created successfully" }, { status: 201 })
    }
    catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 })
    }
}
