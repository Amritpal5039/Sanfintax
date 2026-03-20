import getUserFromToken from "@/lib/auth";
import { NextResponse } from "next/server";
import user from "@/src/app/model/user";
import connectDB from "@/lib/mongodb";
export async function GET(){
    try{
        connectDB();
        const userdata = await getUserFromToken();
        const data = await user.findById(userdata?.userId).select("-password");
        return NextResponse.json({userdata, data}, {status: 200});
    }catch(error){
        console.log(error);
        return NextResponse.json({message: "internal server error"}, {status: 500});
    }
}