import { z } from "zod";
import { createTRPCRouter, authenticatedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  sendOTP: authenticatedProcedure
    .mutation(async ({ ctx }) => {
      try {
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP in database with expiration time (10 minutes)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        
        await ctx.db.users.update({
          where: { id: parseInt(ctx.session.user.id) },
          data: {
            verificationCode: otp,
            verificationCodeExpires: expiresAt,
          },
        });

        // In a real application, you would send the OTP via email here
        // For now, we'll just log it (remove this in production)
        console.log(`OTP for ${ctx.session.user.email}: ${otp}`);
        
        // TODO: Implement actual email sending
        // await sendEmail({
        //   to: ctx.session.user.email,
        //   subject: "Your verification code",
        //   text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
        // });

        return {
          success: true,
          message: "OTP sent to your email address",
        };
      } catch (error) {
        console.error("Error sending OTP:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send OTP. Please try again.",
        });
      }
    }),

  verifyOTP: authenticatedProcedure
    .input(z.object({
      otp: z.string().length(6, "OTP must be exactly 6 digits"),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await ctx.db.users.findUnique({
          where: { id: parseInt(ctx.session.user.id) },
          select: {
            verificationCode: true,
            verificationCodeExpires: true,
            isVerified: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        if (user.isVerified) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User is already verified",
          });
        }

        if (!user.verificationCode || !user.verificationCodeExpires) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No verification code found. Please request a new one.",
          });
        }

        if (new Date() > user.verificationCodeExpires) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Verification code has expired. Please request a new one.",
          });
        }

        if (user.verificationCode !== input.otp) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid verification code. Please try again.",
          });
        }

        // Mark user as verified and clear the verification code
        await ctx.db.users.update({
          where: { id: parseInt(ctx.session.user.id) },
          data: {
            isVerified: true,
            verificationCode: null,
            verificationCodeExpires: null,
          },
        });

        return {
          success: true,
          message: "Email verified successfully!",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Error verifying OTP:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to verify OTP. Please try again.",
        });
      }
    }),
});
