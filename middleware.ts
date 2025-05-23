import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Eğer bu bir API isteği ise veya _next ile başlıyorsa, middleware'i atla
  if (req.nextUrl.pathname.startsWith('/api/') || 
      req.nextUrl.pathname.startsWith('/_next/') ||
      req.nextUrl.pathname.includes('.')) {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ 
    req, 
    res,
    options: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        cookieOptions: {
          maxAge: 30 * 24 * 60 * 60, // 30 gün
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        },
      },
    },
  })

  try {
    // Oturum bilgisini al
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Oturum bilgisi debug için loglama
    console.log(`Middleware: Path=${req.nextUrl.pathname}, Session=${session ? 'Var' : 'Yok'}`)

    // Korumalı rotalar için oturum kontrolü
    if (!session && (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/admin"))) {
      console.log(`Middleware: Oturum yok, /login'e yönlendiriliyor`)
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Admin rotaları için rol kontrolü
    if (session && req.nextUrl.pathname.startsWith("/admin")) {
      try {
        const { data: user } = await supabase.from("users").select("role").eq("id", session.user.id).single()

        if (!user || user.role !== "admin") {
          console.log(`Middleware: Admin değil, /dashboard'a yönlendiriliyor`)
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }
      } catch (error) {
        console.error("Admin kontrolü sırasında hata:", error)
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // Oturum açıkken login veya register sayfalarına erişim kontrolü
    if (session && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")) {
      console.log(`Middleware: Oturum açık, /dashboard'a yönlendiriliyor`)
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return res
  } catch (error) {
    console.error("Middleware auth hatası:", error)

    // Auth hatası durumunda, korumalı rotalar için login sayfasına yönlendir
    if (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    return res
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files (e.g. robots.txt)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
