import { z } from "zod";
import { createTRPCRouter, authenticatedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
// import { Resend } from 'resend';
import nodemailer from 'nodemailer';

/**
 * Email Service Configuration:
 * 1. Primary: Resend (requires RESEND_API_KEY)
 * 2. Fallback: Gmail (requires GMAIL_USER + GMAIL_APP_PASSWORD)
 * 3. Development: Console logging
 */

// const resend = new Resend(process.env.RESEND_API_KEY);

// Nodemailer transporter setup
const createEmailTransporter = () => {
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return null;
};

const sendEmailWithFallback = async (to: string, otp: string) => {
  const emailContent = {
    subject: 'Your verification code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Your verification code is:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #333; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `,
  };

  // Try Resend first
  // if (process.env.RESEND_API_KEY) {
  //   try {
  //     await resend.emails.send({
  //       from: 'Collections App <noreply@yourdomain.com>',
  //       to,
  //       ...emailContent,
  //     });
  //     console.log(`✅ OTP sent via Resend to ${to}: ${otp}`);
  //     return { method: 'resend', success: true };
  //   } catch (resendError) {
  //     console.error("❌ Resend failed:", resendError);
  //   }
  // }

  // Fallback to Gmail/Nodemailer
  const transporter = createEmailTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to,
        ...emailContent,
      });
      console.log(`✅ OTP sent via Gmail to ${to}: ${otp}`);
      return { method: 'gmail', success: true };
    } catch (gmailError) {
      console.error("❌ Gmail failed:", gmailError);
    }
  }

  // If both fail, just log for development
  console.log(`⚠️ Email services unavailable. OTP for ${to}: ${otp}`);
  return { method: 'console', success: false };
};

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

        // Send OTP via email with fallback
        const emailResult = await sendEmailWithFallback(ctx.session.user.email, otp);

        return {
          success: true,
          message: `OTP sent to your email address via ${emailResult.method}`,
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
