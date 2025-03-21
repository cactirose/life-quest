
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGameData } from "@/contexts/DataContext";
import { 
  HomeIcon, 
  UserCircle, 
  Scroll, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Palette, 
  ShoppingCart, 
  MapPin,
  Target,
  Award,
  Backpack,
  ListChecks,
  Smile,
  Flag,
  LogOut,
  Menu
} from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ThemeSettings } from "./ThemeSettings";
import { logout } from "@/utils/auth";
import { toast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  const {
    character
  } = useGameData();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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
  
  const StatusBar = () => (
    <div className="flex items-center gap-4 text-[hsl(var(--nav-text))] font-pixel">
      <span>Level: {character.level}</span>
      <span>XP: {character.xp}/{character.nextLevelXp}</span>
      <span>Coins: {character.coins}</span>
    </div>
  );

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-[hsl(var(--nav-text))] hover:bg-[hsl(var(--nav-hover))] border-none p-2 h-10 w-10 flex items-center justify-center"
        >
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="bg-[hsl(var(--nav-bg))] text-[hsl(var(--nav-text))] p-0 border-l border-[hsl(var(--nav-hover))]"
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-[hsl(var(--nav-hover))]">
            <h2 className="text-xl font-pixel mb-2">Life Quest</h2>
            <StatusBar />
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col space-y-1">
              {mobileMenuItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md font-pixel hover:bg-[hsl(var(--nav-hover))]",
                    location.pathname === item.path && "bg-[hsl(var(--nav-active))] text-[hsl(var(--nav-active-text))]"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <Button 
                variant="ghost" 
                className="flex w-full justify-start items-center gap-3 p-3 rounded-md font-pixel hover:bg-[hsl(var(--nav-hover))] h-auto text-[hsl(var(--nav-text))]"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </Button>
            </div>
          </ScrollArea>
          
          <div className="mt-auto p-4 border-t border-[hsl(var(--nav-hover))]">
            <ThemeSettings />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

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
            <NavigationMenu className="font-pixel hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem className="relative">
                  <Link to="/dashboard" className={cn(navigationMenuTriggerStyle(), 
                    "bg-[hsl(var(--nav-bg))] text-[hsl(var(--nav-text))] hover:bg-[hsl(var(--nav-hover))] border-none", 
                    location.pathname === "/dashboard" && "bg-[hsl(var(--nav-active))] text-[hsl(var(--nav-active-text))]")}>
                    <span className="flex items-center gap-1">
                      <HomeIcon size={20} />
                      <span className="hidden md:inline">Home</span>
                    </span>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem className="relative">
                  <Link to="/quests" className={cn(navigationMenuTriggerStyle(), 
                    "bg-[hsl(var(--nav-bg))] text-[hsl(var(--nav-text))] hover:bg-[hsl(var(--nav-hover))] border-none", 
                    location.pathname === "/quests" && "bg-[hsl(var(--nav-active))] text-[hsl(var(--nav-active-text))]")}>
                    <span className="flex items-center gap-1">
                      <Scroll size={20} />
                      <span className="hidden md:inline">Quests</span>
                    </span>
                  </Link>
                </NavigationMenuItem>
                
                {navStructure.map(item => (
                  <NavigationMenuItem key={item.label} className="relative">
                    <NavigationMenuTrigger className={cn(
                      "bg-[hsl(var(--nav-bg))] text-[hsl(var(--nav-text))] hover:bg-[hsl(var(--nav-hover))] border-none", 
                      location.pathname.startsWith(item.path) && "bg-[hsl(var(--nav-active))] text-[hsl(var(--nav-active-text))]")}>
                      <span className="flex items-center gap-1">
                        {item.icon}
                        <span className="hidden md:inline">{item.label}</span>
                      </span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="min-w-[220px]">
                      <ul className="grid w-full p-2 gap-1">
                        {item.subnav.map(subItem => (
                          <li key={subItem.path}>
                            <NavigationMenuLink asChild>
                              <Link to={subItem.path} className={cn(
                                "block select-none space-y-1 rounded-md p-3 text-[hsl(var(--nav-text))] no-underline outline-none transition-colors hover:bg-[hsl(var(--nav-hover))] hover:text-[hsl(var(--nav-text))]", 
                                location.pathname === subItem.path && "bg-[hsl(var(--nav-active))] text-[hsl(var(--nav-active-text))]")}>
                                <div className="flex items-center gap-2">
                                  {subItem.icon}
                                  <span className="text-sm font-medium">{subItem.label}</span>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
                
                <NavigationMenuItem className="relative">
                  <Link to="/shop" className={cn(navigationMenuTriggerStyle(), 
                    "bg-[hsl(var(--nav-bg))] text-[hsl(var(--nav-text))] hover:bg-[hsl(var(--nav-hover))] border-none", 
                    location.pathname === "/shop" && "bg-[hsl(var(--nav-active))] text-[hsl(var(--nav-active-text))]")}>
                    <span className="flex items-center gap-1">
                      <ShoppingCart size={20} />
                      <span className="hidden md:inline">Shop</span>
                    </span>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem className="relative">
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
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
          
          {isMobile && (
            <div className="flex items-center ml-auto z-50">
              <MobileMenu />
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
