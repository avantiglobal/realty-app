import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // El objeto de respuesta saliente se crea una vez y se puede modificar antes de ser devuelto.
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Bypass Supabase auth for local development
  if (process.env.FB_DEV === 'true') {
    return response
  }

  // Crea un cliente de Supabase configurado para usar cookies.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Las cookies de la solicitud se actualizan para que estén disponibles para los Server Components.
          request.cookies.set({ name, value, ...options })
          // Las cookies de la respuesta se actualizan para ser enviadas al navegador.
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // Las cookies de la solicitud se actualizan para que estén disponibles para los Server Components.
          request.cookies.set({ name, value: '', ...options })
          // Las cookies de la respuesta se actualizan para ser enviadas al navegador.
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Esto refrescará la sesión si ha expirado y actualizará las cookies.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!user && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Devuelve la respuesta con las cookies actualizadas.
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - and asset files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
