
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/utils/auth";
import { toast } from "sonner";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/"); // Redirect to index page after logout
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLogout}
      className="text-muted-foreground hover:text-foreground"
    >
      <LogOut className="h-4 w-4 mr-2" />
      <span className="sr-only md:not-sr-only">Logout</span>
    </Button>
  );
};

export default LogoutButton;
