/*import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '../../model/user';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT (request : NextRequest){
    try {
        await connectDB();
        const body =await request.json();
        const {Name , email, password} = body;
        // if (!mongoose.Types.ObjectId.isValid(email)){
        //     return NextResponse.json({success : false, error: "invalid email"},{status:400});
        // }
        if(!email && !Name){
            return NextResponse.json({success : false, error: "email and name are required for forgetting the password"},{status:400});
        }
        const user = await User.findOne({email: email, Name: Name});
        if(!user){
            return NextResponse.json({success : false, error: "user not found"},{status:404});
        }
        const update = await User.findOne({email})


    }
}*/