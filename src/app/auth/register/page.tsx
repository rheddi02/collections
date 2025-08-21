"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Form } from "~/components/ui/form"
import TextInput from "~/app/admin/_components/text-input"
import { getPasswordStrength, getPasswordStrengthLabel } from "~/utils/password-strength"
import { registerFormSchema, type RegisterFormValues } from "~/utils/schemas"

export default function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const { data: session, status } = useSession()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
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
              <div className="relative py-2 text-center">
                <span className="text-xs text-gray-500">or</span>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => signIn("google", { callbackUrl: "/admin/dashboard" })}
              >
                Continue with Google
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
