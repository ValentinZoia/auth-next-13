import { connectDB } from "@/libs/mongodb";
import User, { IUser } from "@/models/User";
import { isValidEmail } from "@/utils/isValidEmail";
import { messages } from "@/utils/messages";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// API route for user login
//el nombre de la funcion debe ser como el metodo de las peticiones
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body: IUser = await request.json();

    //1- desestructuramos el body
    const { email, password } = body;

    //2 -------------- VALIDACIONES -------------
    //validamos que los campos no esten vacios
    if (!email || !password) {
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

    //Buscar al usuario en la base de datos poe email
    const userFind = await User.findOne({ email });

    //validar que exista el usuario
    if (!userFind) {
      return NextResponse.json(
        { error: messages.error.userNotFound },
        { status: 400 }
      );
    }

    //validar que el usuario este confirmado
    if (!userFind.isConfirmed) {
      return NextResponse.json(
        { error: messages.error.notConfirmedAccount },
        { status: 400 }
      );
    }

    //validar que las contrasenia sea la correcta
    const isCorrect: boolean = await bcrypt.compare(
      password,
      userFind.password
    );

    if (!isCorrect) {
      return NextResponse.json(
        { error: messages.error.invalidPassword },
        { status: 400 }
      );
    }

    //3- Obtener los datos de ese Usuario
    // Desestructuramos el objeto userFind._doc, excepto la propiedad password, y lo asignamos a la variable rest.
    // userFind._doc es un objeto que contiene todas las propiedades del usuario, excepto la contraseña, que está en una variable separada llamada password.
    // La sintaxis {password: userPass, ...rest} indica que queremos mantener la propiedad password como una variable separada, y que queremos asignar todas las demás propiedades al objeto rest.
    const { password: userPass, ...rest } = userFind._doc;

    /*4- crear el token con el cual el usuario inicia sesion y se mantiene logeado en un futuro
        crearemos un refreshToken para que el usuario pueda renovar su sesion
    */
    const sessionToken = jwt.sign({ data: rest }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    


    //5- devolvemos la respuesta
    const response = NextResponse.json(
      {
        message: messages.success.userLogged,
      },
      {
        status: 200,
      }
    );

     //6- seteamos el cookie
     response.cookies.set("auth_cookie", sessionToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });

    return response;


  } catch (error) {
    return NextResponse.json({error: messages.error.generic}, {status: 500});
    
  }
}
