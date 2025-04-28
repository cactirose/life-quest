import { useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  Scroll, 
  ShoppingCart,
} from "lucide-react";
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import NavItem from "./NavItem";
import NavSubmenu from "./NavSubmenu";
import NavActions from "./NavActions";

interface DesktopNavProps {
  navStructure: Array<{
    label: string;
    icon: React.ReactNode;
    path: string;
    subnav: Array<{
      label: string;
      path: string;
      icon: React.ReactNode;
    }>;
  }>;
}

const DesktopNav = ({ navStructure }: DesktopNavProps) => {
  const location = useLocation();

  return (
    <NavigationMenu className="font-pixel hidden md:flex">
      <NavigationMenuList className="flex items-center justify-center space-x-2">
        <NavigationMenuItem className="relative">
          <NavItem 
            path="/dashboard" 
            icon={<HomeIcon size={20} />} 
            label="Home"
            isActive={location.pathname === "/dashboard"} 
          />
        </NavigationMenuItem>
        
        <NavigationMenuItem className="relative">
          <NavItem 
            path="/quests" 
            icon={<Scroll size={20} />} 
            label="Quests"
            isActive={location.pathname === "/quests"} 
          />
        </NavigationMenuItem>
        
        {navStructure.map(item => (
          <NavSubmenu 
            key={item.label}
            label={item.label}
            icon={item.icon}
            path={item.path}
            subnav={item.subnav}
            isActive={location.pathname.startsWith(item.path)}
          />
        ))}
        
        <NavigationMenuItem className="relative">
          <NavItem 
            path="/shop" 
            icon={<ShoppingCart size={20} />} 
            label="Shop"
            isActive={location.pathname === "/shop"} 
          />
        </NavigationMenuItem>
        
        <NavigationMenuItem className="relative">
          <NavActions />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNav;
