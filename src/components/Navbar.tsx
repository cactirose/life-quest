
import { Link, useLocation } from "react-router-dom";
import { useGameData } from "@/contexts/DataContext";
import { 
  HomeIcon,
  UserCircle, 
  Scroll, 
  Settings,
  BarChart,
  ChevronDown,
  ChevronUp,
  Palette,
  Milestone,
  ShoppingCart,
  MapPin
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ThemeSettings } from "./ThemeSettings";

const Navbar = () => {
  const { character } = useGameData();
  const location = useLocation();
  
  const navStructure = [
    {
      label: "Milestones",
      icon: <Milestone size={20} />,
      path: "/skills",
      subnav: [
        { label: "Skills", path: "/skills", icon: <BarChart size={18} /> },
        { label: "Achievements", path: "/achievements", icon: <BarChart size={18} /> }
      ]
    },
    {
      label: "Character",
      icon: <UserCircle size={20} />,
      path: "/character",
      subnav: [
        { label: "Profile", path: "/character", icon: <UserCircle size={18} /> },
        { label: "Inventory", path: "/inventory", icon: <BarChart size={18} /> }
      ]
    },
    {
      label: "Journey",
      icon: <MapPin size={20} />,
      path: "/habits",
      subnav: [
        { label: "Habits", path: "/habits", icon: <BarChart size={18} /> },
        { label: "Mood", path: "/mood", icon: <BarChart size={18} /> },
        { label: "Challenges", path: "/challenges", icon: <BarChart size={18} /> }
      ]
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-rpg-brown shadow-md py-2">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <HomeIcon size={24} className="text-rpg-tan" />
            <h1 className="text-xl font-pixel text-rpg-tan">Life Quest</h1>
          </Link>
          
          {/* Status Bar */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-rpg-tan font-pixel">
              <span>Level: {character.level}</span>
              <span>XP: {character.xp}/{character.nextLevelXp}</span>
              <span>Coins: {character.coins}</span>
            </div>
          </div>
          
          {/* Navigation */}
          <NavigationMenu className="font-pixel">
            <NavigationMenuList>
              {/* Home page */}
              <NavigationMenuItem>
                <Link 
                  to="/dashboard" 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-rpg-tan hover:bg-rpg-dark-wood bg-rpg-brown border-none",
                    location.pathname === "/dashboard" && "bg-rpg-dark-wood"
                  )}
                >
                  <span className="flex items-center gap-1">
                    <HomeIcon size={20} />
                    <span className="hidden md:inline">Home</span>
                  </span>
                </Link>
              </NavigationMenuItem>
              
              {/* Quests standalone page */}
              <NavigationMenuItem>
                <Link
                  to="/quests"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-rpg-tan hover:bg-rpg-dark-wood bg-rpg-brown border-none",
                    location.pathname === "/quests" && "bg-rpg-dark-wood"
                  )}
                >
                  <span className="flex items-center gap-1">
                    <Scroll size={20} />
                    <span className="hidden md:inline">Quests</span>
                  </span>
                </Link>
              </NavigationMenuItem>
              
              {/* Dropdown menus */}
              {navStructure.map((item) => (
                <NavigationMenuItem key={item.label} className="relative group">
                  <NavigationMenuTrigger 
                    className="text-rpg-tan hover:bg-rpg-dark-wood bg-rpg-brown border-none"
                  >
                    <span className="flex items-center gap-1">
                      {item.icon}
                      <span className="hidden md:inline">{item.label}</span>
                    </span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[220px] p-2 bg-rpg-brown border border-rpg-tan/30">
                      {item.subnav.map((subItem) => (
                        <li key={subItem.path}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={subItem.path}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 text-rpg-tan no-underline outline-none transition-colors hover:bg-rpg-dark-wood",
                                location.pathname === subItem.path && "bg-rpg-dark-wood"
                              )}
                            >
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
              
              {/* Shop standalone page */}
              <NavigationMenuItem>
                <Link 
                  to="/shop" 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-rpg-tan hover:bg-rpg-dark-wood bg-rpg-brown border-none",
                    location.pathname === "/shop" && "bg-rpg-dark-wood"
                  )}
                >
                  <span className="flex items-center gap-1">
                    <ShoppingCart size={20} />
                    <span className="hidden md:inline">Shop</span>
                  </span>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Theme Settings */}
          <div className="flex items-center">
            <ThemeSettings />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
