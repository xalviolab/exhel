import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Auth check for protected routes
    if (!session && (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/admin"))) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Admin check for admin routes
    if (session && req.nextUrl.pathname.startsWith("/admin")) {
      try {
        const { data: user } = await supabase.from("users").select("role").eq("id", session.user.id).single()

        if (!user || user.role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }
      } catch (error) {
        console.error("Admin kontrolü sırasında hata:", error)
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
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
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
