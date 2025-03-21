
import { Link, useNavigate } from "react-router-dom";
import { useGameData } from "@/contexts/DataContext";
import { 
  HomeIcon, 
  UserCircle, 
  Scroll, 
  Target,
  Award,
  Backpack,
  ListChecks,
  Smile,
  Flag,
  ShoppingCart,
  MapPin
} from "lucide-react";
import { ThemeSettings } from "./ThemeSettings";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileNavMenu from "./MobileNavMenu";
import StatusBar from "./navigation/StatusBar";
import DesktopNav from "./navigation/DesktopNav";
import { toast } from "@/components/ui/use-toast";
import { logout } from "@/utils/auth";

const Navbar = () => {
  const { character } = useGameData();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const navStructure = [
    {
      label: "Milestones",
      icon: <Target size={20} />,
      path: "/skills",
      subnav: [{
        label: "Skills",
        path: "/skills",
        icon: <Target size={18} />
      }, {
        label: "Achievements",
        path: "/achievements",
        icon: <Award size={18} />
      }]
    }, {
      label: "Character",
      icon: <UserCircle size={20} />,
      path: "/character",
      subnav: [{
        label: "Profile",
        path: "/character",
        icon: <UserCircle size={18} />
      }, {
        label: "Inventory",
        path: "/inventory",
        icon: <Backpack size={18} />
      }]
    }, {
      label: "Journey",
      icon: <MapPin size={20} />,
      path: "/habits",
      subnav: [{
        label: "Habits",
        path: "/habits",
        icon: <ListChecks size={18} />
      }, {
        label: "Mood",
        path: "/mood",
        icon: <Smile size={18} />
      }, {
        label: "Challenges",
        path: "/challenges",
        icon: <Flag size={18} />
      }]
    }
  ];

  const mobileMenuItems = [
    {
      label: "Home",
      icon: <HomeIcon size={20} />,
      path: "/dashboard"
    },
    {
      label: "Quests",
      icon: <Scroll size={20} />,
      path: "/quests"
    },
    {
      label: "Shop",
      icon: <ShoppingCart size={20} />,
      path: "/shop"
    },
    ...navStructure.flatMap(category => 
      category.subnav.map(item => ({
        label: item.label,
        icon: item.icon,
        path: item.path
      }))
    )
  ];

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--nav-bg))] shadow-md py-2">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <h1 className="text-xl font-pixel text-[hsl(var(--nav-text))]">Life Quest</h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <StatusBar />
          </div>
          
          {!isMobile && (
            <DesktopNav navStructure={navStructure} />
          )}
          
          {isMobile && (
            <div className="flex items-center ml-auto z-[100]">
              <MobileNavMenu 
                items={mobileMenuItems} 
                onLogout={handleLogout} 
                statusBar={<StatusBar />} 
              />
            </div>
          )}
          
          <div className="hidden md:block">
            <ThemeSettings />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
