"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Form } from "~/components/ui/form"
import { TextInput } from "~/app/admin/_components/text-input"
import { toast } from "~/components/ui/use-toast"

const signInSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
})

type SignInFormValues = z.infer<typeof signInSchema>

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  })

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/admin/dashboard")
    }
  }, [status, session, router])

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        usernameOrEmail: data.usernameOrEmail,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Error",
          description: "Invalid credentials",
          variant: "destructive",
        })
      } else if (result?.ok) {
        toast({
          title: "Success",
          description: "Signed in successfully",
        })
        // Successful login - redirect to admin dashboard
        router.push("/admin/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during sign in",
        variant: "destructive",
      })
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
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your username/email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TextInput
                name="usernameOrEmail"
                label="Username or Email"
                placeholder="Enter your username or email"
                disabled={isLoading}
                required
              />

              <TextInput
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                disabled={isLoading}
                required
                showPasswordToggle
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-gray-600">
              <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                Forgot your password?
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
