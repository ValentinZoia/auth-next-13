import { connectDB } from "@/libs/mongodb";
import User, { IUser, IUserSchema } from "@/models/User";
import TempUser, { ITempUser} from "@/models/TempUsers";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { messages } from "@/utils/messages";

interface BodyProps {
  otpCode: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    //obtenemos el body del front que es el codigo otp
    const body: BodyProps = await request.json();

    //1- destructuramos el body con el codigo otp que manda el usuario
    const { otpCode } = body;

    //2- Obtener el token de la cabecera de la solicitud HTTP
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
      //obtengo la info del token 
      const { data: confirmationTokenData } = jwt.verify(
        confirmationToken,
        process.env.JWT_SECRET as string
      ) as any;

      const {tempId} = confirmationTokenData;

      //buscar el usuario temporal
      const tempUser = await TempUser.findById(tempId);

      if(!tempUser){
        return NextResponse.json(
          { error: messages.error.userNotFound },
          { status: 400 }
        );
      }

      //validamos que el otp sea el correcto
      if (tempUser.otp !== otpCode) {
        return NextResponse.json(
          { error: messages.error.invalidOtp },
          { status: 400 }
        );
      }

      // creo el usuario
      const newUser: IUserSchema = new User({
        email: tempUser.email,
        password: tempUser.password,
        isConfirmed: true,
      });

      //@ts-ignore
      const { password: userPass, ...rest } = newUser._doc;

      //guardamos el usuario
      await newUser.save();

      //eliminamos el usuario temporal
      await TempUser.findByIdAndDelete(tempUser);

      //devolvemos la respuesta
      const response = NextResponse.json(
        {
          user: '',
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
