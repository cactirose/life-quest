
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MobileNavItemProps {
  path: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
}

const MobileNavItem = ({ path, icon, label, isActive }: MobileNavItemProps) => {
  return (
    <Link 
      to={path}
      className={cn(
        "flex items-center gap-3 p-3 rounded-md font-pixel hover:bg-[hsl(var(--nav-hover))]",
        isActive && "bg-[hsl(var(--nav-active))] text-[hsl(var(--nav-active-text))]"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default MobileNavItem;
