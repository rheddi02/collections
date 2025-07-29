"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import useAppStore from "~/store/app.store";
import { api } from "~/trpc/react";

interface CredentialsLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const CredentialsLogin = ({ isOpen, onClose }: CredentialsLoginProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { setIsAuth } = useAppStore((state) => ({
    setIsAuth: state.setIsAuth,
  }));

  const loginMutation = api.auth.login.useMutation({
    onSuccess: (result) => {
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      setIsAuth(true);
      onClose();
      toast({
        title: "Success",
        description: result.message,
      });
      // Force page refresh to reinitialize tRPC client with new token
      window.location.href = "/admin/dashboard";
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const registerMutation = api.auth.register.useMutation({
    onSuccess: (result) => {
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      setIsAuth(true);
      onClose();
      toast({
        title: "Success",
        description: result.message,
      });
      // Force page refresh to reinitialize tRPC client with new token
      window.location.href = "/admin/dashboard";
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isRegister) {
      // Validation for registration
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      registerMutation.mutate({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
    } else {
      // Login
      loginMutation.mutate({
        usernameOrEmail: formData.usernameOrEmail,
        password: formData.password,
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setFormData({
      usernameOrEmail: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-2/3" hideCloseButton={true}>
        <DialogHeader className="text-left">
          <DialogTitle>{isRegister ? "Create Account" : "Login"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {isRegister ? (
              // Registration form
              <>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    required
                  />
                </div>
              </>
            ) : (
              // Login form
              <>
                <div className="grid gap-2">
                  <Label htmlFor="usernameOrEmail">Username or Email</Label>
                  <Input
                    id="usernameOrEmail"
                    type="text"
                    placeholder="Enter username or email"
                    value={formData.usernameOrEmail}
                    onChange={(e) =>
                      handleInputChange("usernameOrEmail", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter className="">
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between sm:gap-1">
              <div className="flex gap-2">
                <Button
                  disabled={isLoading}
                  type="submit"
                  className="flex items-center gap-2"
                >
                  {isLoading && <ReloadIcon className="animate-spin" />}
                  {isRegister ? "Create Account" : "Login"}
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={onClose}
                  className="flex items-center gap-2"
                  variant="secondary"
                  type="button"
                >
                  Cancel
                </Button>
              </div>
              <Button
                disabled={isLoading}
                onClick={switchMode}
                variant="ghost"
                type="button"
                className="self-end text-sm"
              >
                {isRegister
                  ? "Already have an account? Login"
                  : "Don't have an account? Register"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialsLogin;
