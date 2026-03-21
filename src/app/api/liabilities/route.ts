import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Liability from "@/src/app/model/liabilities";
import getUserFromToken from "@/lib/auth";
export async function GET(req:NextRequest){
    try{
        const user = await getUserFromToken();
        if(!user){
            return NextResponse.json({success:false,message:"Unauthorized"});
        }
        await connectDB();
        const liabilities=await Liability.find({createdBy:user.userId});
        return NextResponse.json({success:true,data:liabilities});
    }catch(error){
        console.log(error);
        return NextResponse.json({success:false,message:"Internal server error"});
    }
}

export async function POST(req:NextRequest){
    try{
        const user = await getUserFromToken();
        if(!user){
            return NextResponse.json({success:false,message:"Unauthorized"});
        }
        const dataFromFrontend = await req.json();
        const payload= {
            name:String(dataFromFrontend.name),
            type:String(dataFromFrontend.type),
            principalAmount:Number(dataFromFrontend.principalAmount),
            outstandingAmount:Number(dataFromFrontend.outstandingAmount),
            interestRate:Number(dataFromFrontend.interestRate),
            emiAmount:Number(dataFromFrontend.emiAmount),
            startDate:new Date(dataFromFrontend.startDate),
            endDate:new Date(dataFromFrontend.endDate),
            lenderName:String(dataFromFrontend.lenderName),
            notes:String(dataFromFrontend.notes),
            createdBy:user.userId,
        };
        await connectDB();
        const liability=await Liability.create(payload);
        return NextResponse.json({success:true,data:liability});
    }catch(error){
        console.log(error);
        return NextResponse.json({success:false,message:"Internal server error"});
    }
}