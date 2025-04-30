import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, KeyRound, Mail, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, AuthCard } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { storeSession } from "@/utils/auth";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const {
        data
      } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simple validation
      if (!username || !email || !password) {
        throw new Error("Please fill in all fields");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Sign up with Supabase
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });
      if (error) throw error;

      // Store session for sync auth checks
      storeSession(data.session);
      toast({
        title: "Signup successful",
        description: "Welcome to Life Quest!"
      });

      // Navigate to dashboard - initial data will be created by triggers
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please check your information and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-transparent">
      <AuthCard className="w-full max-w-md border-[var(--rpg-brown)]">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-pixel text-[var(--rpg-brown)]">
            Sign Up
          </CardTitle>
          <CardDescription className="text-[var(--rpg-brown)] opacity-80">
            Create your account to begin your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="auth-label">Character Name</Label>
              <div className="relative">
                <User className="auth-icon" />
                <Input 
                  id="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="BraveHero"
                  className="auth-input"
                  required 
                />
              </div>
            </div>
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
              <p className="auth-description text-xs">
                Password must be at least 6 characters
              </p>
            </div>
            <Button 
              className="auth-button" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⌛</span> Creating Account...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="auth-description">
              Already have an account?{" "}
              <Link to="/login" className="underline hover:opacity-80">
                Login
              </Link>
            </p>
          </div>
        </CardContent>
      </AuthCard>
    </div>
  );
};

export default Signup;