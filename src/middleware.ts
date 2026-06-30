import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Super-admin panel: SUPER_ADMIN only
    if (pathname.startsWith('/super-admin')) {
      if (token?.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url))
      }
    }

    // Admin workspace: SUPER_ADMIN has no access here
    if (pathname.startsWith('/admin') && token?.role === 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL("/super-admin/dashboard", req.url))
    }

    const isVerified = token?.isVerified === true

    // Unverified users are restricted within /admin
    if (pathname.startsWith('/admin') && !isVerified) {
      const allowedRoutes = ["/admin/dashboard", "/admin/profile"]
      const isAllowed = allowedRoutes.some(route => pathname.startsWith(route))
      if (!isAllowed) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url))
      }
    }

    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/super-admin/:path*',
    '/api/admin/:path*',
  ]
}
