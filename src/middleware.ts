import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

async function fetchWithAuth(endpoint: string, body: string) {
  const response = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  return response.json();
}

async function handleTokenRefresh(refreshToken: string) {
  try {
    const response = await fetchWithAuth('check', JSON.stringify({ refreshToken }));
    if (response.isAuthorized) {
      const res = NextResponse.next();
      res.cookies.set('sessionToken_cookie', response.sessionToken, {
        httpOnly: true,
        maxAge: 6 * 60 * 60, // 6 horas
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      return res;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
  return null;
}

export async function middleware(request: NextRequest) {
  try {
    //obtenemos los token de las cookies
    const sessionToken = request.cookies.get('sessionToken_cookie');
    const refreshToken = request.cookies.get('refreshToken_cookie');

    //si no hay sessionToken en la cookie es probable que haya expirado, por lo tanto creo otro
    if (!sessionToken) {
      if (refreshToken) {
        const res = await handleTokenRefresh(refreshToken.value);
        if (res) return res;
      }


      //si no hay refreshToken te mando al login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    //si hay sessionToken continuamos
    try {

      //verificamos que el token sea valido
      jwt.verify(sessionToken.value, process.env.JWT_SECRET as string);
      return NextResponse.next();

    } catch (error) {
      
      //si el token es invalido, creo otro. Solo si hay refreshToken
      if (refreshToken) {
        const res = await handleTokenRefresh(refreshToken.value);
        if (res) return res;
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: '/home',
};
