import { messages } from "@/utils/messages";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    await connectDB();
    const headerList = headers();
    const token = headerList.get("token");
    //valido que haya token
    if (!token) {
      return NextResponse.json({ error: messages.error.userNotVerified });
    }

    try {
      //verificar que el token sea valido
      const isTokenValid = jwt.verify(token, process.env.JWT_SECRET as string);

      // @ts-ignore
      const { data } = isTokenValid;

      //buscar el usuario en la base de datos por id. id guardado en el token
      const userFind = await User.findById(data._id);

      //validar que el usuario exista
      if (!userFind) {
        return NextResponse.json(
          { error: messages.error.userNotFound },
          { status: 404 }
        );
      }

      //Enviamos la reponse
      return NextResponse.json(
        { isAuthorized: true, message: messages.success.userVerified },
        { status: 200 }
      );
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
