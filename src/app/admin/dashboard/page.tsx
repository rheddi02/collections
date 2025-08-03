"use client";
import { useSession } from "next-auth/react";
import CardTemplate from "~/app/admin/_components/card";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useNavigationLists } from "~/utils/navigations";
import { InputOTPForm } from "../_components/otp-code";
import { useState } from "react";

const Dashboard = () => {
  const { data: session, update } = useSession();
  console.log("🚀 ~ Dashboard ~ session:", session)
  console.log("🚀 ~ Dashboard ~ isVerified:", session?.user?.isVerified)
  const [isSent, setIsSent] = useState(false);
  const navList = useNavigationLists(); // Now reactive to category changes
  
  const {
    data: counts,
    isFetching,
    error,
  } = api.count.links.useQuery(
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

  const forceVerifyMutation = api.auth.forceVerify.useMutation({
    onSuccess: async () => {
      await update();
      alert("User verified successfully!");
    },
    onError: (error) => {
      console.error("Failed to force verify:", error);
      alert("Failed to force verify. Please try again.");
    },
  });

  const handleVerify = () => {
    sendOTPMutation.mutate();
  };

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
            <Button 
              variant="outline" 
              onClick={() => update()}
              className="mt-2"
            >
              Refresh Status
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => forceVerifyMutation.mutate()}
              className="mt-2"
              disabled={forceVerifyMutation.isPending}
            >
              {forceVerifyMutation.isPending ? "Verifying..." : "Force Verify (Dev)"}
            </Button>
          </>
        )}
      </div>
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
    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {navList.map(({ title }) =>
        // exclude 'Categories' and Dashboard from the list
        title === "Categories" || title === "dashboard" ? null : (
          // Render card for each navigation item
          <CardTemplate
            key={title}
            fetching={isFetching}
            count={
              counts?.find((count) => count.categoryName === title)?.count ?? 0
            }
            label={title}
            url={
              title === "Categories"
                ? "/admin/categories"
                : `/admin/${title.toLowerCase()}`
            }
          />
        ),
      )}
    </div>
  );
};

export default Dashboard;
