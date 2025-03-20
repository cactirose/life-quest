
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGameData } from "@/contexts/DataContext";
import { 
  HomeIcon,
  UserCircle, 
  Scroll, 
  Settings,
  LayoutDashboard,
  BarChart,
  ChevronDown,
  ChevronUp,
  Palette
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
      label: "Home",
      icon: <HomeIcon size={20} />,
      path: "/dashboard",
      subnav: [
        { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> }
      ]
    },
    {
      label: "Quests",
      icon: <Scroll size={20} />,
      path: "/quests",
      subnav: [
        { label: "Quest Journal", path: "/quests", icon: <Scroll size={18} /> },
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
      label: "Progress",
      icon: <BarChart size={20} />,
      path: "/habits",
      subnav: [
        { label: "Habits", path: "/habits", icon: <BarChart size={18} /> },
        { label: "Mood", path: "/mood", icon: <BarChart size={18} /> }
      ]
    },
    {
      label: "System",
      icon: <Settings size={20} />,
      path: "/shop",
      subnav: [
        { label: "Shop", path: "/shop", icon: <BarChart size={18} /> },
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
              {navStructure.map((item) => (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger className="text-rpg-tan hover:bg-rpg-dark-wood">
                    <span className="flex items-center gap-1">
                      {item.icon}
                      <span className="hidden md:inline">{item.label}</span>
                    </span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[220px] p-2 bg-rpg-parchment">
                      {item.subnav.map((subItem) => (
                        <li key={subItem.path}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={subItem.path}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 text-rpg-brown no-underline outline-none transition-colors hover:bg-rpg-tan/30",
                                location.pathname === subItem.path && "bg-rpg-tan/40"
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
