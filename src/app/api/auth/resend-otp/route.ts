import { EmailTemplate } from "@/components/EmailTemplate/email-template";
import { connectDB } from "@/libs/mongodb";
import TempUser from "@/models/TempUsers";
import { messages } from "@/utils/messages";
import { NextRequest, NextResponse, userAgent } from "next/server";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    //Buscar usuario
    const tempuser = await TempUser.findOne({ email });

    if (!tempuser) {
      return NextResponse.json(
        { error: messages.error.userNotFound },
        { status: 404 }
      );
    }
    //solo dejamos reenviar OTP 3 veces
    if (tempuser.otpAttempts >= 3) {
      return NextResponse.json(
        { error: messages.error.tooManyAttempts },
        { status: 400 }
      );
    }

    //Generar OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    //Actualizar datos
    tempuser.otp = newOtp;
    tempuser.otpAttempts += 1;
    await tempuser.save();

    //Creamos token de confirmacion de cuenta. Expira en 30 minutos
    const confirmationToken = jwt.sign(
        {
          data: {
           tempId: tempuser._id,
          },
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "30m",
        }
      );

    const { os,device } = userAgent(request)
    const deviceInfo = `${device.type || "Unknown"} on ${os.name || "Unknown"}`;

    //enviamos el email de confirmacion de cuenta a su email
    const confirmUrl: string = `${process.env.NEXT_PUBLIC_API_URL}/confirm-account?token=${confirmationToken}`;
    const title = "Register email verification";
    const description = `Hello ${email}. An email verification code request is detected by us.`;
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
        otpCode: newOtp,
        ip: "Unknown",
        location: "Unknown",
        device: deviceInfo,
      }) as React.ReactElement,
    });

    //si hay un error en el envio del email
    if (error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }


    //enviamos la response
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
