"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Form } from "~/components/ui/form"
import { TextInput } from "~/app/admin/_components/text-input"
import { getPasswordStrength, getPasswordStrengthLabel } from "~/utils/password-strength"

// Form schema
const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9._-]+$/, "Username can only contain letters, numbers, dots, hyphens, and underscores")
    .refine(val => !val.includes(' '), "Username cannot contain spaces"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z
    .string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const { data: session, status } = useSession()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/admin/dashboard")
    }
  }, [status, session, router])

  const handleSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess("Account created successfully! You can now sign in.")
        // Reset form
        form.reset()
        // Redirect to sign in after 2 seconds
        setTimeout(() => {
          router.push("/auth/signin")
        }, 2000)
      } else {
        setError(result.error || "An error occurred during registration")
      }
    } catch (error) {
      setError("An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading if checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If authenticated, show redirecting message
  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <TextInput
                name="username"
                placeholder="Username"
                disabled={isLoading}
                onChange={(e) => {
                  // Remove spaces and update field
                  const value = e.target.value.replace(/\s/g, '');
                  // Update the form field manually
                  form.setValue("username", value);
                }}
              />
              <TextInput
                name="email"
                type="email"
                placeholder="Email"
                disabled={isLoading}
              />
              <TextInput
                name="password"
                type="password"
                placeholder="Password"
                disabled={isLoading}
                showPasswordToggle={true}
                renderDescription={(field) => {
                  const strength = getPasswordStrength(field.value || "");
                  const strengthInfo = getPasswordStrengthLabel(strength);

                  return (
                    <>
                      Password must contain at least 6 characters with uppercase,
                      lowercase, and number.
                      {field.value && (
                        <span
                          className={`ml-2 font-medium ${strengthInfo.color}`}
                        >
                          Strength: {strengthInfo.label}
                        </span>
                      )}
                    </>
                  );
                }}
              />
              <TextInput
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                disabled={isLoading}
                showPasswordToggle={true}
              />
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
              {success && (
                <p className="text-green-600 text-sm">{success}</p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
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
