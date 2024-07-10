import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/utils/isValidEmail";
import User, { IUser, IUserSchema } from "@/models/User";
import { messages } from "@/utils/messages";
import { connectDB } from "@/libs/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// API route for user registration
//el nombre de la funcion debe ser como el metodo de las peticiones
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    //1- desestructuramos el body
    const { email, password, confirmPassword } = body;

    //2 -------------- VALIDACIONES -------------
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

    //3- hash de la contrasenia
    const hashedPassword = await bcrypt.hash(password, 10);

    //4- creamos el usuario
    const newUser: IUserSchema = new User({
      email,
      password: hashedPassword,
    });

    //@ts-ignore
    const { password: userPass, ...rest } = newUser._doc;

    //5- guardamos el usuario
    await newUser.save();

    //6- crear el token
    const token = jwt.sign({ data: rest }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    //7- devolvemos la respuesta
    const response = NextResponse.json(
      {
        newUser: rest,
        message: messages.success.userRegistered,
      },
      {
        status: 200,
      }
    );

    //8- seteamos el cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
    
  } catch (error) {
    return NextResponse.json(
      { error: messages.error.generic },
      { status: 500 }
    );
  }
}
