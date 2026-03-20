import cookies from 'next/headers';
import connectDB from "@/lib/mongodb";
import FD from "@/src/app/model/FD";
import { verifyToken } from "@/lib/jwt";    
import { NextRequest, NextResponse } from "next/server";
import getUserFromToken from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromToken();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const fds = await FD.find({ createdBy: user.userId as string });
        const totalAmount = fds.reduce((sum, fd) => sum + (fd.principalAmount || 0), 0);
        return NextResponse.json({totalAmount, fddata: fds }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
// output 
// fddata--- it contains the all data about the FD 

export async function POST(req: NextRequest) {
    try {
        const dataFromFrontend = await req.json();
        const user = await getUserFromToken();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const payload = {
            bankName: String(dataFromFrontend.bankName),
            principalAmount: Number(dataFromFrontend.principalAmount),
            interestRate: Number(dataFromFrontend.interestRate),
            tenure: Number(dataFromFrontend.tenure),
            compoundingFrequency: Number(dataFromFrontend.compoundingFrequency),
            maturityDate: new Date(dataFromFrontend.maturityDate),
            maturityAmount: Number(dataFromFrontend.maturityAmount) || 0,
            createdBy: user.userId as string
        };
        const fd = await FD.create(payload);
        return NextResponse.json({ fddata: fd }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
