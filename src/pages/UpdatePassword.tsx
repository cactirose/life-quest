
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Shield, ArrowLeft, Check, AlertCircle } from "lucide-react";
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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if the user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsCheckingAuth(true);
        const { data } = await supabase.auth.getSession();
        console.log("Auth session check:", data.session ? "Session exists" : "No session");
        setHasSession(!!data.session);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change event:", event);
      setHasSession(!!session);
    });
    
    return () => subscription.unsubscribe();
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
      
      // Get the current session after password update
      const { data: sessionData } = await supabase.auth.getSession();
      
      // Store session
      storeSession(sessionData.session);
      
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

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/50">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-pixel text-primary">Checking Auth Status</CardTitle>
            <CardDescription>
              Please wait while we verify your session...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <div className="animate-spin text-3xl">⌛</div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className="mx-auto bg-destructive/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
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
