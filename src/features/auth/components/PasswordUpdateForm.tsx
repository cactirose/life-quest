
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { storeSession } from "@/utils/auth";

type PasswordUpdateFormProps = {
  onSuccess: () => void;
};

const PasswordUpdateForm = ({ onSuccess }: PasswordUpdateFormProps) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated",
      });
      
      onSuccess();
      
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

  return (
    <>
      <CardContent>
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
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="ghost" onClick={() => navigate("/login")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Button>
      </CardFooter>
    </>
  );
};

export default PasswordUpdateForm;
