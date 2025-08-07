import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Add any additional logic here if needed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated
        if (!token) {
          return false
        }
        
        // Add additional authorization logic here if needed
        // For example, role-based access control
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    // Protect all admin routes
    '/admin/:path*',
    // Protect API routes if needed
    '/api/admin/:path*',
    // Add other protected routes as needed
  ]
}
