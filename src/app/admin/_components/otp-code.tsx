"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "~/trpc/react"
import { useSession } from "next-auth/react"

import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

export function InputOTPForm({ onBack }: { onBack?: () => void }) {
  const { update } = useSession();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  const verifyOTPMutation = api.auth.verifyOTP.useMutation({
    onSuccess: async () => {
      // Update the session to reflect the verified status
      await update();
      // The component will automatically re-render and show the dashboard
      // because the session.user.isVerified will now be true
    },
    onError: (error) => {
      form.setError("pin", {
        type: "manual",
        message: error.message,
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    verifyOTPMutation.mutate({ otp: data.pin });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={form.watch("pin").length < 6 || verifyOTPMutation.isPending}
        >
          {verifyOTPMutation.isPending ? "Verifying..." : "Submit"}
        </Button>
        
        {onBack && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
            disabled={verifyOTPMutation.isPending}
          >
            Request New Code
          </Button>
        )}
      </form>
    </Form>
  )
}
