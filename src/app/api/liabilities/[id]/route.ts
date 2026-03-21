import connectDB from "@/lib/mongodb";
import Liability from "@/src/app/model/liabilities";
import { NextRequest, NextResponse } from "next/server";
import getUserFromToken from "@/lib/auth";

export async function PUT(req:NextRequest, { params }: any){ 
    try{
        const user = await getUserFromToken();
        if(!user){
            return NextResponse.json({success:false,message:"Unauthorized"});
        }
        const resolvedParams = await params;
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
        const liability=await Liability.findOneAndUpdate({_id:resolvedParams.id, createdBy:user.userId},payload,{new:true});
        if(!liability){
            return NextResponse.json({success:false,message:"Liability not found"});
        }
        return NextResponse.json({success:true,data:liability});
    }catch(error){
        console.log(error);
        return NextResponse.json({success:false,message:"Internal server error"});
    }
}

export async function DELETE(req:NextRequest, { params }: any){
    try{
        const user = await getUserFromToken();
        if(!user){
            return NextResponse.json({success:false,message:"Unauthorized"});
        }
        const resolvedParams = await params;
        await connectDB();
        const liability=await Liability.findOneAndDelete({_id:resolvedParams.id, createdBy:user.userId});
        if(!liability){
            return NextResponse.json({success:false,message:"Liability not found"});
        }
        return NextResponse.json({success:true,data:liability});
    }catch(error){
        console.log(error);
        return NextResponse.json({success:false,message:"Internal server error"});
    }
}