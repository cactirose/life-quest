
import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { 
  NavigationMenuItem, 
  NavigationMenuTrigger, 
  NavigationMenuContent, 
  NavigationMenuLink 
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type SubNavItem = {
  label: string;
  path: string;
  icon: ReactNode;
};

interface NavSubmenuProps {
  label: string;
  icon: ReactNode;
  path: string;
  subnav: SubNavItem[];
  isActive: boolean;
}

const NavSubmenu = ({ label, icon, path, subnav, isActive }: NavSubmenuProps) => {
  const location = useLocation();

  return (
    <NavigationMenuItem className="relative">
      <NavigationMenuTrigger className={cn(
        "bg-[hsl(var(--nav-bg))] text-[hsl(var(--nav-text))] hover:bg-[hsl(var(--nav-hover))] border-none", 
        isActive && "bg-[hsl(var(--nav-active))] text-[hsl(var(--nav-active-text))]"
      )}>
        <span className="flex items-center gap-1">
          {icon}
          <span className="hidden md:inline">{label}</span>
        </span>
      </NavigationMenuTrigger>
      <NavigationMenuContent className="min-w-[220px]">
        <ul className="grid w-full p-2 gap-1">
          {subnav.map(subItem => (
            <li key={subItem.path}>
              <NavigationMenuLink asChild>
                <Link to={subItem.path} className={cn(
                  "block select-none space-y-1 rounded-md p-3 text-[hsl(var(--nav-text))] no-underline outline-none transition-colors hover:bg-[hsl(var(--nav-hover))] hover:text-[hsl(var(--nav-text))]", 
                  location.pathname === subItem.path && "bg-[hsl(var(--nav-active))] text-[hsl(var(--nav-active-text))]"
                )}>
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
  );
};

export default NavSubmenu;
