"use client";
import { useSession } from "next-auth/react";
import CardTemplate from "~/app/admin/_components/card-template";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useNavigationLists } from "~/hooks/useNavigationLists";
import { InputOTPForm } from "../_components/otp-code";
import { useState } from "react";
import PageHeader from "../_components/page-header";
import useAppStore from "~/store/app.store";
import { isMobile } from "react-device-detect";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [isSent, setIsSent] = useState(false);
  const navList = useNavigationLists(); // Now reactive to category changes
  const { isLoading: isCategoriesLoading } = api.categories.listAll.useQuery();
  const { setOpenMenu, openMenu } = useAppStore((state) => ({
    setOpenMenu: state.setOpenMenu,
    openMenu: state.openMenu,
  }));
  const {
    data: counts,
    isFetching,
    error,
  } = api.links.count.useQuery(
    undefined, // No input needed - user context comes from NextAuth session
    {
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus
    },
  );

  const sendOTPMutation = api.auth.sendOTP.useMutation({
    onSuccess: () => {
      setIsSent(true);
    },
    onError: (error) => {
      console.error("Failed to send OTP:", error);
      alert("Failed to send OTP. Please try again.");
    },
  });

  const handleVerify = () => {
    sendOTPMutation.mutate();
  };

  // Show loading state while authentication is being checked
  if (status === "loading") {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!session?.user.isVerified) {
    return (
      <div className="flex h-screen flex-col items-center justify-center ">
        {isSent ? (
          <InputOTPForm onBack={() => setIsSent(false)} />
        ) : (
          <>
            <p className="my-5">Please verify your email to access features.</p>
            <Button
              variant={"default"}
              onClick={handleVerify}
              disabled={sendOTPMutation.isPending}
            >
              {sendOTPMutation.isPending ? "Sending..." : "Verify Now"}
            </Button>
          </>
        )}
      </div>
    );
  }

  if (status === "authenticated") {
    if (isCategoriesLoading) {
      return (
        <div className="flex h-screen flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading navigation...</p>
        </div>
      );
    }

    if (navList.length <= 1)
      return (
        <>
          <PageHeader setOpenMenu={() => setOpenMenu(!openMenu)} />
          <div className="flex h-screen flex-col items-center justify-center">
            <h1 className="mb-4 text-2xl font-bold">
              Welcome to the Dashboard
            </h1>
            <p className="mb-6 text-gray-600">
              You are logged in as {session.user.name}
            </p>
            <p>Create your first category</p>
            <Button
              variant="default"
              className="mt-4"
              onClick={() => (window.location.href = "/admin/categories")}
            >
              Create Category
            </Button>
            <p className="mt-4 text-sm text-gray-500">
              Note: You can manage categories and links from the admin panel.
            </p>
          </div>
        </>
      );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Failed to load dashboard data</p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="custom-scrollbar h-full overflow-auto">
      <div className="pl-5 pt-5 sm:hidden">
        <PageHeader setOpenMenu={() => setOpenMenu(!openMenu)} title="Dashboard" />
      </div>
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {navList
          .filter(
            ({ title }) => title !== "dashboard" && title !== "Categories",
          )
          .map(({ title, route }) => (
            <CardTemplate
              key={title}
              fetching={isFetching}
              count={
                counts?.find((count) => count.categoryName === title)?.count ??
                0
              }
              size={!isMobile ? "default" : "compact"}
              label={title}
              url={route}
            />
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
