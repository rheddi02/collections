import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: User
  }

  interface User {
    id: string
    email: string
    name?: string
    profile?: string
    cover?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}
