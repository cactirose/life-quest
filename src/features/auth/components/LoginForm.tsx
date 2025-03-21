
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { KeyRound, Mail, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { storeSession } from "@/utils/auth";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple validation
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Store session for sync auth checks and token persistence
      if (data.session) {
        storeSession(data.session);
        
        // Wait a moment to make sure session is stored
        await new Promise(resolve => setTimeout(resolve, 300));
        
        toast.success("Login successful! Welcome back to Life Quest!");
        
        // Navigate to dashboard immediately - data loading will happen in background
        navigate("/dashboard");
      } else {
        throw new Error("No session returned from login");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Provide user-friendly error messages
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Please check your credentials and try again.";
        
      // Handle known error messages more gracefully
      let userMessage = errorMessage;
      if (errorMessage.includes("Invalid login")) {
        userMessage = "Invalid email or password. Please try again.";
      } else if (errorMessage.includes("network")) {
        userMessage = "Network error. Please check your internet connection.";
      }
      
      toast.error(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="hero@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
            autoComplete="email"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link 
            to="/reset-password" 
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
            autoComplete="current-password"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⌛</span> Logging in...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <LogIn className="h-4 w-4" /> Login
          </span>
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
