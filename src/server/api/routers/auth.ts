import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1),
  password: z.string().min(1),
});

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user already exists
        const existingUser = await ctx.db.users.findFirst({
          where: {
            OR: [
              { username: input.username },
              { email: input.email }
            ]
          }
        });

        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User with this username or email already exists",
          });
        }

        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "12");
        const hashedPassword = await bcrypt.hash(input.password, saltRounds);

        // Create user
        const user = await ctx.db.users.create({
          data: {
            username: input.username,
            email: input.email,
            password: hashedPassword,
            isVerified: false,
          },
          select: {
            id: true,
            username: true,
            email: true,
            isVerified: true,
            createdAt: true,
          }
        });

        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "JWT secret not configured",
          });
        }

        const token = jwt.sign(
          { 
            userId: user.id, 
            username: user.username,
            email: user.email 
          },
          jwtSecret,
          { expiresIn: "7d" }
        );

        return {
          user,
          token,
          message: "Account created successfully"
        };

      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create account",
        });
      }
    }),

  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Find user by username or email
        const user = await ctx.db.users.findFirst({
          where: {
            OR: [
              { username: input.usernameOrEmail },
              { email: input.usernameOrEmail }
            ]
          }
        });

        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials",
          });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(input.password, user.password);
        
        if (!isValidPassword) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials",
          });
        }

        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "JWT secret not configured",
          });
        }

        const token = jwt.sign(
          { 
            userId: user.id, 
            username: user.username,
            email: user.email 
          },
          jwtSecret,
          { expiresIn: "7d" }
        );

        return {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
          },
          token,
          message: "Login successful"
        };

      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Login failed",
        });
      }
    }),

  verifyToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "JWT secret not configured",
          });
        }

        const decoded = jwt.verify(input.token, jwtSecret) as {
          userId: number;
          username: string;
          email: string;
        };

        // Fetch fresh user data
        const user = await ctx.db.users.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            username: true,
            email: true,
            isVerified: true,
            createdAt: true,
          }
        });

        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not found",
          });
        }

        return { user, valid: true };

      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }
    }),
});
