import { connectDB } from "@/libs/mongodb";
import User, { IUser, IUserSchema } from "@/models/User";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { messages } from "@/utils/messages";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const headersList = headers();
    const confirmationToken = headersList.get("token");
    //si no existe token no puedo confirmar la cuenta
    if (!confirmationToken) {
      return NextResponse.json(
        { error: messages.error.userNotVerified },
        { status: 400 }
      );
    }

    try {
      //obtengo la info del token (email, password)
      const { data: confirmationTokenData } = jwt.verify(
        confirmationToken,
        process.env.JWT_SECRET as string
      ) as any;

      //si falta alguna info no puedo confirmar la cuenta
      if (!confirmationTokenData || !confirmationTokenData.email || !confirmationTokenData.password) {
        return NextResponse.json(
          { error: messages.error.invalidToken },
          { status: 400 }
        );
      }
      //desestructuro la info
      const { email, password, isConfirmed } = confirmationTokenData;

      //validamos que el usuario no este confirmado
      if (isConfirmed) {
        return NextResponse.json(
          { error: messages.error.userAlreadyVerified },
          { status: 400 }
        );
      }
      
      // creo el usuario
      const newUser: IUserSchema = new User({
        email,
        password,
        isConfirmed: true,
      });

      //@ts-ignore
      const { password: userPass, ...rest } = newUser._doc;

      //guardamos el usuario
      await newUser.save();

      
  
      //devolvemos la respuesta
      const response = NextResponse.json(
        {
          message: messages.success.userRegistered,
        },
        {
          status: 200,
        }
      );

      

      return response;
    } catch (error) {
      return NextResponse.json(
        { error: messages.error.invalidToken },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: messages.error.generic },
      { status: 500 }
    );
  }
}
