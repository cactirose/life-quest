
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/utils/auth";
import { toast } from "sonner";
import { useState } from "react";

const LogoutButton = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      
      // Clear any local app state
      localStorage.removeItem("rpgProductivityData");
      
      // Navigate first, then show toast to avoid UI freeze
      navigate("/", { replace: true });
      
      // Show success message after a short delay to ensure navigation happens
      setTimeout(() => {
        toast.success("Logged out successfully");
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred while logging out. Please try again.");
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
