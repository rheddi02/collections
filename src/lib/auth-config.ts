import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import crypto from "crypto";
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          const email = (profile as { email?: string } | null)?.email || user.email;
          if (!email) return false;

          // Find existing user by email
          let existingUser = await db.users.findUnique({ where: { email } });

          if (!existingUser) {
            // Generate a unique username from name or email
            const baseFromName = (user.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 20);
            const baseFromEmail = email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 20) || "user";
            const baseUsername = baseFromName || baseFromEmail || "user";

            let candidate = baseUsername;
            let suffix = 0;
            // Ensure username uniqueness
            // eslint-disable-next-line no-constant-condition
            while (true) {
              const found = await db.users.findUnique({ where: { username: candidate } });
              if (!found) break;
              suffix += 1;
              candidate = `${baseUsername}${suffix}`;
            }

            // Generate a secure random password to satisfy schema (unused for OAuth)
            const randomPassword = crypto.randomBytes(32).toString("hex");
            const hashedPassword = await bcrypt.hash(randomPassword, 12);

            existingUser = await db.users.create({
              data: {
                username: candidate,
                email,
                password: hashedPassword,
                isVerified: true,
              },
            });
          }

          // Pass our DB user id and verification to JWT via user object
          (user as any).id = existingUser.id.toString();
          (user as any).isVerified = existingUser.isVerified;
          (user as any).name = existingUser.username || user.name;
        }

        return true;
      } catch (err) {
        console.error("OAuth signIn error:", err);
        return false;
      }
    },
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
