
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Shield, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { storeSession } from "@/utils/auth";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  // Check if the user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setHasSession(!!data.session);
    };
    
    checkSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple validation
      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      // Update password
      const { data, error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) throw error;
      
      // Store session
      storeSession(data.user ? data.session : null);
      
      setIsSuccess(true);
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated",
      });
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Password update error:", error);
      toast({
        title: "Password update failed",
        description: error instanceof Error ? error.message : "An error occurred when updating your password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasSession && !isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/50">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-pixel text-primary">Invalid Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6">
            <p className="mb-4">Please request a new password reset link</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate("/reset-password")}>Request New Link</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-pixel text-primary">
            {isSuccess ? "Password Updated" : "Create New Password"}
          </CardTitle>
          <CardDescription>
            {isSuccess ? "You can now log in with your new password" : "Enter and confirm your new password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSuccess ? (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⌛</span> Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Success!</h3>
              <p className="text-muted-foreground">
                Your password has been updated successfully.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Redirecting to dashboard...
              </p>
            </div>
          )}
        </CardContent>
        {!isSuccess && (
          <CardFooter className="flex justify-center">
            <Button variant="ghost" onClick={() => navigate("/login")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default UpdatePassword;
