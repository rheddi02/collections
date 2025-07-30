"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import { useAuth } from "~/contexts/AuthContext";

interface CredentialsLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const CredentialsLogin = ({ isOpen, onClose }: CredentialsLoginProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegister) {
        // Validation for registration
        if (formData.password !== formData.confirmPassword) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Passwords do not match",
          });
          setIsLoading(false);
          return;
        }

        // Simple register logic - in a real app, you'd call your API
        const success = await login(formData.email, formData.password);
        if (success) {
          toast({
            title: "Success",
            description: "Account created successfully",
          });
          onClose();
          router.push("/admin/dashboard");
        } else {
          throw new Error("Registration failed");
        }
      } else {
        // Login logic
        const success = await login(formData.usernameOrEmail, formData.password);
        if (success) {
          toast({
            title: "Success",
            description: "Logged in successfully",
          });
          onClose();
          router.push("/admin/dashboard");
        } else {
          throw new Error("Invalid credentials");
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isRegister ? "Create Account" : "Login"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {isRegister ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="usernameOrEmail">Username or Email</Label>
                  <Input
                    id="usernameOrEmail"
                    type="text"
                    placeholder="Enter your username or email"
                    required
                    value={formData.usernameOrEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usernameOrEmail: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Loading..."
                : isRegister
                  ? "Create Account"
                  : "Login"}
            </Button>
            <Button type="button" variant="ghost" onClick={toggleMode}>
              {isRegister
                ? "Already have an account? Login"
                : "Don't have an account? Sign up"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialsLogin;
