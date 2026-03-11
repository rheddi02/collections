import { Role } from "@/prisma/generated/enums"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: User
  }

  interface User {
    id: string
    email: string
    name: string
    profile?: string
    cover?: string
    isVerified: boolean
    role: Role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    isVerified: boolean
    role: string
  }
}
