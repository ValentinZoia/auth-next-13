import { connectDB } from "@/libs/mongodb";
import { messages } from "@/utils/messages";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import bcrypt from "bcryptjs";

interface BodyProps {
  newPassword: string;
  confirmPassword: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    //obtenemos el body del front
    const body: BodyProps = await request.json();

    //1- destructuramos el body
    const { newPassword, confirmPassword } = body;

    //2 -------------- VALIDACIONES -------------
    //validamos que los campos no esten vacios
    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: messages.error.needProps },
        { status: 400 }
      );
    }

    //validar que la contrasenia tenga al menos 8 caracteres
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: messages.error.passwordSmall },
        { status: 400 }
      );
    }

    //validar que la contrasenia tenga al menos un numero
    if (!newPassword.match(/\d/)) {
      return NextResponse.json(
        { error: messages.error.passwordNoNumber },
        { status: 400 }
      );
    }

    // 3- Obtener el token de la cabecera de la solicitud HTTP
    // headers() devuelve un objeto con todas las cabeceras de la solicitud
    // get() busca una cabecera y devuelve su valor
    // En este caso, estamos buscando la cabecera 'token'
    const headersList = headers();
    const token = headersList.get("token");

    //4 - verificar que haya token
    if (!token) {
      return NextResponse.json(
        { error: messages.error.userNotVerified },
        { status: 400 }
      );
    }

    try {
      //5- verificar que el token sea valido
      const isTokenValid = jwt.verify(token, "secreto");

      // @ts-ignore
      const { data } = isTokenValid;

      // 6- buscar el usuario en la base de datos por id
      const userFind = await User.findById(data.id);

      //7- validar que el usuario exista
      if (!userFind) {
        return NextResponse.json(
          { error: messages.error.userNotFound },
          { status: 404 }
        );
      }

      //validar que las contrasenias coincidan
      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: messages.error.passwordsDontMatch },
          { status: 400 }
        );
      }

      //6-encriptar la contrasenia
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      //7- actualizar la contrasenia del usuario
      const userUpdate = await User.findByIdAndUpdate(data.id, {
        password: hashedPassword,
      });

      if (!userUpdate) {
        return NextResponse.json(
          { error: messages.error.userNotFound },
          { status: 404 }
        );
      }

      //8- guardar el usuario en la base de datos
      await userUpdate.save();

      //9- devolver una respuesta exitosa
      return NextResponse.json(
        { message: messages.success.passwordChanged },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json({ error: token }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: messages.error.generic },
      { status: 500 }
    );
  }
}
