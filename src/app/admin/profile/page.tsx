"use client";
import { CameraIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { TextInput } from "../_components/text-input";

// Zod schema for form validation
const profileFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(50, "Name must be less than 50 characters")
      .optional(),
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { data: session } = useSession();
  const { toast } = useToast();

  // Initialize form with react-hook-form and Zod validation
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: session?.user.name,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { data, isFetching: countFetching } = api.profile.getCount.useQuery();

  // Update password mutation
  const changePasswordMutation = api.auth.changePassword.useMutation({
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update password: " + error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    changePasswordMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  const handleClearForm = () => {
    form.reset({
      name: session?.user.name,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { label: "Very Weak", color: "text-red-500" };
      case 2:
        return { label: "Weak", color: "text-orange-500" };
      case 3:
        return { label: "Fair", color: "text-yellow-500" };
      case 4:
        return { label: "Good", color: "text-blue-500" };
      case 5:
        return { label: "Strong", color: "text-green-500" };
      default:
        return { label: "", color: "" };
    }
  };
  return (
    <div className="overflow-auto h-full">
      <div className="relative flex h-80 items-center justify-center bg-gray-200">
        {session?.user.cover ? (
          <Image
            src={session?.user.cover || ""}
            alt="cover"
            fill
            className="object-cover"
          />
        ) : (
          <CameraIcon className="h-10 w-10" />
        )}
      </div>
      <div className="flex gap-5">
        <div className="-mt-28 w-1/4">
          <div className="relative ml-auto flex h-60 w-60 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-300">
            {session?.user.profile ? (
              <Image
                src={session?.user.profile || ""}
                alt="profile"
                fill
                className="object-cover"
              />
            ) : (
              <CameraIcon className="h-10 w-10" />
            )}
          </div>
        </div>
        <div className="mt-5">
          <p className="text-2xl font-bold uppercase">{session?.user.name}</p>
          <p>{session?.user.email}</p>
          <div className="mt-2 flex gap-5">
            <span className="flex items-center gap-2">
              {" "}
              {countFetching ? (
                <UpdateIcon className="animate-spin" />
              ) : (
                <strong>{data?.totalLinks}</strong>
              )}{" "}
              Links
            </span>
            <span className="flex items-center gap-2">
              {" "}
              {countFetching ? (
                <UpdateIcon className="animate-spin" />
              ) : (
                <strong>{data?.totalCategory}</strong>
              )}{" "}
              Categories
            </span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 w-3/4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-between">
              <p className="text-lg font-semibold">Profile Settings</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearForm}
                  disabled={changePasswordMutation.isPending}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending
                    ? "Updating..."
                    : "Update Password"}
                </Button>
              </div>
            </div>
            <TextInput
              name="name"
              label="Name"
              disabled={changePasswordMutation.isPending}
              placeholder={session?.user.name || "Update your name"}
              description="This will be your display name."
            />

            <TextInput
              name="currentPassword"
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
              description="Enter your current password to confirm identity."
              disabled={changePasswordMutation.isPending}
              required
              showPasswordToggle
            />

            <TextInput
              name="newPassword"
              label="New Password"
              type="password"
              placeholder="Enter new password"
              disabled={changePasswordMutation.isPending}
              required
              showPasswordToggle
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
              label="Confirm New Password"
              type="password"
              placeholder="Confirm your new password"
              description="Re-enter your new password to confirm."
              disabled={changePasswordMutation.isPending}
              required
              showPasswordToggle
            />
          </form>
        </Form>
        <p className="my-5 text-center text-sm text-gray-600">
          Manage your profile settings and preferences here.
        </p>
      </div>
    </div>
  );
};

export default Profile;
