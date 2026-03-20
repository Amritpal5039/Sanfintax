import connectDB from "@/lib/mongodb";
import  getUserfromtoken  from "@/lib/auth";
import FD from "@/src/app/model/FD";
import { NextResponse } from "next/server";


export async function PUT(req: Request, { params }: any){
    try{
        await connectDB();

 const body = await req.json();
 const user = await getUserfromtoken();

 const resolvedParams = await params;
 const updatedFD = await FD.findOneAndUpdate(
 {
 _id: resolvedParams.FD,
 createdBy: user.userId as string
 },
 {
 bankName: String(body.bankName),
            principalAmount: Number(body.principalAmount),
            interestRate: Number(body.interestRate),
            tenure: Number(body.tenure),
            compoundingFrequency: Number(body.compoundingFrequency),
            maturityDate: new Date(body.maturityDate),
            maturityAmount: Number(body.maturityAmount) || 0,
 },
 { new: true }
 );

 if (!updatedFD) {
 return NextResponse.json(
 { message: "FD not found or unauthorized" },
 { status: 404 }
 );
 }

 return NextResponse.json(updatedFD);
}
catch(error){
    console.log(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
}
}

export async function DELETE(req: Request, { params }: any) {
    try{
        await connectDB();
        const user = await getUserfromtoken();
        const resolvedParams = await params;
        const deletedFD = await FD.findOneAndDelete({
            _id: resolvedParams.FD,
            createdBy: user.userId as string
        });
        if (!deletedFD) {
            return NextResponse.json(
                { message: "FD not found or unauthorized" },
                { status: 404 }
            );
        }
        return NextResponse.json(deletedFD);
    }
    catch(error){
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}