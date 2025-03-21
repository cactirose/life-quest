
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

interface NavItemProps {
  path: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ path, icon, label, isActive }: NavItemProps) => {
  return (
    <Link 
      to={path} 
      className={cn(
        navigationMenuTriggerStyle(), 
        "bg-[hsl(var(--nav-bg))] text-[hsl(var(--nav-text))] hover:bg-[hsl(var(--nav-hover))] border-none", 
        isActive && "bg-[hsl(var(--nav-active))] text-[hsl(var(--nav-active-text))]"
      )}
    >
      <span className="flex items-center gap-1">
        {icon}
        <span className="hidden md:inline">{label}</span>
      </span>
    </Link>
  );
};

export default NavItem;
