import { connectDB } from "@/libs/mongodb";
import User from "@/models/User";
import { messages } from "@/utils/messages";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    try {
        await connectDB();
        // obtiene todos los usuarios
        const users = await User.find();
        //envia la response con todos los usuarios
        return NextResponse.json({users}, {status: 200});




    } catch (error) {
        return NextResponse.json(
            { error: messages.error.generic },
            { status: 500 }
          );
    }
}