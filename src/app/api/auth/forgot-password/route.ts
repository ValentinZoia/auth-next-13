import { connectDB } from "@/libs/mongodb";
import User, { IUser } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import { messages } from "@/utils/messages";
import { isValidEmail } from "@/utils/isValidEmail";
import { EmailTemplate } from "@/components/EmailTemplate/email-template";

interface BodyProps {
  email: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

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
      return NextResponse.json(
        { error: messages.error.userNotFound },
        { status: 404 }
      );
    }

    //validar que el usuario este verificado
    if (!userFind.isConfirmed) {
      return NextResponse.json(
        { error: messages.error.notConfirmedAccount },
        { status: 400 }
      );
    }

    // 3- creamos un objeto con el email y el id del usuario encontrado
    const resetPasswordTokenData = {
      email: userFind.email,
      _id: userFind._id,
    };

    // 3- generamos un token con el objeto de datos del usuario
    // el token sera firmado con la clave secreta definida en el archivo .env
    // y expirara en un dia
    const resetPasswordToken = jwt.sign(
      { data: resetPasswordTokenData },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "4h",
      }
    );

    // 4- generamos la URL de cambio de contraseña concatenando la URL de la app
    // con el token generado previamente y los datos del componente
    const forgetUrl: string = `http://localhost:3000/change-password?access_token=${resetPasswordToken}`;
    const title = "Reset your password";
    const description =
      "Follow the button to reset the password for your user.";
    const descriptionLink = "Reset password";

    // 5- enviamos el email al usuario con la URL de cambio de contraseña
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Change your password",
      react: EmailTemplate({
        buttonUrl: forgetUrl,
        title,
        description,
        descriptionLink,
      }) as React.ReactElement
    });

    if (error) {
      return NextResponse.json(
        { error: messages.error.generic },
        { status: 500 }
      );
    }

    //6- Devolvemos respusta exitosa
    return NextResponse.json(
      { message: messages.success.emailSent },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: messages.error.generic },
      { status: 500 }
    );
  }
}
