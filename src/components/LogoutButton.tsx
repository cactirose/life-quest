import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/utils/auth";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const LogoutButton = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // First clear the session from Supabase
      await supabase.auth.signOut();
      
      // Clear any local app state
      localStorage.removeItem("rpgProductivityData");
      
      // Clear the session
      await logout();
      
      // Use replace to prevent back button issues
      navigate("/", { replace: true });
      
      // Show success message after navigation
      setTimeout(() => {
        toast.success("Logged out successfully");
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred while logging out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="text-muted-foreground hover:text-foreground"
    >
      <LogOut className="h-4 w-4 mr-2" />
      <span className="sr-only md:not-sr-only">
        {isLoggingOut ? "Logging out..." : "Logout"}
      </span>
    </Button>
  );
};

export default LogoutButton;
