"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { OTPInput } from "./otp-input";
import { otpFormSchema, OtpFormValues } from "~/utils/schemas";

export function InputOTPForm({ onBack }: { onBack?: () => void }) {
  const { update } = useSession();
  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      pin: "",
    },
  });

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

  function onSubmit(data: OtpFormValues) {
    verifyOTPMutation.mutate({ otp: data.pin });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <OTPInput
          name="pin"
          label="One-Time Password"
          description="Please enter the one-time password sent to your email."
          disabled={verifyOTPMutation.isPending}
          required
          maxLength={6}
        />

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={
              form.watch("pin").length < 6 || verifyOTPMutation.isPending
            }
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
        </div>
      </form>
    </Form>
  );
}
