import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameData } from "@/contexts/DataContext";
import LoginForm from "@/features/auth/components/LoginForm";
import LoginFooter from "@/features/auth/components/LoginFooter";
import AuthLoader from "@/features/auth/components/AuthLoader";
import { useAuthCheck } from "@/features/auth/hooks/useAuthCheck";
import { useIsMobile } from "@/hooks/use-mobile";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail, KeyRound } from "lucide-react";
import { AuthCard } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { storeSession } from "@/utils/auth";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const {
    setGameData
  } = useGameData();
  const {
    authCheckDone
  } = useAuthCheck(navigate);
  const isMobile = useIsMobile();

  // Add state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Add handleLogin function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.session) {
        await storeSession(data.session);
        
        // Wait for session to be stored
        await new Promise(resolve => setTimeout(resolve, 300));
        
        toast.success("Login successful! Welcome back to Life Quest!");
        
        // Navigate to dashboard with replace
        navigate("/dashboard", { replace: true });
      } else {
        throw new Error("No session returned from login");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking auth
  if (!authCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-transparent">
        <AuthCard className="w-full max-w-md border-[var(--rpg-brown)]">
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--rpg-brown)] border-t-transparent rounded-full" />
            <p className="text-[var(--rpg-brown)]">
              {isMobile ? "Getting your adventure ready..." : "Checking authentication status..."}
            </p>
          </CardContent>
        </AuthCard>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-transparent">
      <AuthCard className="w-full max-w-md border-[var(--rpg-brown)]">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-pixel text-[var(--rpg-brown)]">
            Login
          </CardTitle>
          <CardDescription className="text-[var(--rpg-brown)] opacity-80">
            Enter your credentials to continue your quest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="auth-label">Email</Label>
              <div className="relative">
                <Mail className="auth-icon" />
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hero@example.com"
                  className="auth-input"
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="auth-label">Password</Label>
              <div className="relative">
                <KeyRound className="auth-icon" />
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  required 
                />
              </div>
            </div>
            <Button 
              className="auth-button" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⌛</span> Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center space-y-2">
            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
            <p className="auth-description">
              Don't have an account?{" "}
              <Link to="/signup" className="auth-link">
                Sign up
              </Link>
            </p>
            <Link to="/guest" className="auth-link block">
              Continue as Guest
            </Link>
          </div>
        </CardContent>
      </AuthCard>
    </div>
  );
};
export default Login;