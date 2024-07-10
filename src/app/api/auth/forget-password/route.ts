import { connectDB } from "@/libs/mongodb";
import User, { IUser } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import { messages } from "@/utils/messages";
import { isValidEmail } from "@/utils/isValidEmail";


interface BodyProps {
  email: string;
}


const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    //obtenemos el body del front
    const body: BodyProps = await request.json();

    //1- destructuramos el body
    const { email } = body;

    //2 -------------- VALIDACIONES -------------
    //validamos que los campos no esten vacios
    if (!email) {
      return NextResponse.json(
        { error: messages.error.needProps },
        { status: 400 }
      );
    }

    //validar que el email sea valido
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: messages.error.invalidEmail },
        { status: 400 }
      );
    }

    //Buscar el usuario en la base de datos poe email y validar que exista
    const userFind = await User.findOne({ email });
    if (!userFind) {
      return NextResponse.json({ error: messages.error.userNotFound }, { status: 404 });
    }

    // 3- creamos un objeto con el email y el id del usuario encontrado
    const tokenData = {
      email: userFind.email,
      id: userFind._id,
    };

    // 3- generamos un token con el objeto de datos del usuario
    // el token sera firmado con la clave secreta definida en el archivo .env
    // y expirara en un dia
    const token = jwt.sign(
      { data: tokenData },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    // 4- generamos la URL de cambio de contraseña concatenando la URL de la app
    // con el token generado previamente
    const forgetUrl = `http://localhost:3000/change-password?token=${token}`;


    // 5- enviamos el email al usuario con la URL de cambio de contraseña
    await resend
      .emails
      .send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Cambio de contraseña",
        html: `
        <h1>Hola ${userFind.email},</h1>
        <p>Para cambiar tu contraseña, haz click en el siguiente enlace:</p>                
        <a href="${forgetUrl}">Cambia tu contraseña</a>
        `,
      });

      //6- Devolvemos respusta exitosa
    return NextResponse.json({ message: messages.success.emailSent}, { status: 200 });



  } catch (error) {
    return NextResponse.json(
        { error: messages.error.generic },
        { status: 500 }
      );
  }
}
