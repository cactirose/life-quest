
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/AuthContext";
import { LoginFormSchema } from "@/features/auth/schemas/auth";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCharacter } from "@/contexts/CharacterContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { setCharacter } = useCharacter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
    try {
      setIsLoggingIn(true);
      
      const { email, password } = data;
      
      const { error } = await login(email, password);
      
      if (error) {
        console.error("Login error:", error);
        
        // Show specific message for invalid credentials
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
        return;
      }
      
      // Check if the character data exists
      try {
        const { data, error: characterError } = await supabase
          .from('characters')
          .select('*')
          .single();
        
        if (characterError || !data) {
          console.log("No character data found, first time login");
          // No need to do anything, the initialize_user_character trigger will create it
        } else {
          console.log("Character data found");
          if (setCharacter) {
            setCharacter(data);
          }
        }
      } catch (fetchError) {
        console.error("Error checking character data:", fetchError);
      }
      
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-10">
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-wide">Welcome Back</h1>
          <p className="text-sm">Sign in to your account to continue</p>
        </div>
        <div className="grid gap-6 bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                placeholder="name@example.com"
                autoComplete="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link
                  to="/reset-password"
                  className="text-xs text-primary underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoggingIn || authLoading}
            >
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
