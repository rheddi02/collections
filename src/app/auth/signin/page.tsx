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
import { toast } from "~/components/ui/use-toast"
import { signInSchema, type SignInFormValues } from "~/utils/schemas";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
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

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    await signIn("google", { callbackUrl: "/admin/dashboard" })
  }

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        usernameOrEmail: data.usernameOrEmail.trim(),
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-muted-foreground mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If authenticated, show redirecting message
  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-muted-foreground mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md border bg-card">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription className="text-muted-foreground">
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
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="relative py-2 text-center">
                <span className="text-xs text-muted-foreground">or</span>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
              >
                {isGoogleLoading ? "Signing in with Google..." : "Continue with Google"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              <Link href="/auth/forgot-password" className="text-primary hover:underline">
                Forgot your password?
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
