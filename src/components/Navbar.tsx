
import { Link, useLocation } from "react-router-dom";
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
  Flag
} from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ThemeSettings } from "./ThemeSettings";

const Navbar = () => {
  const {
    character
  } = useGameData();
  const location = useLocation();
  
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

  return <header className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--nav-bg))] shadow-md py-2">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-xl font-pixel text-[hsl(var(--nav-text))]">Life Quest</h1>
          </Link>
          
          {/* Status Bar */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-[hsl(var(--nav-text))] font-pixel">
              <span>Level: {character.level}</span>
              <span>XP: {character.xp}/{character.nextLevelXp}</span>
              <span>Coins: {character.coins}</span>
            </div>
          </div>
          
          {/* Navigation */}
          <NavigationMenu className="font-pixel">
            <NavigationMenuList>
              {/* Home page */}
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
              
              {/* Quests standalone page */}
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
              
              {/* Dropdown menus */}
              {navStructure.map(item => <NavigationMenuItem key={item.label} className="relative">
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
                      {item.subnav.map(subItem => <li key={subItem.path}>
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
                        </li>)}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>)}
              
              {/* Shop standalone page */}
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
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Theme Settings */}
          <div className="flex items-center">
            <ThemeSettings />
          </div>
        </div>
      </div>
    </header>;
};

export default Navbar;
