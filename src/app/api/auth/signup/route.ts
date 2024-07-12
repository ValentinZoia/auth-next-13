import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/utils/isValidEmail";
import User, { IUser, IUserSchema } from "@/models/User";
import { messages } from "@/utils/messages";
import { connectDB } from "@/libs/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/EmailTemplate/email-template";

const resend = new Resend(process.env.RESEND_API_KEY as string);

//el nombre de la funcion debe ser como el metodo de las peticiones
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // desestructuramos el body
    const { email, password, confirmPassword } = body;

    //-------------- VALIDACIONES -------------
    //validamos que los campos no esten vacios
    if (!email || !password || !confirmPassword) {
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

    //validar que las contrasenias coincidan
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: messages.error.passwordsDontMatch },
        { status: 400 }
      );
    }

    //validar que la contrasenia tenga al menos 8 caracteres
    if (password.length < 8) {
      return NextResponse.json(
        { error: messages.error.passwordSmall },
        { status: 400 }
      );
    }

    //validar que la contrasenia tenga al menos un numero
    if (!password.match(/\d/)) {
      return NextResponse.json(
        { error: messages.error.passwordNoNumber },
        { status: 400 }
      );
    }

    //validar que no exista un usuario con ese email
    const userFind = await User.findOne({ email });

    if (userFind) {
      return NextResponse.json(
        { error: messages.error.userEmailExists },
        { status: 400 }
      );
    }

    // hash de la contrasenia
    const hashedPassword = await bcrypt.hash(password, 10);

    //creo un codigo OTP de 6 digitos
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //Creamos token de confirmacion de cuenta. Expira en 30 minutos
    const confirmationToken = jwt.sign(
      { data: { 
        email, 
        password: hashedPassword, 
        isConfirmed: false,
        otp: otp,        
        }
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "30m",
      }
    );

    //enviamos el email de confirmacion de cuenta a su email
    const confirmUrl: string = `http://localhost:3000/confirm-account?token=${confirmationToken}`;
    const title = "Confirm your account";
    const description =
      "Thank you for signing up! To confirm your account, please follow the button below.";
    const descriptionLink = "Confirm account";

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Confirm your account",
      react: EmailTemplate({
        buttonUrl: confirmUrl,
        title,
        description,
        descriptionLink,
        otpCode: otp,
      }),
      html: `
      <h2>Confirm your account</h2>
      <p>Introduce este código o haz clic en el botón a continuación para confirmar tu email.</p>
      <h1>${otp}</h1>                
      <a href="${confirmUrl}">Cambia tu contraseña</a>
      `,
    });

    //si hay un error en el envio del email
    if (error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }

    //Si todo esta bien devolvemos la respuesta
    const response = NextResponse.json(
      {
        isAuthorized: false,
        message: messages.success.emailSent,
      },
      {
        status: 200,
      }
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: messages.error.generic },
      { status: 500 }
    );
  }
}
