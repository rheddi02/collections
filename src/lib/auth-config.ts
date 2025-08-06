import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        usernameOrEmail: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.usernameOrEmail || !credentials?.password) {
          return null;
        }

        try {
          // Check if input is email or username
          const isEmail = credentials.usernameOrEmail.includes("@");

          // Find user in database by email or username
          const user = await db.users.findFirst({
            where: isEmail
              ? { email: credentials.usernameOrEmail }
              : { username: credentials.usernameOrEmail },
          });

          if (!user) {
            return null;
          }

          // Verify password hash
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.username || user.email,
            isVerified: user.isVerified,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isVerified = user.isVerified;
      } else if (token.id && token.isVerified === false) {
        // Only fetch from database if user is currently unverified
        // This way we can detect when they become verified
        try {
          const dbUser = await db.users.findUnique({
            where: { id: parseInt(token.id as string) },
            select: { isVerified: true },
          });
          if (dbUser) {
            token.isVerified = dbUser.isVerified;
          }
        } catch (error) {
          console.error("Error fetching user verification status:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isVerified = token.isVerified as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};
