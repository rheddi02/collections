"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Form } from "~/components/ui/form"
import TextInput from "~/app/admin/_components/text-input"
import { OTPInput } from "~/app/admin/_components/otp-input"
import { toast } from "~/components/ui/use-toast"
import { api } from "~/trpc/react"
import { getPasswordStrength, getPasswordStrengthLabel } from "~/utils/password-strength"
import { 
  forgotPasswordEmailSchema, 
  resetPasswordSchema,
  type ForgotPasswordEmailValues,
  type ResetPasswordValues 
} from "~/utils/schemas"

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "reset">("email")
  const [email, setEmail] = useState("")

  const emailForm = useForm<ForgotPasswordEmailValues>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: {
      email: "",
    },
  })

  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const sendOtpMutation = api.auth.sendPasswordResetOTP.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Reset Code Sent",
          description: data.message,
        })
        setStep("reset")
        resetForm.setValue("email", email)
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const resetPasswordMutation = api.auth.resetPasswordWithOTP.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
        // Redirect to sign in after successful reset
        window.location.href = "/auth/signin"
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const onEmailSubmit = async (data: ForgotPasswordEmailValues) => {
    setEmail(data.email)
    sendOtpMutation.mutate({ email: data.email })
  }

  const onResetSubmit = async (data: ResetPasswordValues) => {
    resetPasswordMutation.mutate({
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {step === "email" ? "Forgot Password" : "Reset Password"}
          </CardTitle>
          <CardDescription>
            {step === "email" 
              ? "Enter your email address and we'll send you a verification code to reset your password"
              : "Enter the verification code sent to your email and your new password"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <TextInput
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  disabled={sendOtpMutation.isPending}
                  required
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={sendOtpMutation.isPending}
                >
                  {sendOtpMutation.isPending ? "Sending..." : "Send Reset Code"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                <TextInput
                  name="email"
                  label="Email Address"
                  type="email"
                  disabled={true}
                  description="This field is pre-filled and cannot be changed"
                />

                <OTPInput
                  name="otp"
                  label="Verification Code"
                  disabled={resetPasswordMutation.isPending}
                  description="Check your email for the 6-digit verification code"
                  required
                  maxLength={6}
                />

                <TextInput
                  name="newPassword"
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  disabled={resetPasswordMutation.isPending}
                  required
                  showPasswordToggle
                  renderDescription={(field) => {
                    const strength = getPasswordStrength(field.value || "");
                    const strengthInfo = getPasswordStrengthLabel(strength);
                    
                    return (
                      <>
                        Password must contain at least 6 characters with uppercase, lowercase, and number.
                        {field.value && (
                          <span className={`ml-2 font-medium ${strengthInfo.color}`}>
                            Strength: {strengthInfo.label}
                          </span>
                        )}
                      </>
                    );
                  }}
                />

                <TextInput
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm your new password"
                  description="Re-enter your new password to confirm."
                  disabled={resetPasswordMutation.isPending}
                  required
                  showPasswordToggle
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("email")}
                    disabled={resetPasswordMutation.isPending}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/auth/signin" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
