import { connectDB } from "@/libs/mongodb";
import User from "@/models/User";
import { messages } from "@/utils/messages";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    try {
        await connectDB();
        const users = await User.find();
        return NextResponse.json({users}, {status: 200});




    } catch (error) {
        return NextResponse.json(
            { error: messages.error.generic },
            { status: 500 }
          );
    }
}