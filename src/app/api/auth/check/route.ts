import { messages } from "@/utils/messages";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    //recibimos el refresh token desde el middleware
    const { refreshToken } = await request.json();

    //verificamos que el refresh token exista
    if (!refreshToken) {
      return NextResponse.json(
        { error: messages.error.userNotVerified },
        { status: 400 }
      );
    }

    try {
      const isTokenValid = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);

      // @ts-ignore
      const { data } = isTokenValid;

      // Buscar el usuario en la base de datos por su ID
      const userFind = await User.findById(data._id);

      if (!userFind) {
        return NextResponse.json(
          { error: messages.error.userNotFound },
          { status: 404 }
        );
      }

      // Generar un nuevo sessionToken
      const sessionToken = jwt.sign(
        { data: { _id: userFind._id, email: userFind.email } },
        process.env.JWT_SECRET as string,
        { expiresIn: "6h" }
      );

      // Retornar la respuesta con el nuevo sessionToken y el estado de éxito
      return NextResponse.json(
        {
          isAuthorized: true,
          message: messages.success.userVerified,
          sessionToken
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: messages.error.invalidToken },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: messages.error.generic },
      { status: 500 }
    );
  }
}
