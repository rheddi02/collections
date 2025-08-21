"use client";
import {
  CameraIcon,
  HamburgerMenuIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
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
import TextInput from "../_components/text-input";
import {
  getPasswordStrength,
  getPasswordStrengthLabel,
} from "~/utils/password-strength";
import { profileFormSchema, ProfileFormValues } from "~/utils/schemas";
import useAppStore from "~/store/app.store";

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
  const { setOpenMenu, openMenu } = useAppStore((state) => ({
    setOpenMenu: state.setOpenMenu,
    openMenu: state.openMenu,
  }));

  const { data, isFetching: isFetchingUser } = api.get.user.useQuery();

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
    // If user has no password (OAuth-only), instruct to set via reset flow
    if (data && !(data as any).hasPassword) {
      toast({
        title: "No password set",
        description:
          "This account uses Google sign-in only. Use 'Forgot password' to set a password.",
        variant: "destructive",
      });
      return;
    }
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

  return (
    <div className="h-full overflow-auto">
      <div className="relative flex h-80 items-center justify-center bg-muted">
        <Button
          className="absolute left-5 top-5 z-50 h-8 px-2 sm:hidden block"
          variant="outline"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <HamburgerMenuIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
        {data?.cover ? (
          <Image
            src={data.cover || ""}
            alt="cover"
            fill
            className="object-cover"
          />
        ) : (
          <CameraIcon className="h-10 w-10 text-muted-foreground" />
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-5 items-center md:items-start justify-center md:justify-start">
        <div className="-mt-28 md:ml-auto md:w-1/3 w-full flex lg:justify-end">
          <div className="relative flex h-60 w-60 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-muted mx-auto lg:mx-0">
            {data?.profile ? (
              <Image
                src={data.profile || ""}
                alt="profile"
                fill
                className="object-cover"
              />
            ) : (
              <CameraIcon className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="mt-5 flex flex-col items-center lg:items-start lg:ml-5 text-center lg:text-left w-full">
          <p className="text-2xl font-semibold tracking-tight text-foreground uppercase">{data?.username}</p>
          <p className="text-sm text-muted-foreground">{data?.email}</p>
          <div className="mt-3 flex gap-2 justify-center lg:justify-start">
            <span className="flex items-center gap-2 rounded-md border bg-muted/40 px-2 py-1 text-sm">
              {isFetchingUser ? (
                <UpdateIcon className="animate-spin" />
              ) : (
                <strong>{data?.linkCount}</strong>
              )} Links
            </span>
            <span className="flex items-center gap-2 rounded-md border bg-muted/40 px-2 py-1 text-sm">
              {isFetchingUser ? (
                <UpdateIcon className="animate-spin" />
              ) : (
                <strong>{data?.categoryCount}</strong>
              )} Categories
            </span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 w-full max-w-2xl rounded-md border bg-card p-4 md:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between">
              <p className="text-lg font-semibold text-foreground">Profile Settings</p>
              <div className="flex gap-2 flex-col-reverse md:flex-row">
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
                  variant={'outline'}
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
              description="This will be your display name. (Profile updates coming soon)"
            />

            {(data as any)?.hasPassword ? (
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
            ) : (
              <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                This account has no password set. Use the "Forgot password" flow on the sign-in page to set one.
              </div>
            )}

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
        <p className="my-5 text-center text-sm text-muted-foreground">
          Manage your profile settings and preferences here.
        </p>
      </div>
    </div>
  );
};

export default Profile;
