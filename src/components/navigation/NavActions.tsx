
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/utils/auth";
import { toast } from "@/components/ui/use-toast";

const NavActions = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout error",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      className="bg-[hsl(var(--nav-bg))] text-[hsl(var(--nav-text))] hover:bg-[hsl(var(--nav-hover))] border-none px-4 py-2 h-10"
      onClick={handleLogout}
    >
      <span className="flex items-center gap-1">
        <LogOut size={20} />
        <span className="hidden md:inline">Logout</span>
      </span>
    </Button>
  );
};

export default NavActions;
