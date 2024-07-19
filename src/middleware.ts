import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import jwt from "jsonwebtoken";



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
      res.cookies.set('session_token', response.sessionToken, {
        httpOnly: true,
        maxAge: 6 * 60 * 60, // 6 horas
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
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
    const sessionToken = request.cookies.get('session_token');
    const refreshToken = request.cookies.get('refresh_token');

    if (!sessionToken) {
      if (refreshToken) {
        const res = await handleTokenRefresh(refreshToken.value);
        if (res) return res;
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      jwt.verify(sessionToken.value, process.env.JWT_SECRET as string);
      return NextResponse.next();
    } catch (error) {
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
  matcher: '/home'
}