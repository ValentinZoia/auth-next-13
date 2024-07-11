import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware (request: NextRequest) {
  try {
    //token guardado despues de hacer login
    const token = request.cookies.get('auth_cookie')

    //si no tengo token no puedo acceder a /home  
    //por lo tanto redirecciono a /login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const res = await fetch('http://localhost:3000/api/auth/check', {
      headers: {
        token: token.value
      }
    })

    const data = await res.json()
    
    // @ts-ignore
    if (!data.isAuthorized) {
      //si no estyo autenticado osea el token es invalido, redirecciono a /login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: '/home'
}