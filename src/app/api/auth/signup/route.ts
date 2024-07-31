import { NextRequest, NextResponse, userAgent } from "next/server";
import { isValidEmail } from "@/utils/isValidEmail";
import User, { IUser, IUserSchema } from "@/models/User";
import TempUser, { ITempUser } from "@/models/TempUsers";
import { Types } from "mongoose";
import { messages } from "@/utils/messages";
import { connectDB } from "@/libs/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/EmailTemplate/email-template";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    //validar que no exista un usuario temporal con ese email
    const tempUserFind = await TempUser.findOne({ email });
    
    //si existe lo elimino
    if (tempUserFind) {
      await TempUser.findByIdAndDelete(tempUserFind)
    }

    // hash de la contrasenia
    const hashedPassword = await bcrypt.hash(password, 10);

    //creo un codigo OTP de 6 digitos
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Genera un nuevo ObjectId
    const tempId = new Types.ObjectId();

    // expira luego de 30min
    const thirtyMinutesFromNow = new Date(Date.now() + 30 * 60 * 1000);

    // Crea el usuario temporal
    const newTempUser = new TempUser({
      email,
      password: hashedPassword,
      otp: otp,
      otpAttempts: 0,
      expireAt: thirtyMinutesFromNow,
    });

    // Asigna el _id 
    newTempUser._id = tempId;

    // Guarda el usuario temporal
    await newTempUser.save();

    //Creamos token de confirmacion de cuenta. Expira en 30 minutos
    const confirmationToken = jwt.sign(
      {
        data: {
          tempId: tempId.toString(),
        },
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "30m",
      }
    );

    const { os, device } = userAgent(request);
    const deviceInfo = `${device.type || "Unknown"} on ${os.name || "Unknown"}`;

    //enviamos el email de confirmacion de cuenta a su email
    const confirmUrl: string = `${process.env.NEXT_PUBLIC_API_URL}/confirm-account?token=${confirmationToken}`;
    const title = "Register email verification";
    const description = `Hello ${email}. An email verification code request is detected by us`;
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
        ip: "Unknown",
        location: "Unknown",
        device: deviceInfo,
      }) as React.ReactElement,
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
